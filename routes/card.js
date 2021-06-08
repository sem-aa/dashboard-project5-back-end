const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/card')
const {
  validateAddCard,
  validateUpdateCard,
  validateObjectId,
} = require('../validation/cardValidate')
const guard = require('../helper/guard')

router.get('/', guard, ctrl.getAll)
router.post('/', guard, validateAddCard, ctrl.create)

router.patch(
  '/:cardId',
  guard,
  validateObjectId,
  validateUpdateCard,
  ctrl.update
)

// router.patch(
//   '/:cardId/favorite',
//   guard,
//   validateObjectId,
//   validateUpdateContact,
//   ctrl.updateFavorite
// )

// router.delete('/:cardId', guard, validateObjectId, ctrl.remove)

module.exports = router
