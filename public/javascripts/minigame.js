var minigame = function(){
	var $body = document.getElementsByTagName('body')[0];
	var $quad = new Image();
	var $canvas;
	var can_ctx;
	var playing = false;

	function set_size(){
		$canvas.width = document.body.clientWidth;
		$canvas.height = document.body.clientHeight;
		$canvas.style.left = "0px";
		$canvas.style.top = "0px";
		$canvas.style.zIndex = 80;
		$canvas.style.position = "absolute";
	}

	function set_canvas(){
		$canvas = document.createElement('canvas');
		document.body.appendChild($canvas);
		can_ctx = $canvas.getContext('2d');
	}

	function add_quad(){
		$quad.onload = function() {
			can_ctx.drawImage($quad, 0, 0);
		}
		$quad.src = "/images/quadcopter.svg";
	}


	function loop(){

	}

	function init(){
		playing = true;

		$body.setAttribute('game-active', true);

		set_canvas();
		set_size();
		add_quad();
	}

	init();
}

var mg = false;
function init_game(){ 
	if(!mg) mg = minigame.apply({}) 

	console.log('nu')
}