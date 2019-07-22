(function(root){
	var Synthesis = root.Synthesis = {};
	var msg = new SpeechSynthesisUtterance();
	msg.lang = "ja-JP";
	var _onstart, _onend;

	msg.voice = window.speechSynthesis.getVoices().filter(function(voice) { 
		return voice.name == 'Google 日本語';  // Kyoko, Google 日本語
	})[0];
	
	msg.onstart = function (e) {
		if(typeof _onstart == "function") _onstart();
	}
	msg.onend = function (e) {
		if(typeof _onend == "function") _onend();
	}

	Synthesis.speak = function (text, onEnd, onStart) {
		_onstart = onStart;
		_onend = onEnd;
		console.log("Synthesis.speak: " + text + " ........................")
		msg.text = text;
		speechSynthesis.pause();
		speechSynthesis.speak(msg);
	}
window.Synthesis = Synthesis;
})(this);