const { Router } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { authenticate } = require('../middleware/auth')

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email in use' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash })
    res.status(201).json({ id: user._id })
  } catch (err) {
    console.error('[AUTH] register error:', err.message)
    res.status(500).json({ message: 'Registration failed', error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    console.error('[AUTH] login error:', err.message)
    res.status(500).json({ message: 'Login failed', error: err.message })
  }
})

// Return current user info
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('_id name email role')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err) {
    console.error('[AUTH] me error:', err.message)
    res.status(500).json({ message: 'Failed to fetch profile' })
  }
})

module.exports = router
