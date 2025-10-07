require('dotenv').config()
const app = require('./app')
const { connectDB } = require('./config/db')

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
      await connectDB(MONGO_URI)
    }
    app.listen(PORT, () => {
      console.log(`Lyrics API running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
