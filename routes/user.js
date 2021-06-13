const express = require('express')
const router = express.Router()
const rateLimit = require('express-rate-limit')
const ctrl = require('../controllers/user')
const { validateUser } = require('../validation/userValidate')
const guard = require('../helper/guard')

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: 2, // limit each IP to 100 requests per windowMs
  handler: (req, res, next) => {
    return res.status(429).json({
      message: 'Too many requests',
    })
  },
})

router.post('/register', limiter, validateUser, ctrl.register)
// router.get('/verify/:verifyToken', ctrl.verifyToken)
// router.post('/verify', ctrl.repeatVerifyEmail)

router.post('/login', validateUser, ctrl.logIn)
router.post('/logout', guard, ctrl.logOut)

router.post('/refresh', ctrl.refreshTokens)

module.exports = router
