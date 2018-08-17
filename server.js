const connect = require('connect');
const serveStatic = require('serve-static');
const nodemailer = require('nodemailer');
const app = connect();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');


dotenv.load()

console.log(process.env.MAILSERVER)
const port = 8080;

const send_mail = function(htmlContents, plainContents, name){
	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	nodemailer.createTestAccount((err, account) => {
		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: process.env.MAILSERVER,
			port: 587,
			secure: true, // true for 465, false for other ports
			auth: {
				user: process.env.MAILSERVER_USER, // generated ethereal user
				pass: process.env.MAILSERVER_PASS // generated ethereal password
			}
		});

		// setup email data with unicode symbols
		let mailOptions = {
			from: 'info@makeityourown.nl', // sender address
			to: 'jonas@makeityourown.nl', // list of receivers
			subject: 'Website contact: '+name, // Subject line
			text: plainContents, // plain text body
			html: htmlContents // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: %s', info.messageId);
			// Preview only available when sending through an Ethereal account
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

			// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
			// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
		});
	});
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/mail', function(req, res){
	let mailContents = '<div style="font-family:arial; font-size: 14px; line-height: 1.4;">',
		plainContents = '';

	let expected_fields = {
		'name': 'Naam',
		'contact': 'Contact informatie',
		'description': 'Omschrijving',
	};

	let posted_fields = req.body;

	for(let field of Object.keys(expected_fields)){
		let value = posted_fields[field];

		if(!value){
			res.end('Missing required fields!\n');
		}

		mailContents += '<dl>';
		mailContents += '<dt style="font-weight:bold; padding-bottom: 6px;">'+expected_fields[field]+'</dt>';
		mailContents += '<dd style="margin-left: 20px;">'+value.replace(/\n/g, "<br />")+'</dd>';
		mailContents += '</dl>';

		plainContents+= '## ' + expected_fields[field] + '\n';
		plainContents+= value + '\n\n';
		
	}

	mailContents += '</div>';

	send_mail(mailContents, plainContents, posted_fields['name']);
});

app.use(serveStatic(__dirname+'/public')).listen(port, function(){
	console.log('Server running on 8080...');
	
	var url = 'http://localhost:'+port;
	var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
	require('child_process').exec(start + ' ' + url);
});
