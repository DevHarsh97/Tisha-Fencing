'use script'
const nodemailer = require('nodemailer');
const resetLink = 'https://www.spotify.com/au/password-reset/' // PLese write your reset webpage link where user is redirected 
const transport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.GMAIL_ID || 'harsh15041997@gmail.com', // YOUR GMAIL ID
      pass: process.env.GMAIL_PASS || 'leaveitup' // YOUR GMAIL PASS
    }
});

/**
 * 
 * @param {string} url Email id of User 
 * @param {object} options User mail options includes email, name, subject, uniqueCode, resetLink
 */
module.exports = async (options) => {
    const mailOptions = {
        from: 'harsh_node@web.app', // FROM EMAIL_ID 
        to: options.email, // Example to send multiple email id
        subject: options.subject,
        text: `<YOUR TEXT_CONTENT_GOES_HERE>`,
        html: `<b><h2> Hey ${options.fullname}, </b><br> <h3>Please use the code <strong style="color: red;"> ${options.uniqueCode} </strong> to reset your password <a href="${resetLink}">here</a></h3><br />`,
        // attachments: [                       // OPTIONAL ATTCHMENTS
        //   {
        //     filename: 'mailtrap.png',
        //     path: __dirname + '/mailtrap.png',
        //     cid: 'uniq-mailtrap.png' 
        //   }
        // ]
      }
      try {
          const result = await transport.sendMail(mailOptions)
          console.log('SEND MAIL OBJECT >>>', result)
          console.log(`Message sent: ${result.messageId}`)
          return result
      } catch (error) {
          console.error(error)
          return error
      }
}
