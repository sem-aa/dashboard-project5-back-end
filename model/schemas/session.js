const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

const { Schema, model, SchemaTypes } = mongoose

const sessionSchema = new Schema(
  {
    sid: {
      type: String,
      default: nanoid(),
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const Session = model('session', sessionSchema)

module.exports = Session
