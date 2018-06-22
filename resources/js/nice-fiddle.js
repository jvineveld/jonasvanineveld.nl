/**
 * A async loader for jsFiddle demo's
 * @author Jonas van Ineveld
 */
(function($){
	function init_fiddle(fiddle){
		var $fiddle = $(fiddle),
			$frame = $('<iframe />');

		var fiddle_id = $fiddle.data('id'),
			fiddle_height = $fiddle.data('height');

		var frame_url = 'https://jsfiddle.net/krinkled/'+fiddle_id+'/embedded/result,html,js,css/dark/';

		$frame.attr('src', frame_url)
			  .attr('width', '100%')
			  .attr('height', fiddle_height);

		$frame.appendTo($fiddle.find('.frame-wrapper'));

		$frame.on('load', function() {
		    $fiddle.removeClass('loading')
		});
	}

	$('.demo-fiddle').each(function(){
		init_fiddle(this)
	})
})(jQuery)
