const { Router } = require('express')
const Song = require('../models/Song')
const Album = require('../models/Album')

const router = Router()

router.get('/', async (req, res) => {
  const q = (req.query.q || '').trim()
  if (!q) return res.json({ songs: [], albums: [] })
  const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  const [songs, albums] = await Promise.all([
    Song.find({ $or: [{ title: rx }, { artist: rx }] }).populate('album').limit(50),
    Album.find({ $or: [{ title: rx }, { artist: rx }] }).limit(50),
  ])
  res.json({ songs, albums })
})

module.exports = router
