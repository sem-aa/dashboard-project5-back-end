const Joi = require('joi')
const mongoose = require('mongoose')

const schemaAddCard = Joi.object({
  title: Joi.string().optional(),
  difficulty: Joi.string().valid('Easy', 'Normal', 'Hard').required(),
  category: Joi.string()
    .valid('Stuff', 'Family', 'Health', 'Learning', 'Leisure', 'Work')
    .required(),
  date: Joi.string()
    .pattern(/\d\d\d\d-\d\d-\d\d/)
    .required(),
  time: Joi.string()
    .pattern(/\d\d:\d\d/)
    .required(),
  type: Joi.string().valid('Task', 'Challenge').optional(),
})

const schemaUpdateCard = Joi.object({
  title: Joi.string().optional(),
  difficulty: Joi.string().valid('Easy', 'Normal', 'Hard').optional(),
  category: Joi.string()
    .valid('Stuff', 'Family', 'Health', 'Learning', 'Leisure', 'Work')
    .optional(),
  date: Joi.string()
    .pattern(/\d\d\d\d-\d\d-\d\d/)
    .optional(),
  time: Joi.string()
    .pattern(/\d\d:\d\d/)
    .optional(),
  type: Joi.string().valid('Task', 'Challenge').optional(),
})

const validate = require('./validate')

module.exports.validateAddCard = (req, res, next) => {
  return validate(schemaAddCard, req.body, next)
}

module.exports.validateUpdateCard = (req, res, next) => {
  return validate(schemaUpdateCard, req.body, next)
}

module.exports.validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
    res.status(400).json({ message: 'Invalid ObjectId' })
    next(res)
  }
  return next()
}
