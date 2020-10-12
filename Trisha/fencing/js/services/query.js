'use script'
const nodemailer = require('nodemailer');
//const resetLink = 'https://www.spotify.com/au/password-reset/' // PLese write your reset webpage link where user is redirected 
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
        html: `<b><h3> Hey, </b><br> <h3>Customer Name: ${options.name} <br>Customer Email: ${options.email} <br>Customer Question: ${options.que} </h3>
        <h4> Thanks <h4>`,
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
