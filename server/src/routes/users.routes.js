const { Router } = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { authenticate, requireAdmin } = require('../middleware/auth')

const router = Router()

// Admin: list users
router.get('/', authenticate, requireAdmin, async (_req, res) => {
  const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 }).limit(200)
  res.json(users)
})

// Admin: create user
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { name, email, password, role = 'user' } = req.body
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' })
  const exists = await User.findOne({ email })
  if (exists) return res.status(409).json({ message: 'Email in use' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash, role })
  res.status(201).json({ id: user._id })
})

// Admin: update role or name
router.patch('/:id', authenticate, requireAdmin, async (req, res) => {
  const { name, role } = req.body
  const user = await User.findByIdAndUpdate(req.params.id, { name, role }, { new: true, projection: { passwordHash: 0 } })
  res.json(user)
})

// Admin: delete user
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

module.exports = router
