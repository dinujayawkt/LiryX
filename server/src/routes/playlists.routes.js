const { Router } = require('express')
const { authenticate } = require('../middleware/auth')
const Playlist = require('../models/Playlist')

const router = Router()

// List my playlists
router.get('/', authenticate, async (req, res) => {
  const lists = await Playlist.find({ user: req.user.id }).sort({ updatedAt: -1 })
  res.json(lists)
})

// Create playlist
router.post('/', authenticate, async (req, res) => {
  const { title, description = '', coverUrl = '' } = req.body
  if (!title) return res.status(400).json({ message: 'Title is required' })
  const pl = await Playlist.create({ user: req.user.id, title, description, coverUrl })
  res.status(201).json(pl)
})

// Get playlist with tracks
router.get('/:id', authenticate, async (req, res) => {
  const pl = await Playlist.findOne({ _id: req.params.id, user: req.user.id }).populate('tracks')
  if (!pl) return res.status(404).json({ message: 'Not found' })
  res.json(pl)
})

// Update playlist metadata
router.patch('/:id', authenticate, async (req, res) => {
  const { title, description, coverUrl } = req.body
  const pl = await Playlist.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $set: { ...(title != null && { title }), ...(description != null && { description }), ...(coverUrl != null && { coverUrl }) } },
    { new: true }
  )
  if (!pl) return res.status(404).json({ message: 'Not found' })
  res.json(pl)
})

// Delete playlist
router.delete('/:id', authenticate, async (req, res) => {
  await Playlist.findOneAndDelete({ _id: req.params.id, user: req.user.id })
  res.json({ ok: true })
})

// Add track to playlist
router.post('/:id/tracks', authenticate, async (req, res) => {
  const { songId } = req.body
  if (!songId) return res.status(400).json({ message: 'songId required' })
  const pl = await Playlist.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $addToSet: { tracks: songId } },
    { new: true }
  ).populate('tracks')
  if (!pl) return res.status(404).json({ message: 'Not found' })
  res.json(pl)
})

// Remove track from playlist
router.delete('/:id/tracks/:songId', authenticate, async (req, res) => {
  const pl = await Playlist.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $pull: { tracks: req.params.songId } },
    { new: true }
  ).populate('tracks')
  if (!pl) return res.status(404).json({ message: 'Not found' })
  res.json(pl)
})

module.exports = router
