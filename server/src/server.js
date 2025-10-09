require('dotenv').config()
const app = require('./app')
const { connectDB, getDBStatus } = require('./config/db')
const User = require('./models/User')

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

if (!process.env.JWT_SECRET) {
  // Provide a development fallback to avoid crashes; recommend setting a real secret in production
  process.env.JWT_SECRET = 'devsecret-change-me'
  console.warn('JWT_SECRET not set. Using insecure development default. Set JWT_SECRET in .env for production.')
}

async function start() {
  try {
    if (!MONGO_URI) {
      console.warn('MONGO_URI not set. Server will start without DB connection.')
    } else {
      console.log('[DB] MONGO_URI detected. Attempting to connect...')
      await connectDB(MONGO_URI)
      const db = getDBStatus()
      console.log(`[Startup] DB ready: ${db.host}:${db.port}/${db.name} (state: ${db.state})`)
      // Ensure indexes match schema (fixes previous non-sparse unique indexes on clerkId)
      try {
        // Attempt to drop legacy index if it exists (ignore error if not present)
        try {
          await User.collection.dropIndex('clerkId_1')
          console.log('[Startup] Dropped legacy index clerkId_1')
        } catch (dropErr) {
          if (!/index not found|ns not found/i.test(dropErr?.message || '')) {
            console.warn('[Startup] Could not drop clerkId_1:', dropErr?.message || dropErr)
          }
        }
        const res = await User.syncIndexes()
        console.log('[Startup] User indexes synchronized:', res)
      } catch (e) {
        console.warn('[Startup] Failed to sync User indexes:', e?.message || e)
      }
    }
    app.listen(PORT, () => {
      const db = getDBStatus()
      console.log(`[Startup] API: http://localhost:${PORT} | DB: ${db.host ? `${db.host}:${db.port}/${db.name}` : 'not-configured'} (${db.state})`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
