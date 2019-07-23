(function(root){
	var Synthesis = root.Synthesis = {};
	var _onstart, _onend;
	var msg = new SpeechSynthesisUtterance();
	msg.lang = "ja-JP";
	msg.voiceURI = 'native';
	msg.rate = 0.9; // 0.1-10
	function getVoice() {
		let arr = window.speechSynthesis.getVoices();
		if(arr.length == 0){
			setTimeout(getVoice, 600);
		} else {
			msg.voice = window.speechSynthesis.getVoices().filter(function(voice) { 
				return voice.name == 'Google 日本語';  // Kyoko, Google 日本語
			})[0];
			console.log(msg.voice)
		}
	}
	getVoice();
	
	msg.onstart = function (e) {
		if(typeof _onstart == "function") _onstart();
	}
	msg.onend = function (e) {
		if(typeof _onend == "function") _onend();
	}

	Synthesis.speak = function (text, onEnd, onStart) {
		_onstart = onStart;
		_onend = onEnd;
		// console.log("Synthesis.speak: " + text + " ........................")
		msg.text = text;
		window.speechSynthesis.cancel();
		window.speechSynthesis.speak(msg);

	}
window.Synthesis = Synthesis;
})(this);