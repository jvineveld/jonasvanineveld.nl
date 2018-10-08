/**
   /~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\
   | Notices & Sounds for minigame					                            |
   |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
   | @author Jonas van Ineveld, Personal website - 2018                         |
   \~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/
 */
var notices = function(){
	var $body = document.getElementsByTagName('body')[0],
		$soundWrap = document.getElementById('mingame-sounds'),
		last_type = false,
		animation_duration = 1500,
		last_time = 0;

	let notices = {
		destroyer: [
			'Sloop het maar..',
			'Laat je nog iets over voor de rest?',
			'Alles moet kapot!',
			'Dat was m\'n favoriet!' 
		],
		final: [
			'Tja, en dat was het alweer..',
			'Heb nou ook weer niet',
			'zoveel vrije tijd.. Haha!'
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
		var $sound = sounds[type].cloneNode(true);
		var sound_id = guidGenerator();
		$sound.id = sound_id;
		$soundWrap.appendChild($sound);
		$sound.volume = 0.3;
		$sound.play();

		setTimeout(function(_sound_id){
			$soundWrap.removeChild(document.getElementById(_sound_id));
			console.log('sound removed')
		}.bind(null, sound_id), 500);
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

	this.play_final_notices = function(){
		var num = notices.final.length,
			cur = 0;

		var tmpIntval = setInterval(function(){
			if(cur < num){
				render_notice(notices.final[cur]);
				cur++;
			}

			if(cur===num){
				clearInterval(tmpIntval)
			}
		}, animation_duration);
	}
	
	this.show_notice = function(type){
		if(last_type!==type || Date.now() - last_time > animation_duration)
		{
			console.log('show msg', type)
			render_notice(pick_notice(type));
			last_type = type;
			last_time = Date.now();
		}
		play_sound(type)
	}
	
	// from https://stackoverflow.com/a/6860916
	function guidGenerator() {
		var S4 = function() {
		   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	}
}