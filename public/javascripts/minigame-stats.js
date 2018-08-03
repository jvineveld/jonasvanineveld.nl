/**
 * JavaScript quadcopter minigame 
 * 
 * Stats & score counter using FireBase
 * @author Jonas van Ineveld
 */

var statKeeper = function(){
	var currentScore = 0;
	var lives = 10;

	this.scored = function(){
		return currentScore++;
	}

	this.died = function(){
		return lives--;
	}
}