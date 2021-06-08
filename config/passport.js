const passport = require('passport')
const User = require('../model/user')
const Session = require('../model/session')

require('dotenv').config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const { Strategy, ExtractJwt } = require('passport-jwt')
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET_KEY,
}
passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const user = await User.getUserById(payload.id)
      const session = await Session.getSession(payload.id)

      console.log('session.sid: ', session.sid)
      console.log('payload.sid: ', payload.sid)

      if (!user) {
        return new Error('User not found')
      }
      if (!user.accessToken) {
        return done(null, false)
      }
      if (session.sid !== payload.sid) {
        return done(null, false)
      }
      return done(null, user)
    } catch (error) {
      return done(error, false)
    }
  })
)
