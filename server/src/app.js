const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const healthRouter = require('./routes/health')
const authRouter = require('./routes/auth.routes')
const songsRouter = require('./routes/songs.routes')
const albumsRouter = require('./routes/albums.routes')
const usersRouter = require('./routes/users.routes')
const searchRouter = require('./routes/search.routes')
const playlistsRouter = require('./routes/playlists.routes')
const favoritesRouter = require('./routes/favorites.routes')

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/songs', songsRouter)
app.use('/api/albums', albumsRouter)
app.use('/api/users', usersRouter)
app.use('/api/search', searchRouter)
app.use('/api/playlists', playlistsRouter)
app.use('/api/favorites', favoritesRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' })
})

module.exports = app
