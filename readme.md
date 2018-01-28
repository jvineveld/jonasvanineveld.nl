# [jonasvanineveld.nl](https://jonasvanineveld.nl/)

## Introduction
This is my personal website. Everything in this repository has been written by me. (except for some of the svg icons, and code highlighting on plugin pages)
The reason i put this online is for others to inspect, learn, and give me tips for improvement.

The website was developed on macOSX, with ATOM / CodeKit / MAMP PRO (apache / PHP7.1) / Google Chrome.
On the production server it runs under nginx with php7.1 fpm

## How it works
I've written a php site manager in which the site routing happens. Also i wrote a mail class for the contact form, and some global usefull methods.

* You can find the PHP classes in /build/
* The .less files are in /resources/css/less/
* The templates are in /pages/*page_type*/

### CSS styling

#### Frontpage
The frontpage is done without javascript.
The logic of the animation is pretty simple, it's a element with a X number of radio options. After these radio options (wich are all of the same group)

#### Plugins / other pages
For each page i have a seperate css file because my content will re-use styling, but can also be very different depending on de module / page or idea.

### PHP classes
#### mailer { }
A mailing class that checks for a post request. If there's a post request with the required postdata it sends me a email.
Also i build in some helper functions for using templates.
It has fine spam protection so far, if not, google captcha will be added later.

#### site { }
In the main site class the page routing is configured.
Like, what url should load wich files?
Also i added some helper functions here to prevent code duplication.
On my dev envoriment (.test) it will trigger 'devmode'. This will prevent GA from loading. Also it will load css as an external file instead of embedding it, so i can use css mapping.

## Why no mySQL or CMS?
Because with a CMS you cannot fully control your content. It always loads and does extra things. Yes, you can tune it almost fully to your liking, but this way there's full control of everything. I don't mind writing everything in HTML.
Also, because of this control i can load fully optimized css and js for each page. Not that automaticly generated crap. No, exactly the css and js the page requires.

## Setting it up
You could set it up locally, just clone the repo and config a virtual host.
Then create a config.php with the following content:
define('EMAIL_ADRESS', 'XXXXXXX@XXXXXXX.TLD'); 	// update with your email
define('GTAG_ID', 'XXXXXXXXXXXXXXXXXX');		// update with your gtag id

### nginx
For nginx to work you should add the following rules to the server block:

```
server {
	index index.php;

	location / {
		try_files $uri $uri/ /index.php;
	}

	location ~ \.php$ {
		include fastcgi.conf;
	  	fastcgi_pass unix:/run/php/php7.0-fpm.sock;
	}
}
```

## Styling
To compile less to minified and autoprefixed css i use codekit 3.
