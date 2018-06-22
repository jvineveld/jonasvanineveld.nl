/**
 * Initialiser of the Demo more menu
 */

import moreMenu from "./es6-moremenu.js";
import scrollTo from "./scrollto.js"; /* used for page functionality, not for demo */

function mm_demo(){
	var $frame = document.getElementById('mm_demo'),
		$resize_el = document.getElementById('demo-sizing-bar'),
		is_resizing = false,
		mm_menu = new moreMenu('#mm_demo .menu');
		
	function resizing(e){
		if(is_resizing)
		{
			let {left: frame_pos_x} = $frame.getBoundingClientRect(),
				{outerWidth: frame_width} = $frame,
				mouse_pos_x = e.clientX - 40;

			$frame.style.width = mouse_pos_x-frame_pos_x + 'px';
			mm_menu.move_unfitting_items()
		}
	}

	function start_resizing(){
		is_resizing = true;
	}

	function stop_resizing(){
		is_resizing = false;
	}

	function init(){
		$resize_el.addEventListener('mousedown', start_resizing);
		document.getElementsByTagName('body')[0].addEventListener('mousemove', resizing);
		document.getElementsByTagName('body')[0].addEventListener('mouseup', stop_resizing);
	}

	init();
}
mm_demo();

// functioning of demo page
function table_of_contents(){
	let $toc_items = document.querySelectorAll('.toc a');

	function toc_item_click(e){
		let $toc_item = e.currentTarget;
		scrollTo($toc_item.getAttribute('href'), 500);
	}

	for(let $toc_item of $toc_items){
		$toc_item.addEventListener('click', toc_item_click);
	}
}


table_of_contents();
