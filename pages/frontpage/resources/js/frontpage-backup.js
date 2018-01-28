/**
 * Jonas van Ineveld
 * © 2017
 */

var site = function(){

	this.el = {
		logo: document.getElementById('logo'),
		headerLine: document.querySelector("#header .line"),
		contactLink: document.querySelector("#header .contact-link"),
		aboutLink: document.querySelector("#header .about-me"),
		topHalf: document.getElementById('ia-top'),
		bottomHalf: document.getElementById('ia-bottom'),
		blocks_wrap: document.querySelectorAll('.blocks'),
		blocks: document.querySelectorAll(".blocks .block"),
		blocks_close: document.querySelectorAll(".blocks .block .close-link")
	}

	var _site = this;

	this.start_animation = function(){
		var letters = _site.nodeListToArray(_site.el.logo.childNodes);
			letters.shift(), // shift first because it's a <defs> el
			tl = new TimelineLite(),
			logoPos = letters[0].getBoundingClientRect(),
			line = _site.el.headerLine,
			contact = _site.el.contactLink,
			about = _site.el.aboutLink;

		jQuery('#logo').css('opacity', 1)

		tl.staggerFrom(letters, 1.5, {x:-100, opacity:0, delay:.5, ease:Elastic.easeOut, force3D:true}, 0.075);
	//	tl.from(line, 1, {width: 0, delay:-2, ease:Back.easeOut.config(.5)});
	//	tl.from(contact, .3, {x: -20, opacity:0, delay:-1.3, ease:Back.easeOut.config(.5)});
	//	tl.from(about, .3, {x: -20, opacity:0, delay:-1.2,ease:Back.easeOut.config(.5)});

		/**
		 * Blocks
		 */
		var blocks_wrap = _site.el.blocks_wrap,
			blocks = _site.el.blocks;

		tl.from(blocks_wrap, 1, {y: -100, opacity:0, delay:-0.5, ease:Back.easeOut.config(.5)});
		tl.staggerFrom(blocks, 1.5, {y:-50, opacity:0, delay:-0.5, ease:Power2.easeOut, force3D:true}, 0.1);
	};

	this.page_swift_animation = function(){
		var	tl = new TimelineLite(),
			topHalf = _site.el.topHalf,
			botHalf = _site.el.bottomHalf;

		tl.from(topHalf, 1, {fill:'#fff', delay:2, ease:Power3.easeInOut, force3D:true});
		tl.from(botHalf, 1, {fill:'#fff', delay:2, ease:Power3.easeInOut, force3D:true}, .13);
		//	tl.to(this.logo, 1, {y: -logoPos.top, scale:0.4, ease:Power3.easeInOut});
	}

	this.nodeListToArray = function(nodeList){
		var arr = [];
		for(var i = nodeList.length; i--; arr.unshift(nodeList[i]));

		return arr;
	}

	this.addClass = function(node, _class) {
		if (!node.length) node = [node];
		for (var n = 0, m = node.length; n < m; n++) {
			if ((" " + node[n].className + " ").indexOf(" "+_class+" ") >= 0) {
				node.className += " " + _class;
			}
		}
	}

	this.set_event_listeners = function(){
		jQuery(document).on('click', '.action-link', _site.clicked_action);
	}

	this.clicked_action = function(e){
		var action = $(this).data('action');

		switch(action)
		{
			case "open-about":
				_site.display_page('about', true);
			break;

			case "open-projects":
				_site.display_page('projects');
			break;

			case "open-development":
				_site.display_page('development');
			break;

			case "open-contact":
				_site.display_page('contact', true);
			break;
			case "close":
				_site.close_page();
			break;
		}
	}

	this.close_page = function(){
		_site.adjust_card_size('close', function(){
			$('#v-card').removeClass('active')
		});
	}

	this.display_page = function(page, with_logo_animation){
		var $card = $('#v-card');

		if(!$card.data('orig-width'))
		{
			$card.data('orig-height', $card.outerHeight())
				.data('orig-width', $card.outerWidth())
		}

		var $page = $('#page-'+page);

		$page.siblings().removeClass('active');
		$page.addClass('active');

		$card.addClass('active');
		_site.adjust_card_size('open', with_logo_animation);
	}

	this.adjust_card_size = function(type, animate_logo){
		var tl 	 = new TimelineLite(),
			$card = jQuery('#v-card'),
			animationtime = .5;

		tl.timeScale(1);
		tl.progress(0.5);

		$card.height($card.height());
		$card.width($card.width());

		switch(type)
		{
			case "open":
				var ease = Back.easeOut.config(1.5),
					$front = $("#v-card .front"),
					$close = $("#v-card .close-link"),
					$activeCard = $("#v-card .page.active"),
					pageHeight = $activeCard.data('height'),
					pageWidth = $activeCard.data('width'),
					logo_scale = .7,
					logo_left = -55,
					is_mobile = $(window).width()<650;

				if(is_mobile)
				{
					pageHeight = $(window).height()-60+'px';
					pageWidth = '100%';
					logo_scale = .5;
					logo_left = -60;
				}
				tl.to($card, 0, {overflow: 'hidden'});
				tl.to($front.find('.inner'), .3, {y: 200, opacity: 0, delay: 0, display: 'none', ease:Power4.easeIn});
				tl.to($front.find('#logo'), .3, {y: -20, x: logo_left, scale: logo_scale, delay:-.2, ease:Power4.easeIn});
				tl.to($close, 0, { display:'block', opacity: 0, x:-20});
				tl.to($close, .3, {x:0, opacity: 1, ease:ease});
				tl.to($card, .5, {width: pageWidth, delay:-.3, ease:ease});
				tl.to($card, .5, {height: pageHeight, delay:-.4, ease:ease});
				tl.to($activeCard, 0, {display:'block', delay:-.3, ease:Power4.easeIn});
				tl.to($activeCard.find('.content'), .3, {opacity:1, delay:-.2, ease:Power4.easeIn});
				tl.to($card, 0, {overflow: 'visible', delay:0});

				// logo animation
				if(animate_logo)
				{
					var $logo = $('#logo'),
						$jonas = $('#logo #Jonas'),
						$about = $('#logo #About'),
						$contact = $('#logo #Contact'),
						$slash = $('#logo #slash'),
						$close_tag = $('#logo #close_tag');
						$lt = $('#logo #lt');

					$logo.addClass('active')

					var rightTagLeft = 400;

					rightTagLeft += 300;

					if(!is_mobile)
					{
						tl.to($close_tag, .5, {x: 650, delay:0, opacity:1, display:'block', ease:ease});
						tl.to($slash, .7, {x: 405, delay:-.6, opacity:1, ease:ease});
						tl.to($lt, .5, {x: -42, delay:-.5, ease:Power4.easeOut});
					}

					if($activeCard.attr('id') == 'page-about'){
						tl.to($about, 0, {x: 320, opacity:0, display: 'block', delay:-.5});
						tl.to($about, .7, {x: 350, opacity:1, delay:-.4, ease:Power4.easeOut});
					}
					else if($activeCard.attr('id') == 'page-contact'){
						tl.to($contact, 0, {x: 305, opacity:0, display: 'block', delay:-.5});
						tl.to($contact, .7, {x: 325, opacity:1, delay:-.4, ease:ease});
					}
				}


			break;

			case "close":
				var $activeCard = $("#v-card .page.active"),
					$logo = $('#logo'),
					$jonas = $('#logo #Jonas'),
					$about = $('#logo #About'),
					$contact = $('#logo #Contact'),
					$slash = $('#logo #slash'),
					$close_tag = $('#logo #close_tag');
					$lt = $('#logo #lt'),
					$front = $("#v-card .front");

				$logo.removeClass('active')

				if($activeCard.attr('id') == 'page-about'){
					tl.to($about, .3, {x: 0, opacity:0, display: 'none', delay:0, ease:Power4.easeIn});
				}
				else if($activeCard.attr('id') == 'page-contact'){
					tl.to($contact, .3, {x: 0, opacity:0, display: 'none', delay:0, ease:Power4.easeIn});
				}

				tl.to($close_tag, .5, {x: 0, delay:0, opacity:0, display:'none', ease:Power1.easeIn});
				tl.to($slash, .7, {x: 0, delay:-.6, opacity:1, ease:Power4.easeOut});
				tl.to($lt, .5, {x: 0, delay:-.5, ease:Power4.easeOut});

				var $front = $("#v-card .front"),
					$close = $("#v-card .close-link"),
					ease = Back.easeOut.config(1.2);

				tl.to($card, 0, {overflow: 'hidden'});
				tl.to($activeCard.find('.content'), .2, {opacity:0, delay:-.5, ease:Power4.easeOut});
				tl.to($activeCard, 0, {display:'none', ease:Power4.easeIn});
				tl.to($card, .5, {height: $card.data('orig-height'), delay:0, ease:ease});
				tl.to($card, .5, {width: $card.data('orig-width'), delay:-.4, ease:ease});
				tl.to($close, .3, { display:'none', x:-20, opacity: 0, delay:-.4, ease:Power4.easeOut});
				tl.to($front.find('#logo'), .3, {y: 0, x: 0, scale: 1, delay:-.7, ease:Power4.easeInOut});
				tl.to($front.find('.inner'), .5, {y: 0, opacity: 1, delay: -.5, display: 'block', ease:Power4.easeOut});
				tl.to($card, 0, {overflow: 'visible'});
				//tl.to($front, 0, {overflow: 'visible', delay:0});
			break;
		}
	}

	this.initialize = function(){
		_site.start_animation();
		_site.set_event_listeners();

		jQuery('#contact-form').niceForm();

		if(document.location.hash == '#!/contact')
			_site.display_page('contact');
		//

		//_site.page_animation();
	};
};

var awesome = new site();

// wait for async tweenmax
var waiting = setInterval(function(){
	if(typeof TimelineLite == 'function'){
		window.yey = awesome.initialize();
		clearInterval(waiting);
	}
}, 100);
