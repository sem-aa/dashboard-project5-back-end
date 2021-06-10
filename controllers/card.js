const Card = require('../model/card')
const heandleError = require('../helper/heandle-error')
const { HttpCode } = require('../helper/constants')

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id
    const cards = await Card.getAllCards(userId)
    res.status(HttpCode.OK).json({ cards })
  } catch (error) {
    next(error)
  }
}

const create = heandleError(async (req, res, next) => {
  const userId = req.user?.id
  const { body } = req
  const createdCard = await Card.addCard(userId, body)
  return res.status(HttpCode.CREATED).json({
    createdCard,
  })
})

const update = heandleError(async (req, res, next) => {
  const userId = req.user?.id
  const { cardId } = req.params

  const { body } = req
  const editedCard = await Card.updateCard(userId, cardId, body)

  if (!editedCard) {
    return res.status(HttpCode.NOT_FOUND).json({
      message: 'Card not found',
    })
  }

  return res.status(HttpCode.OK).json({ editedCard })
})

const complete = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { cardId } = req.params

    const editedCard = await Card.compliteCard(userId, cardId)
    if (!editedCard) {
      return res.status(HttpCode.NOT_FOUND).json({
        message: 'Card not found',
      })
    }

    return res.status(HttpCode.OK).json({ editedCard })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const { cardId } = req.params

    const cardDeleted = await Card.removeCard(userId, cardId)

    if (cardDeleted) {
      return res.status(HttpCode.NO_CONTENT).json({})
    }
    return res.status(HttpCode.NOT_FOUND).json({
      message: 'Card not found',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, create, update, complete, remove }
