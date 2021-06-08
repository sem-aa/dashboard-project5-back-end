const Card = require('../model/card')
const heandleError = require('../helper/heandle-error')

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id
    const cards = await Card.getAllCards(userId)
    res.status(200).json({ cards })
  } catch (error) {
    next(error)
  }
}

const create = heandleError(async (req, res, next) => {
  const userId = req.user?.id
  const { body } = req
  const createdCard = await Card.addCard(userId, body)
  return res.status(201).json({
    createdCard,
  })
})

const update = heandleError(async (req, res, next) => {
  const userId = req.user?.id
  const { cardId } = req.params

  const { body } = req
  const editedCard = await Card.updateCard(userId, cardId, body)
  return res.status(201).json({
    editedCard,
  })
})

// const remove = async (req, res, next) => {
//   try {
//     const userid = req.user?.id
//     const { contactId } = req.params
//     const contactDeleted = await removeContact(userid, contactId)
//     if (contactDeleted) {
//       return res.status(200).json({
//         status: 'contact deleted',
//         code: 200,
//         data: contactDeleted,
//       })
//     } else {
//       return next({
//         status: 404,
//         message: 'Not found',
//       })
//     }
//   } catch (error) {
//     next(error)
//   }
// }

// const update = async (req, res, next) => {
//   try {
//     const userid = req.user?.id
//     const { contactId } = req.params
//     const { body } = req
//     const contact = await updateContact(userid, contactId, body)
//     if (contact) {
//       return res.status(200).json({
//         status: 'success',
//         code: 200,
//         data: {
//           contact,
//         },
//       })
//     } else {
//       return next({
//         status: 404,
//         message: 'Not found',
//       })
//     }
//   } catch (error) {
//     next(error)
//   }
// }

// const updateFavorite = async (req, res, next) => {
//   try {
//     const userid = req.user?.id
//     const { contactId } = req.params
//     const { body } = req
//     if (body) {
//       const contact = await updateStatusContact(userid, contactId, body)
//       return res.status(200).json({
//         status: 'success',
//         code: 200,
//         data: {
//           contact,
//         },
//       })
//     } else {
//       return next({
//         status: 400,
//         message: 'missing field favorite',
//       })
//     }
//   } catch (error) {
//     next(error)
//   }
// }

module.exports = { getAll, create, update }
