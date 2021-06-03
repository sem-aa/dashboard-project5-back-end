const express = require('express')
const router = express.Router()
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: 2, // limit each IP to 100 requests per windowMs
  handler: (req, res, next) => {
    return res.status(429).json({
      message: 'Too many requests',
    })
  },
})

router.post('/signup', limiter, (req, res, next) => {})

module.exports = router
