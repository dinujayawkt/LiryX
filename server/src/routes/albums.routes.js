const { Router } = require('express')
const { authenticate, requireAdmin } = require('../middleware/auth')
const { uploadImage } = require('../middleware/upload')
const Album = require('../models/Album')

const router = Router()

router.get('/', async (_req, res) => {
  const items = await Album.find().limit(100).sort({ createdAt: -1 })
  res.json(items)
})

router.post('/', authenticate, requireAdmin, uploadImage.single('image'), async (req, res) => {
  const { title, artist, year } = req.body
  const coverUrl = req.file?.path
  if (!title || !artist) return res.status(400).json({ message: 'Missing fields' })
  const album = await Album.create({ title, artist, year, coverUrl })
  res.status(201).json(album)
})

router.patch('/:id', authenticate, requireAdmin, async (req, res) => {
  const album = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(album)
})

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  await Album.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

module.exports = router
