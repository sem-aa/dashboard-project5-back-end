const User = require('./schemas/user')

const getUserById = async userId => {
  return await User.findOne({ _id: userId })
}

const getUserByEmail = async email => {
  return await User.findOne({ email })
}

const getUserByAccesToken = async accessToken => {
  return await User.findOne({ accessToken })
}

const getUserByVerifyTokenEmail = async token => {
  return await User.findOne({ verifyTokenEmail: token })
}

const createUser = async userOptions => {
  const user = await new User(userOptions)
  return await user.save()
}

const updateAccessAndRefreshToken = async (id, accessToken, refreshToken) => {
  return await User.updateOne({ _id: id }, { accessToken, refreshToken })
}

const updateVerifyToken = async (id, verify) => {
  return await User.updateOne({ _id: id }, { verify })
}

module.exports = {
  getUserById,
  getUserByEmail,
  getUserByAccesToken,
  getUserByVerifyTokenEmail,
  createUser,
  updateAccessAndRefreshToken,
  updateVerifyToken,
}
