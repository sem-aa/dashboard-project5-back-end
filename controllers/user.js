const jwt = require('jsonwebtoken')

const EmailServise = require('../services/email')
const User = require('../model/user')
const { HttpCode } = require('../helper/constants')
require('dotenv').config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY

const register = async (req, res, next) => {
  const user = await User.getUserByEmail(req.body.email)
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      message: 'Email in use',
    })
  }
  try {
    const newUser = await User.createUser(req.body)
    const { email, verifyTokenEmail } = newUser
    try {
      const emailServise = new EmailServise(process.env.NODE_ENV)
      await emailServise.sendVerifyEmail(verifyTokenEmail, email)
    } catch (error) {
      console.log('Error in emailServise.sendVerifyEmail', error.message)
    }
    return res.status(HttpCode.CREATED).json({
      user: {
        email,
      },
    })
  } catch (error) {
    next(error)
  }
}

const verifyToken = async (req, res, next) => {
  try {
    const user = await User.getUserByVerifyTokenEmail(req.params.verifyToken)
    if (user.verify) {
      return res.status(HttpCode.BAD_REQUEST).json({
        message: 'Verification has already been passed',
      })
    }
    if (user) {
      await User.updateVerifyToken(user.id, true)
      return res.status(HttpCode.OK).json({
        message: 'Verification successful',
      })
    }
    return res.status(HttpCode.NOT_FOUND).json({
      message: 'User not found',
    })
  } catch (error) {
    next(error)
  }
}

const repeatVerifyEmail = async (req, res, next) => {
  try {
    if (!req.body.email) {
      return res.status(HttpCode.BAD_REQUEST).json({
        message: 'missing required field email',
      })
    }
    const user = await User.getUserByEmail(req.body.email)
    const { email, verifyTokenEmail, verify } = user
    if (verify) {
      return res.status(HttpCode.BAD_REQUEST).json({
        message: 'Verification has already been passed',
      })
    }
    const emailServise = new EmailServise(process.env.NODE_ENV)
    await emailServise.sendVerifyEmail(verifyTokenEmail, email)
    return res.status(HttpCode.OK).json({
      message: 'Verification email sent',
    })
  } catch (error) {
    next(error)
  }
}

const logIn = async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.getUserByEmail(email)
  const isValidPassword = user?.validPassword(password)
  if (!user || !isValidPassword) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      message: 'Email or password is wrong',
    })
  }
  if (!user.verify) {
    return res.status(HttpCode.BAD_REQUEST).json({
      message: 'User not verify',
    })
  }
  const accessToken = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
    expiresIn: '2h',
  })
  const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET_KEY, {})
  //
  await User.updateAccessAndRefreshToken(user.id, accessToken, refreshToken)
  return res.status(HttpCode.OK).json({
    accessToken,
    refreshToken,
    user: {
      email: user.email,
    },
  })
}

// const getCurrent = async (req, res, next) => {
//   const { user } = req
//   if (!user) {
//     return res.status(HttpCode.UNAUTHORIZED).json({
//       message: 'Not authorized',
//     })
//   }
//   return res.status(HttpCode.OK).json({
//     token: user.token,
//     user: {
//       email: user.email,
//       subscription: user.subscription,
//       avatar: user.avatar,
//       verify: user.verify,
//     },
//   })
// }

const logOut = async (req, res, next) => {
  const id = req.user?.id
  const user = await User.getUserById(id)
  if (!user) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      message: 'Not authorized',
    })
  }
  await User.updateAccessAndRefreshToken(user.id, null, null)
  return res.status(HttpCode.NO_CONTENT).json({})
}

module.exports = {
  register,
  verifyToken,
  repeatVerifyEmail,
  logIn,
  //   getCurrent,
  logOut,
}
