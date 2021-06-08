const Session = require('./schemas/session')
const { nanoid } = require('nanoid')

const createSession = async userId => {
  const prevSession = await Session.findOneAndUpdate(
    { owner: userId },
    { sid: nanoid() },
    { new: true }
  )
  return prevSession ? prevSession : await Session.create({ owner: userId })
}

const getSession = async userId => {
  const results = await Session.findOne({ owner: userId })
  return results
}

const removeSession = async (userId, cardId) => {
  await Session.deleteOne({ owner: userId })
}

module.exports = { createSession, getSession, removeSession }
