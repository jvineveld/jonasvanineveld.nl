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

let domain = 'localhost:8080';

let languages = {
	nl: {
		name: 'Nederlands',
		path: '/',
		lines: {},
		blocks: []
	},
	en: {
		name: 'English',
		path: '/en/',
		lines: {},
		blocks: []
	}
};

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

const load_markdown_lines = async function(lang){
	if(languages[lang].lines.length) return;

	return new Promise((resolve, reject) => {
		var filePath = path.join(__dirname, '/content/'+lang+'/lines.csv');
		fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
			if (!err) {
				let lines = parseCsv(data)
				languages[lang].lines = lines
				resolve(lines)
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

const load_markdown_blocks = async function(lang){
	if(languages[lang].blocks.length > 0) return;

	return new Promise((resolve, reject) => {
		let md_path = '/content/'+lang+'/';
		let filePath = path.join(__dirname, md_path);

		fs.readdir(filePath, function(err, items) {
			if (!err) {
				let promises = [];
				for (let i=0; i<items.length; i++) {
					if(items[i].includes('.md'))
					{
						let _path = path.join(__dirname, md_path, items[i]);
						promises.push(load_markdown_file(_path));

						languages[lang].blocks.push({
							name: items[i].replace('.md', ''),
							path: _path,
						})
					}
				}

				Promise.all(promises).then(results => {
					results.forEach((block, index) => {
						languages[lang].blocks[index].block = converter.makeHtml(block)
					})

					resolve(languages[lang].blocks)
				}).catch((err) => {
					reject(err)
				})
			} else {
				reject(err);
			}
		});
	})
}

const get_md_line = function(name, lang){
	return languages[lang].lines[name] ? languages[lang].lines[name] : '';
}

const check_for_markdown_line = function(name, lang){
	if(Object.keys(languages[lang].lines).length){
		return get_md_line(name, lang)
	}
}

const check_for_markdown_block = function(name, lang){
	let rblock = false;
	languages[lang].blocks.forEach(block => {
		if(block.name === name){
			rblock = block.block;
		}
	})
	return rblock;
}

const render_canonicals = function(current_language){
	let html = '';
	let langs = Object.keys(languages).filter((lang) => lang !== current_language);
	
	langs.forEach(lang => {
		html += '<link rel="alternate" hreflang="'+lang+'" href="'+domain+languages[lang].path+'" />';

	})

	return html;
}

const render_language_links = function(current_language){
	let html = '';
	let langs = Object.keys(languages);

	langs.forEach(lang => {
		let active = lang === current_language ? 'data-active' : '';
		html += html !== '' ? '<span class="spacer"></span>' : '';
		html += '<a href="'+languages[lang].path+'" onclick="switch_language(\''+lang+'\', event)" '+active+'>'+languages[lang].name+'</a>';

	})
	return html;
}

const init_markdown_content = async function(content, lang){
	await load_markdown_lines(lang);
	await load_markdown_blocks(lang);

	// console.log(languages)

	content = content.replace(/\[#(.*?)#\]/g, function(match, line){
		let name, type, parts, 
			plain = false;

		parts = line.split('|')

		if( parts.length ) type = parts[0].trim()
		if( parts.length > 1 ) name = parts[1].trim()
		if( parts.length > 2 ) plain = parts[2].trim()

		switch(type){
			case 'md-line':
				return plain ? check_for_markdown_line(name, lang) : '<span data-name="'+name+'" class="md-line">'+check_for_markdown_line(name, lang)+'</span>';

			case 'md-block':
				return plain ? check_for_markdown_block(name, lang) : '<div data-name="'+name+'" class="md-block">'+check_for_markdown_block(name, lang)+'</div>';
			
			case 'canonical_link':
				return render_canonicals(lang);
			
			case 'language_tag':
				return lang;
			
			case 'lang_links':
				return render_language_links(lang);
			
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
			init_markdown_content(data, 'nl').then(resp => {
				res.write(resp);
				res.end();
			})
		} else {
			console.log(err);
			res.end('index.html is missing\n');
		}
	});
})

app.get('/en', function(req, res){
	var filePath = path.join(__dirname, '/public/index.html');
	fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
		if (!err) {
			res.writeHead(200, {'Content-Type': 'text/html'});
			init_markdown_content(data, 'en').then(resp => {
				res.write(resp);
				res.end();
			})
		} else {
			console.log(err);
			res.end('index.html is missing\n');
		}
	});
})

app.get('/en/lines', function(req, res){
	var filePath = path.join(__dirname, '/public/index.html');
	fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
		if (!err) {
			init_markdown_content(data, 'en').then(resp => {
				res.json({...languages['en'], forms: [resp.match(/<form.*?>(.*?)<\/form>/s)[1]]});
				res.end();
			})
		} else {
			console.log(err);
			res.end('index.html is missing\n');
		}
	});
})

app.get('/lines', function(req, res){
	var filePath = path.join(__dirname, '/public/index.html');
	fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
		if (!err) {
			init_markdown_content(data, 'nl').then(resp => {
				res.json({...languages['nl'], forms: [resp.match(/<form.*?>(.*?)<\/form>/s)[1]]});
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