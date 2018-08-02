/**
 * JavaScript quadcopter minigame
 * @author Jonas van Ineveld
 */

var minigame = function(){
	var $body = document.getElementsByTagName('body')[0];
	var $avatar = document.getElementById('avatar');
	var $quad = new Image();
	var quad_x, quad_y, quad_angle = 1, quad_move_angle = 0;
	var doc_width, doc_height;
	var $canvas;
	var avatar_pos;
	var can_ctx;
	var momentum_x = 1;
	var momentum_y = 1;
	var gravity = 2.7;
	var drag = .95;
	var playing = false;
	var keys = {
		up: false,
		down: false,
		left: false,
		right: false
	}

	function set_size(){
		$canvas.width = doc_width= document.body.clientWidth;
		$canvas.height = doc_height = document.body.clientHeight;
		$canvas.style.left = "0px";
		$canvas.style.top = "0px";
		$canvas.style.zIndex = 80;
		$canvas.style.position = "absolute";

		avatar_pos = $avatar.getBoundingClientRect()
	}

	function set_canvas(){
		$canvas = document.createElement('canvas');
		document.body.appendChild($canvas);
		can_ctx = $canvas.getContext('2d');
	}

	function add_quad(){
		$quad.onload = function() {
			quad_x = avatar_pos.x + 69;
			quad_y = avatar_pos.y - 40;
			can_ctx.drawImage($quad, quad_x, quad_y);
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
	}

	function check_key_directions(){
		for(direction in keys){
			if(keys[direction]){
				switch(direction){
					case "left": momentum_x -= 1;  break;
					case "right": momentum_x += 1; break;
					case "up": momentum_y -= 1; break;
					case "down": momentum_y += 1; break;
				}
			}
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

	function loop(num){
		if(playing){
			check_key_directions();
			can_ctx.clearRect(0, 0, doc_width, doc_height); // clear canvas
			momentum_x = momentum_x * drag;
			momentum_y = momentum_y * drag;
			quad_angle += quad_move_angle * Math.PI / 180;
			quad_x += momentum_x * Math.sin(quad_angle);
			quad_y += momentum_y * Math.cos(quad_angle) + gravity;
			can_ctx.drawImage($quad, quad_x, quad_y);
			// console.log(num)
			window.requestAnimationFrame(loop);
			check_for_bounds()
		}

	}

	function init(){
		playing = true;

		$body.setAttribute('game-active', true);

		set_canvas();
		set_size();
		add_quad();

		window.requestAnimationFrame(loop);
		document.addEventListener('keydown', checkInput);
		document.addEventListener('keyup', checkInput);
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