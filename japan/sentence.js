var msg = new SpeechSynthesisUtterance();
msg.lang = "ja-JP";
msg.voice = speechSynthesis.getVoices().filter(function(voice) { 
	return voice.name == 'Google 日本語'; 
})[0];
msg.rate = 0.9;
msg.onstart = function (e) {
}
msg.onend = function (e) {
	isPlaying = false;
	// clearTimeout(playID);
	if(startTime != null){
		let timer = document.getElementById("timer");
		let d = new Date(startTime);
		let max = 30;
		// timer.innerHTML = d.toString("hh:MM")

		let sec = ((new Date()).getTime() - startTime) / 1000
		if(sec >= (60 * max)) {
			clearTimeout(playID);
			startTime = null;
			// timer.innerHTML = "Time up!! " + d.toString("hh:MM");
			return;
		} else {
			let min = Math.floor(sec / 60);
			// timer.innerHTML = (max - min) + "分 " + d.toString("hh:MM");
		}
	}

	playID = setTimeout(function() {
		play(current + (isSerial == true ? 1 : 0));
	}, 3000 );
}

let sentence = [], startTime = null, playID, current = -1, isSerial = true;
let isPlaying = false, isMobile = false;
document.body.onload = function(){
	isMobile = document.body.offsetWidth > 600 ? true : false;
	document.body.innerHTML = "<div id='toolbar'>" +
		"  <button id='play'>播放</button>" +
		"  <input id='range' size=8 style='margin: 0px 5px;' />" +
		"  <button id='stop'>停止</button>" +
		"  <div id='panel' style='flex: 1; padding: 0px 0px; overflow: hidden;'></div>" + 
		"  <div id='timer' style='padding: 2px 0px 2px 10px; color: red;'></div>" + 
		"</div>" +
		"<div id='seciton' style='flex: 1; '>" + execute() + "</div>"; //


	sentence = document.querySelectorAll("span.sentence");
	if(sentence != null){
		sentence.forEach( (item, index) =>{
				item.addEventListener("click", function(event){
					if(event.metaKey || isMobile == false){ // event.ctrlKey;
						speechSynthesis.cancel();
						clearTimeout(playID);
						isSerial = false; 
						play(index);
					}
				});			
		});
	}

	window.addEventListener('keydown', function(event){
		let tag = document.activeElement.tagName, code = event.keyCode;
		if(tag == "INPUT")
			return;
		else if(code == 40 || code == 38){
			event.preventDefault();
			speechSynthesis.cancel();
			clearTimeout(playID);
			let x = current + (code == 40 ? 1 : -1);
			if(x < 0){
				x = 0;
			} else if(x >= sentence.length)
				x = sentence.length - 1;
			play(x)
		}
	});
	let btnStop = document.getElementById("stop");
	btnStop.addEventListener("click", function(){
		startTime = null;
		document.getElementById("timer").innerHTML = "";
		removeActive();
		clearTimeout(playID);
		panel.innerHTML =  "";
		speechSynthesis.cancel();
		isSerial = false; 
		current = -1;
	});

	let body = "ID_NO=food&PW=12345&TOKEN=aaaa&DATA="
	let header = {
		method: 'post',
		'x-app-id': 'V1',
		headers: {
			"content-type": "application/x-www-form-urlencoded",
			"cache-control": "no-cache",
		},
		timeout: 5,
		body: body
	};

	fetch("http://192.168.0.116:1234", header)
	.then((response) => {
		return response.text();
	})
	.then((responseText) => {
		console.log(responseText)
	})
	.catch((err) => {
		console.log(err)
	});
			


}

function play(index) {
	clearTimeout(playID);
	if(index == -1 || index >= sentence.length) return;
	if(startTime == null){
		startTime = (new Date()).getTime();
		// let timer = document.getElementById("timer");
		// let d = new Date(startTime);
		// timer.innerHTML = d.toString("hh:MM")
	}
	if(isPlaying == true) {
		setTimeout(() => {
			play(index);
		}, 600);
		return;
	}
	isPlaying = true;
	
	if(current != index){
		removeActive();
		if(current > -1){
			let active = document.querySelector("#seciton > div:nth-child(" + (current + 1) + ")");
			active.className = "sentence";
		}
		// console.log("div.sentence:nth-child(" + (index + 1) + ")")
		let div = document.querySelector("#seciton > div:nth-child(" + (index + 1) + ")");
		div.className = "active sentence";
	} else {

	}
	// console.log(document.querySelector("#seciton > div:nth-child(1)"))

	current = index;
	msg.text = sentence[index].innerText.split(".")[1];
	speechSynthesis.cancel();
	speechSynthesis.speak(msg);
}

function removeActive(){
	let actives = document.querySelectorAll("#seciton > div");
	if(actives != null) {
		actives.forEach(item=>{
			item.className = "sentence";
		})		
	}
}

Date.prototype.toString = function (format = "yyyy/mm/dd hh:MM:ss.ms") {
	let y = this.getFullYear(), m = this.getMonth() + 1;
	let d = this.getDate(), h = this.getHours();
	let M = this.getMinutes(), s = this.getSeconds();
	let ms = this.getMilliseconds();
	let r = "";
	if (typeof (format) == "undefined") {
		format = "yyyy/mm/dd hh:MM:ss.ms";
	}
	r = format.replace("yyyy", y);
	r = r.replace("yy", ("" + y).substr(2, 2));
	if (m < 10)
		m = "0" + m;
	r = r.replace("mm", m);
	if (d < 10)
		d = "0" + d;
	r = r.replace("dd", d);
	if (h < 10)
		h = "0" + h;
	r = r.replace("hh", h);
	if (M < 10)
		M = "0" + M;
	r = r.replace("MM", M);
	if (s < 10)
		s = "0" + s;
	r = r.replace("ss", s);
	if (ms < 10)
		ms = "00" + ms;
	else if (ms < 100)
		ms = "0" + ms;
	r = r.replace("ms", ms);
	return r;
};