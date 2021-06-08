const Card = require('./schemas/card')

const getAllCards = async userId => {
  return await Card.find({ owner: userId })
}

const getCardById = async (userId, cardId) => {
  const results = await Card.findOne({
    _id: cardId,
    owner: userId,
  })
  return results
}

const addCard = async (userId, body) => {
  const results = await Card.create({ ...body, owner: userId })
  return results
}

const updateCard = async (userId, cardId, body) => {
  const results = await Card.findByIdAndUpdate(
    { _id: cardId, owner: userId },
    body,
    {
      new: true,
    }
  )
  return results
}

const removeCard = async (userId, cardId) => {
  const results = await Card.findByIdAndRemove({
    _id: cardId,
    owner: userId,
  })
  return results
}

module.exports = { getAllCards, getCardById, addCard, updateCard, removeCard }
