/**
 * JavaScript quadcopter minigame
 * 
 * Created this just because drones are awesome.
 * It all began so small, then i wanted to make it bigger..
 * @author Jonas van Ineveld
 */

var minigame = function(){
	var $body = document.getElementsByTagName('body')[0];
	var $avatar = document.getElementById('avatar');
	var $quad = new Image();
	var quad_x, quad_y, quad_angle = 1, quad_move_angle = 0, quad_width = 30, quad_height = 20;
	var doc_width, doc_height;
	var canvases = [];
	var $canvas;
	var $astroid_canvas;
	var avatar_pos;
	var can_ctx;
	var astr_ctx;
	var rotate_angle = 0;
	var momentum_x = 1;
	var momentum_y = 1;
	var key_increase = 1;
	var gravity = 0;
	var drag = .95;
	var playing = true;
	var going_down = false;
	var prev_pos_y = 0;
	var stage = 1;
	var avatar_hitcount = 0;
	var avatar_hittarget = 4;
	var num_astroids = 4;
	var astroids = [];
	var astroid_speed = 8;
	var start_time = 0;
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
		document.body.appendChild($canvas);
		can_ctx = $canvas.getContext('2d');

		$astroid_canvas = document.createElement('canvas');
		document.body.appendChild($astroid_canvas);
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
		if(stage===4) {
			cur_time = Date.now();
			sec_in = (cur_time - start_time) / 1000;

			if(sec_in > 30 && num_astroids < 7){
				num_astroids = 7;
				astroid_speed = 12;
				key_increase = 2;
			} else if(sec_in > 60 && num_astroids < 12){
				num_astroids = 12;
				astroid_speed = 13;
				key_increase = 3;
			} else if(sec_in > 60 && num_astroids < 12 && astroid_speed !==14){
				num_astroids = 12;
				astroid_speed = 14;
				key_increase = 5;
			}
			console.log(sec_in)
			return;
		}

		if(avatar_hitcount === Math.round(avatar_hittarget / 2) && stage!==2){
			stage = 2;
			var $body = document.getElementsByTagName('body')[0];
			$body.setAttribute('stage', 'getting-hit')
		}
		if(avatar_hitcount === avatar_hittarget - 1 && stage!==3){
			stage = 3;
			var $body = document.getElementsByTagName('body')[0];
			$body.setAttribute('stage', 'target_broke')
		}
		if(avatar_hitcount === avatar_hittarget){
			enter_final_stage();
		}
	}

	function enter_final_stage(){
		stage = 4;
		gravity = 3;
		var $body = document.getElementsByTagName('body')[0];
		$body.setAttribute('stage', 'final')
	}

	function set_collisions(){
		collision_elements.forEach(function(element){
			let $elements = document.querySelectorAll(element);
			for(var i=0; i<$elements.length; i++){
				let $element = $elements[i];
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

		console.log('collision boxes', collision_boxes)
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
		var has_collision = false;
		var margin = 20;
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

					has_collision = true;

					box.$el.setAttribute('touched', true)
					box.$el.style.transform = 'translate(0, '+bottomTransform+'px)';
					collision_boxes.splice(index,1);
				}
			}else if(box.type === 'avatar'){
				var circle1 = {radius: box.bounds.width / 2, c_x: (box.bounds.width / 2) + box.bounds.x, c_y: (box.bounds.height / 2) + box.bounds.y};
				var circle2 = {radius: quad_width / 2, c_x: (quad_width / 2) + quad_x, c_y: (quad_height / 2) + quad_y};
				
				var dx = circle1.c_x - circle2.c_x;
				var dy = circle1.c_y - circle2.c_y;
				var distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < circle1.radius + circle2.radius) {
					momentum_y -= momentum_y * 2;
					momentum_x -= momentum_x * 2;

					avatar_hitcount += 1;

					if(avatar_hitcount === avatar_hittarget)
						collision_boxes.splice(index,1);
				}
			}
		});
		if(astroids.length){

			astroids.forEach(function(box, index){
				if(box_collision({
					x: quad_x,
					y: quad_y,
					width: quad_width,
					height: quad_height
				}, box)){
	
					has_collision = 'astroid'
					if(!box.solid){
						// delete collision_boxes[index];
						collision_boxes.splice(index,1);
					}else{
						momentum_x -= astroid_speed + 10;
					}	
				}
			})
		}
		

		return has_collision;
	}

	function render_astroids(){
		astr_ctx.clearRect(0, 0, doc_width, doc_height);
		for(var i=0; i<num_astroids; i++){
			if(astroids.length - 1 < i){
				astroids.push({
					width: Math.round(Math.random() * 300)+100,
					height: Math.round(Math.random() * 100)+30,
					x: Math.round(doc_width + (i * doc_width / 2)),
					y: Math.round(Math.random() * doc_height),
					solid: (i%2===0 && i!==0)
				})
			}
			
			var astroid = astroids[i],
				cur_astroid_speed = astroid_speed + (astroid_speed / 20 * i);
			
			if(astroid.x + astroid.width < 0)
			{
				astroids[i].x = doc_width;
				astroids[i].y = Math.round(Math.random() * doc_height)
			}
			else
			{
				astroids[i].x -= cur_astroid_speed;
			}

			astr_ctx.restore();
			astr_ctx.fillStyle = astroid.solid ? 'red' : 'white';
			astr_ctx.fillRect(astroid.x,astroid.y,astroid.width,astroid.height);
			astr_ctx.setTransform(1, 0, 0, 1, 0, 0);
			astr_ctx.save();

		}
		
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
		
		switch(e.keyCode){
			case 38: 
			case 87: keys.up = active; break;
			case 40: 
			case 83: keys.down = active; break;
			case 37: 
			case 65: keys.left = active; break;
			case 39: 
			case 68: keys.right = active; break;
		}

		if(active && !playing) play_pause()
	}

	function check_key_directions(){
		let active_keys = [];
		for(direction in keys){
			if(keys[direction]){
				switch(direction){
					case "left": momentum_x -= key_increase;  break;
					case "right": momentum_x += key_increase; break;
					case "up": momentum_y -= key_increase; break;
					case "down": momentum_y += key_increase; break;
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
			var down_force = gravity;
			var active_keys = check_key_directions();
			var collision = check_for_collision()
			
			check_rotation(active_keys);

			if(stage===4){
				render_astroids();
			}

			check_stage()

			if(collision && collision!=='astroid'){
				momentum_x = momentum_x > 0 ? momentum_x : 0;
				momentum_y = momentum_y < 0 ? momentum_y : 0;
				down_force = 0;
			} 

			if(collision==='astroid'){
				console.log('bam!')
			}

			// can_ctx.clearRect(0, 0, doc_width, doc_height); // clear canvas
			momentum_x = momentum_x * drag;
			momentum_y = momentum_y * drag;
			quad_angle += quad_move_angle * Math.PI / 180;
			quad_x += momentum_x * Math.sin(quad_angle);
			quad_y += momentum_y * Math.cos(quad_angle) + down_force;

			going_down = momentum_y > prev_pos_y;
			prev_pos_y = momentum_y;

			draw();
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

		start_time = Date.now();

		set_canvas();
		set_size();
		add_quad();
		set_collisions();
		// enter_final_stage();

		document.activeElement.blur()

		document.addEventListener('keydown', checkInput);
		document.addEventListener('keyup', checkInput);
		document.addEventListener('click', play_pause);
	}

	init();

	return this;
}

var mg = false;
function init_game(){ 
	if(!mg) mg = minigame.apply({}) 
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