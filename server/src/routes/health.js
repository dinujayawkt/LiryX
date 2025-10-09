const { Router } = require('express')
const { getDBStatus } = require('../config/db')

const router = Router()

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'lyrics-api',
    time: new Date().toISOString(),
    db: getDBStatus(),
  })
})

module.exports = router
