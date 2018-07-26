const express = require('express')
const nodemailer = require('nodemailer')

const app = express()

app.use(express.static('dist'))

app.get('/api/sendMail', () => {
	nodemailer.createTestAccount((err, account) => {
		let transporter = nodemailer.createTransport({
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: account.user, // generated ethereal user
				pass: account.pass // generated ethereal password
			}
		})

		let mailOptions = {
			from: '"Fred Foo 👻" <foo@example.com>', 
			to: 'bar@example.com, baz@example.com', 
			subject: 'Hello ✔', 
			text: 'Hello world?',
			html: '<b>Hello world?</b>' 
		}

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error)
			}
			console.log('Message sent: %s', info.messageId)
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))

			// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
			// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
		})
	})
})

app.listen(8080, () => console.log('Listening on port 8080!'))
