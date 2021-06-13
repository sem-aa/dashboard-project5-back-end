const jwt = require('jsonwebtoken')

// const EmailServise = require('../services/email')
const { HttpCode } = require('../helper/constants')

const User = require('../model/user')
const Session = require('../model/session')
const Card = require('../model/card')

require('dotenv').config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY

const register = async (req, res, next) => {
  try {
    const user = await User.getUserByEmail(req.body.email)
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        message: 'Email in use',
      })
    }

    const newUser = await User.createUser(req.body)
    // const { email, verifyTokenEmail } = newUser
    // try {
    //   const emailServise = new EmailServise(process.env.NODE_ENV)
    //   await emailServise.sendVerifyEmail(verifyTokenEmail, email)
    // } catch (error) {
    //   console.log('Error in emailServise.sendVerifyEmail', error.message)
    // }
    return res.status(HttpCode.CREATED).json({
      user: {
        email,
      },
    })
  } catch (error) {
    next(error)
  }
}

// const verifyToken = async (req, res, next) => {
//   try {
//     const user = await User.getUserByVerifyTokenEmail(req.params.verifyToken)
//     if (user.verify) {
//       return res.status(HttpCode.BAD_REQUEST).json({
//         message: 'Verification has already been passed',
//       })
//     }
//     if (user) {
//       await User.updateVerifyToken(user.id, true)
//       return res.status(HttpCode.OK).json({
//         message: 'Verification successful',
//       })
//     }
//     return res.status(HttpCode.NOT_FOUND).json({
//       message: 'User not found',
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// const repeatVerifyEmail = async (req, res, next) => {
//   try {
//     if (!req.body.email) {
//       return res.status(HttpCode.BAD_REQUEST).json({
//         message: 'missing required field email',
//       })
//     }
//     const user = await User.getUserByEmail(req.body.email)
//     const { email, verifyTokenEmail, verify } = user
//     if (verify) {
//       return res.status(HttpCode.BAD_REQUEST).json({
//         message: 'Verification has already been passed',
//       })
//     }
//     const emailServise = new EmailServise(process.env.NODE_ENV)
//     await emailServise.sendVerifyEmail(verifyTokenEmail, email)
//     return res.status(HttpCode.OK).json({
//       message: 'Verification email sent',
//     })
//   } catch (error) {
//     next(error)
//   }
// }

const logIn = async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.getUserByEmail(email)
  const isValidPassword = user?.validPassword(password)
  if (!user || !isValidPassword) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      message: 'Email or password is wrong',
    })
  }
  // if (!user.verify) {
  //   return res.status(HttpCode.BAD_REQUEST).json({
  //     message: 'User not verify',
  //   })
  // }

  const { sid } = await Session.createSession(user.id)
  const accessToken = jwt.sign({ id: user.id, sid }, JWT_SECRET_KEY, {
    expiresIn: '2h',
  })
  const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET_KEY, {})

  await User.updateAccessAndRefreshToken(user.id, accessToken, refreshToken)

  const cards = await Card.getAllCards(user.id)

  return res.status(HttpCode.OK).json({
    accessToken,
    refreshToken,
    sid,
    user: {
      email: user.email,
      id: user.id,
      cards,
    },
  })
}

const refreshTokens = async (req, res, next) => {
  const { sid } = req.body
  const [, refreshToken] = req.get('Authorization')?.split(' ')

  const user = await User.getUserByRefreshToken(refreshToken)
  if (!user) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      message: 'Invalid refresh token',
    })
  }

  const currentSession = await Session.getSession(user.id)
  if (currentSession.sid !== sid) {
    return res.status(HttpCode.NOT_FOUND).json({
      message: 'Invalid session',
    })
  }

  const newSession = await Session.createSession(user.id)
  const newAccessToken = jwt.sign(
    { id: user.id, sid: newSession.sid },
    JWT_SECRET_KEY,
    {
      expiresIn: '2h',
    }
  )
  const newRefreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET_KEY, {})
  await User.updateAccessAndRefreshToken(
    user.id,
    newAccessToken,
    newRefreshToken
  )

  return res.status(HttpCode.OK).json({
    newSid: newSession.sid,
    newAccessToken,
    newRefreshToken,
  })
}

const logOut = async (req, res, next) => {
  const id = req.user?.id
  const user = await User.getUserById(id)
  if (!user) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      message: 'Not authorized',
    })
  }
  await Session.removeSession(user.id)
  await User.updateAccessAndRefreshToken(user.id, null, null)
  return res.status(HttpCode.NO_CONTENT).json({})
}

module.exports = {
  register,
  verifyToken,
  repeatVerifyEmail,
  logIn,
  refreshTokens,
  logOut,
}
