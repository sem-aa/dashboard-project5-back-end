const sendgrid = require('@sendgrid/mail')
const Mailgen = require('mailgen')
require('dotenv').config()

class EmailServise {
  #sender = sendgrid
  #GenerateTemplate = Mailgen

  constructor(env) {
    switch (env) {
      case 'development':
        this.link = 'http://localhost:3001'
        break
      case 'production':
        this.link = 'link for production'
        break
      default:
        this.link = 'http://localhost:3001'
    }
  }

  #createTemplateVerifyToken(verifyToken) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: 'cerberus',
      product: {
        name: 'Dashboard',
        link: this.link,
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
      },
    })
    const email = {
      body: {
        name: 'Friend!)',
        intro: "Welcome to Dashboard! We're very excited to have you on board.",
        action: {
          instructions:
            'To get started with "System Dashboard", please click here:',
          button: {
            color: '#363636', // Optional action button color
            text: 'Confirm your account',
            link: `${this.link}/auth/verify/${verifyToken}`,
          },
        },
      },
    }
    const emailBody = mailGenerator.generate(email)
    return emailBody
  }

  async sendVerifyEmail(verifyToken, email) {
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email, // Change to your recipient
      from: 'goit.team.2021@meta.ua', // Change to your verified sender
      subject: 'Verify email',
      html: this.#createTemplateVerifyToken(verifyToken),
    }
    await this.#sender.send(msg)
  }
}

module.exports = EmailServise
