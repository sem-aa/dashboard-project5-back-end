const Card = require('./schemas/card')

const getAllCards = async userId => {
  return await Card.find({ owner: userId })
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
  return await Card.findOneAndDelete({
    _id: cardId,
    owner: userId,
  })
}

const compliteCard = async (userId, cardId) => {
  return await Card.findByIdAndUpdate(
    { _id: cardId, owner: userId },
    { status: 'Complete' },
    {
      new: true,
    }
  )
}

const incompleteCard = async (userId, cardId) => {
    return await Card.findByIdAndUpdate(
      { _id: cardId, owner: userId },
      { status: 'Incomplete' },
      {
        new: true,
      }
    )
}

module.exports = {
  getAllCards,
  addCard,
  updateCard,
  compliteCard,
  incompleteCard,
  removeCard,
}
