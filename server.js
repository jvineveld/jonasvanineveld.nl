"use strict";

const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const compression = require('compression')
const express = require('express')
const app = express()
const fs = require('fs');
const path = require('path');
const showdown  = require('showdown');
const converter = new showdown.Converter();
const port = 8080;

dotenv.load()
app.use(compression())

const parseCsv = function(data){
	let lines = {};

	let l = data.split('\n');

	l.forEach(line => {
		if(line.trim()=='') return;

		let r = line.split(',');

		lines[r[0]] = converter.makeHtml(r[1]).replace(/\<p\>/g, '').replace(/\<\/p\>/g, '');
	});

	return lines;
}

let md_line_file_contents = false;

const load_markdown_lines = async function(){
	if(md_line_file_contents) return;

	return new Promise((resolve, reject) => {
		var filePath = path.join(__dirname, '/content/nl/lines.csv');
		fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
			if (!err) {
				md_line_file_contents = parseCsv(data)
				resolve(md_line_file_contents)
			} else {
				reject(err);
			}
		});
	})
}

const load_markdown_file = async function(file){
	return new Promise((resolve, reject) => {
		fs.readFile(file, {encoding: 'utf-8'}, function(err,data){
			if (!err) {
				resolve(data)
			} else {
				reject(err);
			}
		});
	})
}

let md_blocks = [];

const load_markdown_blocks = async function(){
	if(md_blocks.length > 0) return;

	return new Promise((resolve, reject) => {
		let md_path = '/content/nl/';
		let filePath = path.join(__dirname, md_path);

		fs.readdir(filePath, function(err, items) {
			if (!err) {
				let promises = [];
				for (let i=0; i<items.length; i++) {
					if(items[i].includes('.md'))
					{
						let _path = path.join(__dirname, md_path, items[i]);
						promises.push(load_markdown_file(_path));

						md_blocks.push({
							name: items[i].replace('.md', ''),
							path: _path,
						})
					}
				}

				Promise.all(promises).then(results => {
					results.forEach((block, index) => {
						md_blocks[index].block = converter.makeHtml(block)
					})

					resolve(md_blocks)
				}).catch((err) => {
					reject(err)
				})
			} else {
				reject(err);
			}
		});
	})
}

const get_md_line = function(name){
	return md_line_file_contents[name] ? md_line_file_contents[name] : '';
}

const check_for_markdown_line = function(name){
	if(md_line_file_contents){
		return get_md_line(name)
	}
}

const check_for_markdown_block = function(name){
	let rblock = false;
	md_blocks.forEach(block => {
		if(block.name === name){
			rblock = block.block;
		}
	})
	return rblock;
}

const init_markdown_content = async function(content){
	await load_markdown_lines();
	await load_markdown_blocks();

	content = content.replace(/\[\#(.*?)\|(.*?)\#\]/g, function(match, type, name, asd){
		type = type.trim()
		name = name.trim()

		switch(type){
			case 'md-line':
				return check_for_markdown_line(name);

			case 'md-block':
				return check_for_markdown_block(name);
		}
	});
	
	return content;
}

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


app.get('/', function(req, res){
	var filePath = path.join(__dirname, '/public/index.html');
	fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
		if (!err) {
			res.writeHead(200, {'Content-Type': 'text/html'});
			init_markdown_content(data).then(resp => {
				res.write(resp);
				res.end();
			})
		} else {
			console.log(err);
			res.end('index.html is missing\n');
		}
	});
})

app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root

app.listen(port);
console.log('Listening on port '+port);