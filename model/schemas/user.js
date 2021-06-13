const mongoose = require('mongoose')
const bCrypt = require('bcryptjs')
const { nanoid } = require('nanoid')
require('dotenv').config()

const SALT_FACTOR = process.env.SALT_FACTOR
const { Schema, model } = mongoose

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email required'],
      unique: true,
      validate(value) {
        const re =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        return re.test(String(value).toLowerCase())
      },
    },
    password: {
      type: String,
      required: [true, 'Password required'],
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    // verifyTokenEmail: {
    //   type: String,
    //   required: [true, 'Verify token is required'],
    //   default: nanoid(),
    // },
    // verify: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bCrypt.genSalt(Number(SALT_FACTOR))
    this.password = await bCrypt.hash(this.password, salt)
  }
})

userSchema.methods.validPassword = async function (password) {
  return await bCrypt.compare(password, this.password)
}

const User = model('user', userSchema)

module.exports = User
