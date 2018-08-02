var minigame = function(){
	var $body = document.getElementsByTagName('body')[0];
	var $avatar = document.getElementById('avatar');
	var $quad = new Image();
	var quad_x, quad_y, quad_rot;
	var doc_width, doc_height;
	var $canvas;
	var avatar_pos;
	var can_ctx;
	var momentum_x = 0;
	var momentum_y = 0;
	var drag = .5;
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

		if (e.keyCode == '38') { keys.up = true; }
		else if (e.keyCode == '40') { keys.down = true; }
		else if (e.keyCode == '37') { keys.left = true; }
		else if (e.keyCode == '39') { keys.right = true; }
	}

	function uncheckInput(e){
		e = e || window.event;

		if (e.keyCode == '38') { keys.up = false; }
		else if (e.keyCode == '40') { keys.down = false; }
		else if (e.keyCode == '37') { keys.left = false; }
		else if (e.keyCode == '39') { keys.right = false; }
	}

	function check_key_directions(){
		for(direction in keys){
			console.log(direction)
		}
	}

	function loop(num){
		if(playing){
			check_key_directions();
			can_ctx.clearRect(0, 0, doc_width, doc_height); // clear canvas
			quad_x = quad_x;
			can_ctx.drawImage($quad, quad_x, quad_y);
			console.log(num)
			window.requestAnimationFrame(loop);
		}

	}

	function init(){
		playing = true;

		$body.setAttribute('game-active', true);

		set_canvas();
		set_size();
		add_quad();

		window.requestAnimationFrame(loop);
		document.onkeydown = checkInput;
		document.onkeyUp = uncheckInput;
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