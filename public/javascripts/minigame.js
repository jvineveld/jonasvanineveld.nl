/**
   /~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\
   | JavaScript quadcopter minigame                                             |
   |                                                                            |
   | In my spare time i fly with a 5" FPV quadcopter                            |
   | Created this just because drones are awesome.                              |
   |                                                                            |
   | Credits to:                                                                |
   | Paul irish for the Animation frame polyfill                                |
   |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
   | @author Jonas van Ineveld, Personal website - 2018                         |
   \~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/
 */

// because i don't want to have blocking images that are not displayed for a while, i lazyload the game assets
function lazyload_game_assats(){
	var $btn = document.getElementById('start-game');

	$btn.innerHTML = '<span class="start"><img width=60 height=60 src=/images/gamepad.svg alt="play?"></span><span class="intro"><img width=90 height=90 src=/images/keyboard.svg alt="Use WASD"></span>'

}

lazyload_game_assats()

var minigame = function(){
	var $body = document.getElementsByTagName('body')[0];
	var $avatar = document.getElementById('avatar');
	var $quad = new Image();
	var quad_x, quad_y, quad_angle = 1, quad_last_angle, quad_width = 200, quad_height = 40;
	var doc_width, doc_height;
	var canvases = [];
	var $canvas;
	var $astroid_canvas;
	var avatar_pos;
	var can_ctx;
	var rotate_angle = 90;
	var vector_angle = 90;
	var key_increase = .2;
	var rot_increase = 4;
	var gravity = 2;
	var winddrag = .97;
	var playing = true;
	var stage = 1;
	var speed = 0;
	var info_line = '[esc] om te stoppen | [spatie] voor pauze',
		$info_line
	var active_keys = {
		up: false,
		down: false,
		left: false,
		right: false
	}
	var notices = this.notices;

	var collision_elements = [
		'h1', 
		'#tab-intro p', 
		'.social a',  
		'aside nav button'
	];

	var collision_boxes = []

	function position_canvas($_canvas, z_index){
		$_canvas.width = doc_width= document.body.clientWidth;
		$_canvas.height = doc_height = document.body.clientHeight;
		$_canvas.style.left = "0px";
		$_canvas.style.top = "0px";
		$_canvas.style.zIndex = z_index;
		$_canvas.style.position = "absolute";
	}

	function set_size(){
		canvases.forEach(function(canvas){
			position_canvas(canvas.$el, canvas.zindex);
		})
		
		avatar_pos = $avatar.getBoundingClientRect()
	}

	function set_canvas(){
		$canvas = document.createElement('canvas');
		$body.appendChild($canvas);
		can_ctx = $canvas.getContext('2d');

		$astroid_canvas = document.createElement('canvas');
		$body.appendChild($astroid_canvas);
		astr_ctx = $astroid_canvas.getContext('2d');

		canvases.push({
			$el: $canvas,
			zindex: 60
		},{
			$el: $astroid_canvas,
			zindex: 62
		})
	}

	function check_stage(){
		
		if(collision_boxes.length === 1 && stage !== 2){
			stage = 2;
			notices.play_final_notices();
		}
	}

	function set_collisions(){
		collision_elements.forEach(function(element){
			var $elements = document.querySelectorAll(element);
			for(var i=0; i<$elements.length; i++){
				var $element = $elements[i];
				$element.setAttribute('collision-object', true)
				collision_boxes.push({
					$el: $element,
					bounds: $element.getBoundingClientRect(),
					type: 'rect'
				})
			}
		})

		// add avatar
		collision_boxes.push({
			$el: $avatar,
			bounds: $avatar.getBoundingClientRect(),
			type: 'avatar'
		})

		// console.log('collision boxes', collision_boxes)
	}

	function box_collision(obj_1, obj_2){
		var compare = {
			within_box_x_right: obj_1.x < obj_2.x + obj_2.width,
			within_box_x_left: obj_1.x + obj_1.width > obj_2.x,
			within_box_y_bottom: obj_1.y < obj_2.y + obj_2.height,
			within_box_y_top: obj_1.height + obj_1.y > obj_2.y
		}

		return (compare.within_box_x_right && compare.within_box_x_left && compare.within_box_y_bottom && compare.within_box_y_top);
	}

	function check_for_collision(){
		var collisions = [];
		
		collision_boxes.forEach(function(box, index){
			var bounds = box.bounds;
			if(box.type === 'rect'){
				if(box_collision({
					x: quad_x,
					y: quad_y,
					width: quad_width,
					height: quad_height
				}, bounds)){
					var bottomTransform = doc_height - bounds.y - 100;
					notices.show_notice('destroyer')
					has_collision = true;

					collisions.push({ type: box.type })
					
					box.$el.setAttribute('touched', true)
					box.$el.style.transform = 'translate(0, '+bottomTransform+'px)';
					collision_boxes.splice(index,1);
				}
			}else if(box.type === 'avatasdar'){
				var circle1 = {radius: box.bounds.width / 2, c_x: (box.bounds.width / 2) + box.bounds.x, c_y: (box.bounds.height / 2) + box.bounds.y};
				var circle2 = {radius: quad_width / 2, c_x: (quad_width / 2) + quad_x, c_y: (quad_height / 2) + quad_y};
				
				var dx = circle1.c_x - circle2.c_x;
				var dy = circle1.c_y - circle2.c_y;
				var distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < circle1.radius + circle2.radius) {
					collisions.push({ type: 'solid' })
				}
			}
		});

		return collisions;
	}

	function add_quad(){
		$quad.onload = function() {
			quad_x = avatar_pos.x - 10;
			quad_y = avatar_pos.y - 74;
			
			draw();
		}
		$quad.src = "/images/quadcopter.svg";
	}
	
	function checkInput(e){
		e = e || window.event;

		var active =  e.type === 'keydown';

		switch(e.keyCode){
			case 38: 
			case 87: active_keys.up = active; break;
			case 40: 
			case 83: active_keys.down = active; break;
			case 37: 
			case 65: active_keys.left = active; break;
			case 39: 
			case 68: active_keys.right = active; break;
			case 32: if(active) play_pause(); break;
			case 27: if(active) exit_game(); break;
		}

		if(active && !playing && [38,87].includes(e.keyCode)) play_pause()
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
		can_ctx.translate(Math.round(quad_x + quad_width/ 2), Math.round(quad_y + quad_height / 2));

		can_ctx.rotate((rotate_angle - 90) * Math.PI / 180);
		can_ctx.drawImage($quad, 0 - quad_width / 2, 0 - quad_height/ 2, quad_width, quad_height);
		can_ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	function loop(){
		if(playing){
			var collisions = check_for_collision()
			check_stage()

			quad_angle = quad_last_angle;

			speed = speed * winddrag;

				for(direction in active_keys){
					if(active_keys[direction]){
						switch(direction){
							case "left": 
								rotate_angle -= rot_increase;
							break;
							case "right": 
								rotate_angle += rot_increase;
							break;
							case "up": 
								var rot_dev = rotate_angle / (rotate_angle / 360),
									vec_deg = vector_angle / (vector_angle / 360);

								if(!collisions.length){
									speed -= key_increase; 
								} else {
									speed += key_increase; 

								}
	
								if(active_keys.left){
									vector_angle -= 3;
									speed += key_increase ;
								}
	
								if(active_keys.right){
									vector_angle += 3;
									speed += key_increase ;
								}
	
								quad_angle = (rotate_angle) * Math.PI / 180;

							break;
							case "down": 
							if(!collisions.length){
								speed += key_increase; 
							}
							else{
								speed -= key_increase; 
							}
	
							break;
						}
					}
				}

			quad_angle = (rotate_angle) * Math.PI / 180;
	
			quad_y += (speed * Math.sin(quad_angle)) + gravity;
			quad_x += speed * Math.cos(quad_angle);
			
			prev_pos_y = quad_y;

			quad_last_angle = quad_angle

			draw();
			window.requestAnimationFrame(loop);
			check_for_bounds()
		}
	}

	function add_controls(){
		$info_line = document.createElement('span');
		$info_line.id = 'info-line';
		$info_line.innerHTML = info_line;
		$body.appendChild($info_line)
	}

	function play_pause(){ 
		playing = !playing; 

		if(playing) window.requestAnimationFrame(loop);
	}

	function init(){
		$body.setAttribute('game-active', true);

		add_controls();

		start_time = Date.now();

		set_canvas();
		set_size();
		add_quad();
		set_collisions();

		document.activeElement.blur()

		document.addEventListener('keydown', checkInput);
		document.addEventListener('keyup', checkInput);
		document.addEventListener('click', play_pause);
	}

	function exit_game(){
		playing = false;

		canvases.forEach(function(canvas){
			canvas.$el.parentNode.removeChild(canvas.$el)
		});

		document.removeEventListener('keydown', checkInput);
		document.removeEventListener('keyup', checkInput);
		document.removeEventListener('click', play_pause);

		$body.removeAttribute('game-active');
		$body.removeAttribute('stage');
		$body.removeChild($info_line)

		var types = [
			'collision-object',
			'touched'
		]

		types.forEach(function(type){
			var $types = document.querySelectorAll('['+type+']');
			for(var i=0; i<$types.length; i++){
				$types[i].removeAttribute(type)
				$types[i].style.transform = null;
			}
		})

		// garbage collection
		$body = $quad = $avatar = $canvas = $astroid_canvas = null;
		delete window.mg.game
		
	}

	init();

	return this;
}



window.mg = {};
function ig(){ 
	if(!window.mg.game){
		window.mg.game = minigame.apply({
			notices: new notices()
		}) 
	}
}

var hc=0,ht=3; function eg(){ if(hc===ht){ ig(); hc = 0; } else { hc++ } document.getElementById('avatar').setAttribute('data-enabler', hc); }


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