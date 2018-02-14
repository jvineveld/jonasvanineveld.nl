<?php require_once('init.php'); ?><!DOCTYPE html><!--
[jonasvanineveld.nl]
	Animations:
		Only css animations
	JS Libraries:
		None
	PHP Libraries / CMS / Frameworks:
		None
	CSS Libraries:
		None
	Stack:
		Ubuntu server:
			- NGINX
			- PHP 7.1
			- Varnish
			- HTTP2 brotli compression
			- HTTP2 push
			- SSL certificate

	Check the source code on my github!
	https://github.com/jvineveld/jonasvanineveld.nl
-->
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0" />
	<?php
	$site->print_header();
	$site->google_analytics();
	?>
	<link href="https://fonts.googleapis.com/css?family=Maven+Pro" rel="stylesheet">
</head>
<body>
<?php $site->print_page_contents(); ?>
<?php $site->print_footer(); ?>
<script type="text/javascript">
	var customPageTracking = function(){
		var page_triggers = document.querySelectorAll('[name="page-triggers"]');
			smart_triggers = document.querySelectorAll('[data-track][data-track-type]');

		function page_change(event){
			var target = event.target,
				name = target.id.replace(/trigger-page-/g, "");

			if(name=='home')
				return;

			gtag('event', 'actions', { 'page_view': name });
		}

		function track_click(event){
			var link = event.currentTarget,
				obj = {}

			obj[link.getAttribute("data-track-type")] = link.getAttribute("data-track");

			gtag('event', 'clicks', obj);
		}

		function set_listeners(){
			for(var i=0; i<page_triggers.length; i++)
				page_triggers[i].addEventListener('change', page_change);

			for(var i=0; i<smart_triggers.length; i++)
				smart_triggers[i].addEventListener('click', track_click);
		}

		set_listeners();
	}

	new customPageTracking();
</script>
</body>
</html>
