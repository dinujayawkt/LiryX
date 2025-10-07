const { Router } = require('express')
const { authenticate, requireAdmin } = require('../middleware/auth')
const { uploadAudio, uploadImage } = require('../middleware/upload')
const Song = require('../models/Song')

const router = Router()

router.get('/', async (_req, res) => {
  const items = await Song.find().limit(100).sort({ createdAt: -1 })
  res.json(items)
})

router.post('/', authenticate, requireAdmin, uploadAudio.single('audio'), async (req, res) => {
  const { title, artist, albumId } = req.body
  if (!title || !artist || !req.file?.path) return res.status(400).json({ message: 'Missing fields' })
  const song = await Song.create({ title, artist, album: albumId || null, audioUrl: req.file.path })
  res.status(201).json(song)
})

router.post('/:id/cover', authenticate, requireAdmin, uploadImage.single('image'), async (req, res) => {
  const song = await Song.findByIdAndUpdate(req.params.id, { coverUrl: req.file?.path }, { new: true })
  res.json(song)
})

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  await Song.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

module.exports = router
