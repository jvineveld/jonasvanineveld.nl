/**
 * JavaScript quadcopter minigame
 * @author Jonas van Ineveld
 */

var minigame = function(){
	var $body = document.getElementsByTagName('body')[0];
	var $avatar = document.getElementById('avatar');
	var $quad = new Image();
	var quad_x, quad_y, quad_rotation = 'up', quad_angle = 1, quad_move_angle = 0, quad_width = 30, quad_height = 20;
	var doc_width, doc_height;
	var $canvas;
	var avatar_pos;
	var can_ctx;
	var rotate_angle = 0;
	var momentum_x = 1;
	var momentum_y = 1;
	var gravity = 2.7;
	var drag = .95;
	var playing = true;
	var going_down = false;
	var prev_pos_y = 0;
	var keys = {
		up: false,
		down: false,
		left: false,
		right: false
	}

	var collision_elements = [
		'h1', 
		'#tab-intro p', 
		'.social a',  
		'aside nav button'
	];

	var collision_boxes = []

	function set_size(){
		$canvas.width = doc_width= document.body.clientWidth;
		$canvas.height = doc_height = document.body.clientHeight;
		$canvas.style.left = "0px";
		$canvas.style.top = "0px";
		$canvas.style.zIndex = 80;
		$canvas.style.position = "absolute";

		avatar_pos = $avatar.getBoundingClientRect()

		set_collisions();
	}

	function set_canvas(){
		$canvas = document.createElement('canvas');
		document.body.appendChild($canvas);
		can_ctx = $canvas.getContext('2d');
	}

	function set_collisions(){
		collision_elements.forEach(function(element){
			let $elements = document.querySelectorAll(element);
			for(var i=0; i<$elements.length; i++){
				let $element = $elements[i];
				$element.setAttribute('collision-object', true)
				collision_boxes.push({
					$el: $element,
					bounds: $element.getBoundingClientRect()
				})
			}
		})

		console.log('collision boxes', collision_boxes)
	}

	function check_for_collision(){
		var has_collision = false;
		var margin = 20;
		collision_boxes.forEach(function(box, index){
			var bounds = box.bounds;
			var compare = {
				within_box_x_right: quad_x < bounds.x + bounds.width,
				within_box_x_left: quad_x + quad_width > bounds.x,
				within_box_y_bottom: (quad_y - margin) < bounds.y + bounds.height ,
				within_box_y_top: quad_height + quad_y - margin > bounds.y
			}
			if (compare.within_box_x_right && compare.within_box_x_left && compare.within_box_y_bottom && compare.within_box_y_top) {
					has_collision = true;

					if(!going_down){ // touching from bottom?
						box.$el.setAttribute('touched', true)
						var bottomTransform = doc_height - bounds.y - 100;
						box.$el.style.transform = 'translate(0, '+bottomTransform+'px)';
						delete collision_boxes[index];
					}
			 }
		});

		return has_collision;
	}

	function add_quad(){
		$quad.onload = function() {
			quad_x = avatar_pos.x + 69;
			quad_y = avatar_pos.y - 40;
			
			draw();
		}
		$quad.src = "/images/quadcopter.svg";
	}
	
	function checkInput(e){
		e = e || window.event;

		var active =  e.type === 'keydown';

		if (e.keyCode == '38') { keys.up = active; }
		else if (e.keyCode == '40') { keys.down = active; }
		else if (e.keyCode == '37') { keys.left = active; }
		else if (e.keyCode == '39') { keys.right = active; }

		if(active && !playing) play_pause()
	}

	function check_key_directions(){
		let active_keys = [];
		for(direction in keys){
			if(keys[direction]){
				switch(direction){
					case "left": momentum_x -= 1;  break;
					case "right": momentum_x += 1; break;
					case "up": momentum_y -= 1; break;
					case "down": momentum_y += 1; break;
				}

				active_keys.push(direction)
			}
		}

		return active_keys;
	}

	function check_rotation(active_keys){
		if(active_keys.includes('left')){
			rotate_angle -= 4
		}
		if(active_keys.includes('right')){
			rotate_angle += 4
		}
	}

	function check_for_bounds(){
		if(quad_x > doc_width)
			quad_x = 0;
		else if(quad_x < 0)
			quad_x = doc_width;

		if(quad_y > doc_height)
			quad_y = 0;
		else if(quad_y < 0)
			quad_y = doc_height;
	}

	function draw(){
		can_ctx.clearRect(0, 0, doc_width, doc_height);
		can_ctx.translate(Math.round(quad_x + $quad.width / 2), Math.round(quad_y + $quad.height / 2));
		rotate_angle = rotate_angle * drag;
		can_ctx.rotate(rotate_angle * Math.PI / 180);
		can_ctx.drawImage($quad, 0 - $quad.width / 2, 0 - $quad.height / 2);
		can_ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	function loop(){
		if(playing){
			var active_keys = check_key_directions();
			check_rotation(active_keys);
			var collision = check_for_collision()
			var down_force = gravity

			if(collision){
				momentum_x = momentum_x > 0 ? momentum_x : 0;
				momentum_y = momentum_y < 0 ? momentum_y : 0;
				down_force = 0;
			} 

			// can_ctx.clearRect(0, 0, doc_width, doc_height); // clear canvas
			momentum_x = momentum_x * drag;
			momentum_y = momentum_y * drag;
			quad_angle += quad_move_angle * Math.PI / 180;
			quad_x += momentum_x * Math.sin(quad_angle);
			quad_y += momentum_y * Math.cos(quad_angle) + down_force;

			going_down = momentum_y > prev_pos_y;
			prev_pos_y = momentum_y;

			console.log('going down', going_down)

			draw();
			// console.log(num)
			window.requestAnimationFrame(loop);
			check_for_bounds()
		}

	}

	function play_pause(){ 
		playing = !playing; 

		if(playing) window.requestAnimationFrame(loop);
	}

	function init(){
		$body.setAttribute('game-active', true);

		set_canvas();
		set_size();
		add_quad();

		document.addEventListener('keydown', checkInput);
		document.addEventListener('keyup', checkInput);
		document.addEventListener('click', play_pause);
	}

	init();
}

var mg = false;
function init_game(){ 
	if(!mg) mg = minigame.apply({}) 

	console.log('nu')
}


/**
 * Paul irish - Animation frame polyfill
 * https://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());