const { Router } = require('express')
const { authenticate } = require('../middleware/auth')
const User = require('../models/User')
const Song = require('../models/Song')

const router = Router()

// Get my favorite songs (populated)
router.get('/', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id).populate({ path: 'favorites', populate: { path: 'album' } })
  res.json(user?.favorites || [])
})

// Toggle favorite
router.post('/:songId', authenticate, async (req, res) => {
  const { songId } = req.params
  const song = await Song.findById(songId)
  if (!song) return res.status(404).json({ message: 'Song not found' })

  const user = await User.findById(req.user.id)
  const exists = user.favorites.some((id) => id.toString() === songId)
  if (exists) {
    user.favorites = user.favorites.filter((id) => id.toString() !== songId)
  } else {
    user.favorites.push(songId)
  }
  await user.save()
  const populated = await user.populate('favorites')
  res.json({ favorites: populated.favorites, liked: !exists })
})

module.exports = router
