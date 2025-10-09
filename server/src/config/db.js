const mongoose = require('mongoose')

async function connectDB(uri) {
  mongoose.set('strictQuery', true)
  try {
    await mongoose.connect(uri)
    const { host, port, name } = mongoose.connection
    console.log(`[DB] MongoDB connected: ${host}:${port}/${name}`)
    setupConnectionLogging()
  } catch (err) {
    console.error('[DB] MongoDB connection error:', err.message)
    throw err
  }
}

function getDBStatus() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }
  const conn = mongoose.connection
  return {
    state: states[conn.readyState] || 'unknown',
    name: conn.name || null,
    host: conn.host || null,
    port: conn.port || null,
  }
}

let listenersAttached = false
function setupConnectionLogging() {
  if (listenersAttached) return
  listenersAttached = true
  const conn = mongoose.connection
  conn.on('connected', () => {
    const { host, port, name } = conn
    console.log(`[DB] connected: ${host}:${port}/${name}`)
  })
  conn.on('disconnected', () => {
    console.warn('[DB] disconnected')
  })
  conn.on('reconnected', () => {
    console.log('[DB] reconnected')
  })
  conn.on('error', (err) => {
    console.error('[DB] error:', err?.message || err)
  })
}

module.exports = { connectDB, getDBStatus }
