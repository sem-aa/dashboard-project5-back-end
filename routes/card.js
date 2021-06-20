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

router.delete('/:cardId', guard, validateObjectId, ctrl.remove)
router.patch(
  '/:cardId',
  guard,
  validateObjectId,
  validateUpdateCard,
  ctrl.update
)

router.patch('/:cardId/complete', guard, validateObjectId, ctrl.complete)
router.patch('/:cardId/incomplete', guard, validateObjectId, ctrl.incomplete)

module.exports = router
