/**
 * JavaScript quadcopter minigame 
 * 
 * Notice / Messages display
 * Sounds are also included in this class
 * @author Jonas van Ineveld
 */
var notices = function(){
	var $body = document.getElementsByTagName('body')[0],
		last_type = false,
		animation_duration = 1500,
		last_time = 0;

	let notices = {
		avatar: [
			'Noop',
			'Niet doen!!',
			'Pas nou op joh',
			'Dat gaat mis',
		],
		destroyer: [
			'Sloop het maar weer..',
			'Nouhouu, net datgeen wat ik leuk vond',
			'Laat je nog iets over voor de rest?',
			'Alles moet kapot!',
		],
		avatar_success: [
			'Ha! wacht maar!',
			'Komt ie dan hé!',
			'Ik had je gewaarschuwd..',
			'Dan niet joh!',
		],
		solid_astroid: [
			'BAMMM!',
			'LOZER',
			'Komop, dit kan iedereen',
			'tjongejongejonge..',
			'Ha ha ha ha',
			'Failure alert! TADUU TADUU',
			'Moehaha',
		],
		point: [
			'Gescoord!',
			'Lekker bezig!',
			'Zo gaat ie goed,...lalaalala',
			'En door!',
			'Vroemmm! als een raket!',
			'Jij kan vliegen als piraat!',
			'On-ge-lo-ve-lijk',
		]
	};
	
	var sounds = {
		avatar: document.getElementById('sound_error'),
		destroyer: document.getElementById('sound_avatar_destroy'),
		avatar_success: document.getElementById('sound_avatar_destroy'),
		solid_astroid: document.getElementById('sound_fail'),
		point: document.getElementById('sound_coin'),
	}

	function play_sound(type){
		$sound = sounds[type].cloneNode(true);
		$body.appendChild($sound);
		$sound.volume = 0.3;
		$sound.play();

		setTimeout(function(){
			$sound.parentNode.removeChild($sound);
			console.log('sound removed')
		}, 500);
	}

	function render_notice(msg){
		$exists = document.getElementById('notice');

		if($exists){
			$exists.setAttribute('getting-removed', true)
			$exists.parentNode.removeChild($exists);
		}

		$notice = document.createElement('div');
		$notice.id = 'notice';	
		$notice.innerHTML = msg;
		$body.appendChild($notice);
	}

	function pick_notice(type){
		return notices[type][Math.floor(Math.random() * notices[type].length)];
	}
	
	this.show_notice = function(type){
		console.log(Date.now() - last_time, Date.now() - last_time > animation_duration)
		if(last_type!==type || Date.now() - last_time > animation_duration)
		{
			console.log('show msg', type)
			render_notice(pick_notice(type));
			last_type = type;
			last_time = Date.now();
		}
		play_sound(type)
	}
}