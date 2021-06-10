const mongoose = require('mongoose')

const { Schema, model, SchemaTypes } = mongoose

const cardSchema = new Schema(
  {
    title: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty required'],
    },
    category: {
      type: String,
      required: [true, 'Category required'],
    },
    date: {
      type: String,
      required: [true, 'Date required'],
      validate(value) {
        const re = /\d\d\d\d-\d\d-\d\d/
        return re.test(String(value))
      },
    },
    time: {
      type: String,
      required: [true, 'Date required'],
      validate(value) {
        const re = /\d\d:\d\d/
        return re.test(String(value))
      },
    },
    type: {
      type: String,
      default: 'Task',
    },
    status: {
      type: String,
      default: 'Incomplete',
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
)

const Card = model('card', cardSchema)

module.exports = Card
