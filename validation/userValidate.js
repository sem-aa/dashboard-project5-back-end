const Joi = require('joi')

const schemaAddUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  password: Joi.string().min(6).max(20).required(),
})

const validate = require('./validate')

module.exports.validateUser = (req, res, next) => {
  return validate(schemaAddUser, req.body, next)
}
