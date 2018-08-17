"use strict";

const serveStatic = require('serve-static');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const compression = require('compression')
const express = require('express')
const app = express()
var path = require('path');

const port = 8080;

dotenv.load()
app.use(compression())

const send_mail = function(htmlContents, plainContents, name){
	return new Promise((resolve, reject) => {
		let transporter = nodemailer.createTransport(process.env.MAILSERVER_URL);

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
			if (error){
				console.log('error sending mail', error);
				console.log('plain mail data:', plainContents)
			}

			if(error) reject(error)
			else resolve(true)
		});
	})
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

	send_mail(mailContents, plainContents, posted_fields['name']).then(() => {
		res.json({
			success: true
		});
	}).catch(() => {
		res.json({
			success: false
		});
	})
});

app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root

app.listen(port);
console.log('Listening on port '+port);