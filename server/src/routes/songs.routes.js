const { Router } = require('express')
const { authenticate, requireAdmin } = require('../middleware/auth')
const { uploadAudio, uploadImage } = require('../middleware/upload')
const Song = require('../models/Song')

const router = Router()

router.get('/', async (_req, res) => {
  const items = await Song.find().populate('album').limit(100).sort({ createdAt: -1 })
  res.json(items)
})

// Get one song
router.get('/:id', async (req, res) => {
  const item = await Song.findById(req.params.id).populate('album')
  if (!item) return res.status(404).json({ message: 'Not found' })
  res.json(item)
})

router.post('/', authenticate, requireAdmin, uploadAudio.single('audio'), async (req, res) => {
  try {
    const { title, artist, albumId } = req.body
    if (!title || !artist) return res.status(400).json({ message: 'Missing fields' })
    if (!req.file?.path) return res.status(400).json({ message: 'Audio upload failed' })
    const song = await Song.create({ title, artist, album: albumId || null, audioUrl: req.file.path })
    res.status(201).json(song)
  } catch (e) {
    console.error('[SONGS] create error:', e.message)
    res.status(500).json({ message: 'Failed to create song' })
  }
})

router.post('/:id/cover', authenticate, requireAdmin, uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file?.path) return res.status(400).json({ message: 'Image upload failed' })
    const song = await Song.findByIdAndUpdate(req.params.id, { coverUrl: req.file.path }, { new: true })
    if (!song) return res.status(404).json({ message: 'Not found' })
    res.json(song)
  } catch (e) {
    console.error('[SONGS] cover upload error:', e.message)
    res.status(500).json({ message: 'Failed to update cover' })
  }
})

// Update song metadata
router.patch('/:id', authenticate, requireAdmin, async (req, res) => {
  const { title, artist, albumId } = req.body
  const update = {}
  if (title != null) update.title = title
  if (artist != null) update.artist = artist
  if (albumId !== undefined) update.album = albumId || null
  const song = await Song.findByIdAndUpdate(req.params.id, update, { new: true })
  if (!song) return res.status(404).json({ message: 'Not found' })
  res.json(song)
})

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  await Song.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

module.exports = router
