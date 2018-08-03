/**
 * JavaScript quadcopter minigame
 * 
 * In my spare time i fly with a 5" FPV quadcopter
 * 
 * Created this just because drones are awesome.
 * It all began so small and simple, then i wanted to make it more fun..
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
	var start_time = 0;
	var active_keys = {
		up: false,
		down: false,
		left: false,
		right: false
	}
	var notices = this.notices;
	var stats = this.stats;

	var astroids = {
		objects: {
			solid: [],
			cloud: [],
			point: []
		},
		speed: 8,
		count: {
			solid: 0,
			cloud: 4,
			point: 0,
		},
		types: {
			point: [{
				img: "/images/targets/star-134-120.png",
				width: 134,
				height: 120,
			}],
			solid: [
				{
					img: "/images/targets/aircraft-280-122.png",
					width: 280,
					height: 122,
				},
				{
					img: "/images/targets/shark-500-159.png",
					width: 500,
					height: 159,
				},
				{
					img: "/images/targets/chair-200-285.png",
					width: 200,
					height: 285,
				},
			],
			cloud: [
				{
					img: "/images/clouds/cloud-300-146.png",
					width: 300,
					height: 146,
				},
				{
					img: "/images/clouds/cloud-300-176.png",
					width: 300,
					height: 176,
				},
				{
					img: "/images/clouds/cloud-300-182.png",
					width: 300,
					height: 182,
				},
				{
					img: "/images/clouds/cloud-300-184.png",
					width: 300,
					height: 184,
				},
				{
					img: "/images/clouds/cloud-300-189.png",
					width: 300,
					height: 189,
				},
				{
					img: "/images/clouds/cloud-300-240.png",
					width: 300,
					height: 240,
				}
			]	
		}
	}

	var sec_stages = {
		10: {
			count: {
				solid: 1,
				cloud: 4,
				point: 2
			}
		},
		20: {
			speed: 9,
			count: {
				solid: 2,
				cloud: 6,
				point: 2
			}
		}
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
		if(stage===4) {
			cur_time = Date.now();
			sec_in = Math.floor((cur_time - start_time) / 1000);

			console.log('sec in', sec_in, sec_stages[sec_in])
			if(sec_stages[sec_in] && !sec_stages[sec_in].activated){
				sec_stages[sec_in].activated = true;
				astroids = Object.assign(astroids, sec_stages[sec_in]);
				console.log('new astroids object', astroids);
			}
			return;
		}

		if(avatar_hitcount === 1 && stage!==1.5){
			stage = 1.5;
			$body.setAttribute('stage', 'hit')
			notices.show_notice('avatar')
		}
		if(avatar_hitcount === Math.round(avatar_hittarget / 2) && stage!==2){
			stage = 2;
			$body.setAttribute('stage', 'getting-hit')
			notices.show_notice('avatar')
		}
		if(avatar_hitcount === avatar_hittarget - 1 && stage!==3){
			stage = 3;
			$body.setAttribute('stage', 'target_broke')
			notices.show_notice('avatar')
		}
		if(avatar_hitcount === avatar_hittarget){
			enter_final_stage();
			notices.show_notice('avatar_success')
		}
	}

	function enter_final_stage(){
		stage = 4;
		gravity = 3;
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
					notices.show_notice('destroyer')
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

		var types = Object.keys(astroids.objects);

		for(var i=0; i<types.length; i++){
			var type = types[i];
			var astrds = astroids.objects[type]

			astrds.forEach(function(astr, index){
				if(box_collision({
					x: quad_x,
					y: quad_y,
					width: quad_width,
					height: quad_height
				}, astr)){
	
					has_collision = 'astroid'

					switch(type){
						case 'solid':
							momentum_x -= astroids.speed + 10;
							notices.show_notice('solid_astroid')
						break;
						case 'point':
							astroids.objects[type].splice(index,1);
							notices.show_notice('point')
						break;
						case 'cloud':
						break;
					}
				}
			})
		}		

		return has_collision;
	}

	function render_astroids(){
		astr_ctx.clearRect(0, 0, doc_width, doc_height);

		var types = Object.keys(astroids.count);

		astr_ctx.restore();

		for(var i=0; i<types.length; i++){
			var type = types[i];
			var num = astroids.count[type]

			for(var x=0; x<num; x++){
				add_astroid(type, x)
				update_astroid(type, x)
			}
		}

		astr_ctx.setTransform(1, 0, 0, 1, 0, 0);
		astr_ctx.save();		
	}

	function update_astroid(type, index){
		var astroid = astroids.objects[type][index],
			cur_astroid_speed = astroids.speed + (astroids.speed / 20 * index);

		if(astroid.x + astroid.width < 0)
		{
			astroids.objects[type][index].x = doc_width;
			astroids.objects[type][index].y = Math.round(Math.random() * doc_height)
		}
		else
		{
			astroids.objects[type][index].x -= cur_astroid_speed;
		}

		astr_ctx.drawImage(astroid.$img,astroid.x,astroid.y,astroid.width,astroid.height);
	}

	function add_astroid(type, index){ // solid || point || cloud
		if(astroids.objects[type].length > index) // already exists?
			return;

		var $img = new Image(),
			astr = pick_astroid(type);

		$img.onload = function() {
			draw();
		}

		$img.src = astr.img;

		astroids.objects[type].push({
			width: astr.width,
			height: astr.height,
			x: Math.round(doc_width + (index * doc_width / 2)),
			y: Math.round(Math.random() * doc_height),
			type: type,
			$img: $img
		})
	}

	function pick_astroid(type){
		console.log(type, astroids.types)
		let types = astroids.types[type]

		return types[Math.floor(Math.random() * types.length)];
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
			case 87: active_keys.up = active; break;
			case 40: 
			case 83: active_keys.down = active; break;
			case 37: 
			case 65: active_keys.left = active; break;
			case 39: 
			case 68: active_keys.right = active; break;
		}

		if(active && !playing) play_pause()
	}

	function check_key_directions(){
		let keys = [];
		for(direction in active_keys){
			if(active_keys[direction]){
				switch(direction){
					case "left": momentum_x -= key_increase;  break;
					case "right": momentum_x += key_increase; break;
					case "up": momentum_y -= key_increase; break;
					case "down": momentum_y += key_increase; break;
				}

				keys.push(direction)
			}
		}

		return keys;
	}

	function check_rotation(keys){
		if(keys.includes('left')){
			rotate_angle -= 4
		}
		if(keys.includes('right')){
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

			var keys = check_key_directions();
			check_for_collision()
			check_rotation(keys);

			if(stage===4){
				render_astroids();
			}

			check_stage()

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
	if(!mg) mg = minigame.apply({
		stats: new statKeeper(),
		notices: new notices()
	}) 
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