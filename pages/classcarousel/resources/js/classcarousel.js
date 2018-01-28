/**
 *  ClassCarousel v1.5 - 2017
 *  jQuery plugin by Jonas van Ineveld
 *
 *  Because CSS is awesome.
 *
 *  With this plugin you can create slide-shows, content tickers and any other kind of
 *  carousel for websites, based on css animations. The jQuery plugin will add classes
 *  to each of the selected items. Each of these classes has info about it's current
 *  position in the carousel. You can create positions for those locations, and next css
 *  transition will do the work for you. It's lightweight and simply written to be
 *  readable, tiny (4kb minified) and understandable. With the events and controls
 *  you should be able to extend it for your needs.
 *
 *  Enjoy and let me know if there are questions / suggestions.
 *
 *  Info and docs: http://jonasvanineveld.nl/ClassCarousel
 */
 /* ClassCarousel v1.5 by Jonas van Ineveld - @license: use it */
 (function ( $ ) {

	$.fn.classCarousel = function( options ) {
		var $carousel = this;

		this.items = [];					// will hold all the childs

		var settings = $.extend({
			visible: 4,						// number of 'visible' items in the carousel; eg. loc_1, loc_2,
			offset: 0,  					// provides a starting offset
			cycle_set_timout: 50,			// Timout between iterations when user cycles a set. creates a sluggish effect
			cycle: true,					// cycle carousel?
			child_selector: '.items > *'	// what childs should be selected?
		}, options );

		function circle(index) {
			var items = $carousel.items;

			// a simple positive modulo using items.length
			return (items.length + (index % items.length)) % items.length;
		}

		this.refresh_items = function(){

			$carousel.items = []; // clear current items array

			var index = 0;

			$(settings.child_selector, $carousel).each(function(){
				$el = this;
				$carousel.items.push({
					$item: $el,
					position: index + 1 // start at 1, not at 0, because we want 0 to be hidden left
				});

				index++;
			})
		}

		this.remove_classes = function($item){
			$item.removeClass (function (index, className) {
			    return (className.match (/\bloc_\S+/g) || []).join(' '); // remove all loc classes
			});
			$item.removeClass('hidden-left hidden-right')
	    	return $item;
		}

		this.set_no_slide_classes = function(){ // takes +1 / -1
			for(var i=0; i<$carousel.items.length; i++){
				var item = $carousel.items[i],
					$item = $(item.$item);

				$item.addClass('loc_'+(i+1))

			}
		}

		this.hide_item = function(side, $item, needs_repositioning)
		{
			var newClass = 'hidden-'+side;

			if(needs_repositioning)
				$item.addClass('no-transition');					// Disable transitions temporary best way

			$carousel.remove_classes($item);

			$item.addClass(newClass);

			if(needs_repositioning)
			{
				$item[0].offsetHeight;								// Trigger a reflow, flushing the CSS changes
				$item.removeClass('no-transition'); 				// Re-enable transitions
			}
		}

		this.change_classes = function(direction){ 					// takes +1 / -1
			var num_items = $carousel.items.length,
				items_visible = settings.visible;

			if(num_items < items_visible)
			{
				$carousel.set_no_slide_classes();
				console.info('Not enough items for carousel', $carousel)
				return;
			}

			for(var i=0; i<num_items; i++){
				var item = $carousel.items[i],
					$item = $(item.$item),
					hidden_left = $item.hasClass('hidden-left'),
					hidden_right = $item.hasClass('hidden-right'),
					position = item.position,
					new_position = circle(position + direction),
					new_pos_diff = position - new_position;
					changing_sides = Math.abs(new_pos_diff) > 2,
					extra_items_left = 3,
					last_first = num_items - extra_items_left;

				if( new_position == 0 )
				{
					$carousel.hide_item('left', $item, hidden_right);
				}
				else if( new_position <= items_visible )
				{
					$carousel.remove_classes($item);

					$item.addClass('loc_'+new_position);
				}
				else if( new_position > items_visible && new_position < last_first)
				{
					$carousel.hide_item('right', $item, hidden_left);
				}
				else
				{
					$carousel.hide_item('left', $item, hidden_right);
				}

				$carousel.items[i].position = new_position;
			}

		}

		this.add_event_listeners = function(){
			$('[cc-control]', $carousel).on('click', function(e){
				e.preventDefault();

				var action = $(this).attr('cc-control');

				switch(action){
					case 'next':
						$carousel.next_item();
					break;
					case 'prev':
						$carousel.prev_item();
					break;
					case 'next-set':
						$carousel.next_set();
					break;
					case 'prev-set':
						$carousel.prev_set();
					break;
				}
			});
		}

		this.cycle_set = function(direction){
			var iterations = 0;
			var cycle = setInterval(function(){

				if(iterations<settings.visible){
					if(direction=='next')
						$carousel.next_item();
					else
						$carousel.prev_item();
				}
				else
					clearInterval(cycle);

				iterations++;
			}, settings.cycle_set_timout);
		}

		this.next_item = function(){
			$carousel.change_classes(-1);
		}

		this.prev_item = function(){
			$carousel.change_classes(1);
		}

		this.next_set = function(){
			$carousel.cycle_set('next');
		}

		this.prev_set = function(){
			$carousel.cycle_set('prev');
		}

		this.initialize = function(){
			$carousel.refresh_items();
			$carousel.add_event_listeners();

			if($carousel.items.length < settings.visible)
			{
				$carousel.set_no_slide_classes();

				return;
			}

			$carousel.change_classes(settings.offset);
		}

		$carousel.initialize();

		return $carousel;
	};

}( jQuery ));
