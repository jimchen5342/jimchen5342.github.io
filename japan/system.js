var msg = new SpeechSynthesisUtterance();
msg.lang = "ja-JP";

msg.voice = speechSynthesis.getVoices().filter(function(voice) { 
	return voice.name == 'Google 日本語';  // Kyoko, Google 日本語
})[0];
// msg.voiceURI = 'native'; 
msg.rate = 0.9; // 0.1-10
// msg.pitch = 1.2; // 0-2
msg.onstart = function (e) {
}
msg.onend = function (e) {
	if(isPlaying == false) return;
	if(isSerial == true && startTime != null){
		let timer = document.getElementById("timer");
		let d = new Date(startTime);
		let max = 30;
		// timer.innerHTML = d.toString("hh:MM")

		let sec = ((new Date()).getTime() - startTime) / 1000
		if(sec >= (60 * max)) {
			reset();
			timer.innerHTML = "Time up!! " + d.toString("hh:MM");
			return;
		} else {
			let min = Math.floor(sec / 60);
			timer.innerHTML = (max - min) + "分 " + d.toString("hh:MM");
		}
	}
	let x = current, sec = 3;
	if(isSerial == true){
		// sec = 5;
		iTimes++;
		if(iTimes < 2){
			x = current;
			sec = 1;
		} else if(range.length == 0){
			iTimes = 0;
			x = (current >= words.length - 1) ? 1 : current + 1;
			if(x == 1) console.clear();
		} else {
			iTimes = 0;
			for(let i = 0; i < range.length; i++){
				if(range[i] == current){
					if(i == range.length - 1) {
						sec += 3;
						if(isRandom == true){
							buildRandom();
						}
						x = range[0];
					} else 
						x = range[i + 1];
					break;
				}
			}
		}
	} else {
		iTimes++;
		if(iTimes >= 5){
			reset();
			return;
		}
	}

	playID = setTimeout(function() {
		play(x);
	}, sec * 1000);
	isPlaying = false;
}

function reset(){
	isPlaying = false;
	speechSynthesis.pause();
	clearTimeout(playID);
	isSerial = false;
	iTimes = 0;
	range = []; 
	startTime = null;
	
	isRandom = false;
}

let words = null, isSerial = false, current = -1, playID;
let panel, btnStop, range = [], pathname, startTime = null, iTimes = 0, isRandom = false;
let isMobile = false;
document.body.onload = function(){
	isMobile = document.body.offsetWidth > 600 ? true : false;
	let arr = decodeURI(location.pathname).split("/");
	pathname = arr[arr.length - 1].replace(/ /g, "").replace(".html", "");
	
	let s = document.body.innerHTML;
	document.body.innerHTML = "<div id='toolbar'>" +
		"  <button id='play'>播放</button>" +
		"  <input id='range' size=8 style='margin: 0px 5px;' />" +
		"  <button id='random'>亂數</button>" +
		"  <button id='stop'>停止</button>" +
		"  <div id='panel' style='flex: 1; padding: 0px 0px; overflow: hidden;'></div>" + // 
		"  <div id='timer' style='padding: 2px 0px 2px 5px; color: red;'></div>" + 
		"</div>" +
		"<div id='seciton' style='flex: 1; '>" + s + "</div>"

	panel = document.getElementById("panel");
	btnStop = document.getElementById("stop");
	if(typeof localStorage[pathname] == "string")
		document.getElementById("range").value = localStorage[pathname];
	words = document.querySelectorAll("table tr td:nth-child(1)");
	if(words != null){
		words.forEach( (item, index) =>{
			if(index > 0) {
				reset();
				item.style.cursor = "pointer";
				item.setAttribute('data-text', index);
				item.addEventListener("click", function(event){
					if(isSerial == true) return;
					if(event.metaKey || isMobile == false){ // event.ctrlKey;
						clearTimeout(playID);
						// isSerial = false; 
						play(index)
						// current = -1;
					}
				});			
			}
		});		
	}

	document.getElementById("range").addEventListener("keydown", function(event){
		let code = event.keyCode;
		let val = document.getElementById("range").value;
		// console.log("code: " + code)

		if(code == 13 || (code == 38 || code == 40)){
			event.preventDefault();
			event.cancelBubble = false;
			clearTimeout(playID);
			speechSynthesis.cancel();
			if(code == 13){
				playClick();
			} else if((code == 38 || code == 40) ){
				let index = val.indexOf("-");
				if(index > 0 && index < val.length - 1) {
					let arr = val.split("-");
					if(arr.length > 1 && code == 40){
						let x = parseInt(arr[0], 10);
						let y = parseInt(arr[1], 10);
						let z = y - x + 1;
						x = y + 1;
						y += z;
						if(y >= words.length) y = words.length - 1;
						document.getElementById("range").value = x + "-" + y;
						playClick();
					}
				} else if(! isNaN(val)) {
					let x = (code == 38 ? -1 : 1) + parseInt(val, 10);
					if(x <= 0) 
						x = 1;
					else if(x >= words.length)
						x = words.length - 1;
					document.getElementById("range").value = x;
					playClick();
				}
			}
		}	
	});

	document.getElementById("play").addEventListener("click", function(){
		playClick();
	});
	document.getElementById("random").addEventListener("click", function(){
		playClick(true);
	});

	function playClick(random){
		speechSynthesis.cancel();
		clearTimeout(playID);
		let start = 1; reset();
		isRandom = random == true ? true : false;

		range = [];
		let x = document.getElementById("range").value.trim();
		if(x.indexOf("-") > -1){
			let arr = x.split("-");
			arr[0] = arr[0].trim() == "" ? 1 : parseInt(arr[0].trim(), 10);
			arr[1] = arr[1].trim() == "" ? words.length : parseInt(arr[1].trim(), 10);
			if(arr[0] == 0) arr[0] = 1;
			if(arr[1] > words.length) arr[1] = words.length - 1;

			for(let i = arr[0]; i <= arr[1]; i++){
				range.push(i);
			}
			start = arr[0];
		} else if(x.indexOf(",") > -1){
			let arr = x.split(",");
			arr.forEach(item=>{
				if(!isNaN(item)){
					let y = parseInt(item.trim(), 10);
					if(y > 0 && y < words.length){
						range.push(y);
					}
				}
			});
		} else if(x.length && ! isNaN(x)){
			x = parseInt(x, 10);
			start = x;
			range = [x];
		}
		// console.log("playClick: " + x + "/" + start)
		if(isRandom == true){
			buildRandom();
		}

		if(range.length > 0)
			localStorage[pathname] = x;
		else 
			delete localStorage[pathname]
		isSerial = true;
		play(start);
		if(isRandom == false){
			srcollTo(start)
		}
	}

	btnStop.addEventListener("click", function(){
		document.getElementById("timer").innerHTML = "";
		removeActive();
		panel.innerHTML =  "";
		speechSynthesis.cancel();
		current = -1;
		reset();
	});
	// console.log(arr)	
	window.addEventListener('keydown', function(event){
		let self = this, code = event.keyCode, pk = event.metaKey;
		let tag = document.activeElement.tagName;
		if(tag == "INPUT")
			return;
		else if(code == 40 || code == 38 || code == 32){
			reset();
			event.preventDefault();
			if(isSerial == true || current < 1) return;

			let x = (code == 40 ? 1 : (code == 38 ? -1 : 0)) + current;
			play(x);
		}
	}, false);
}
function buildRandom(){
	let arr = [];
	while(range.length > 0){
		let i = Math.floor(Math.random() * range.length);
		let items = range.splice(i, 1);
		arr.push(items[0]);
	}
	range = arr;
}
function srcollTo(start){
	let arr = document.querySelectorAll("table tr");
	let height = 0;
	arr.forEach((item, index)=>{
		if(index < start - 1){
			height += item.offsetHeight;
		}
	});
	// let h1 = document.getElementById("seciton").scrollTop;
	// let h2 = document.getElementById("seciton").offsetHeight;
	// console.log(h1 + ", " + h2)
	document.getElementById("seciton").scrollTop = height;
}
let isPlaying = false;
function play(index) {
	speechSynthesis.cancel();
	clearTimeout(playID);

	if(startTime == null && isSerial == true){
		startTime = (new Date()).getTime();
		let timer = document.getElementById("timer");
		let d = new Date(startTime);
		timer.innerHTML = d.toString("hh:MM")
	} 

	if(index < 1) 
		return;
	else if(isPlaying == true) {
		setTimeout(() => {
			play(index);
		}, 600);
		return;
	}
	isPlaying = true;

	if(current != index){
		removeActive();
		// if(current > -1){
		// 	let active = document.querySelector("table tr:nth-child(" + (current + 1) + ")");
		// 	active.className = "";
		// }
		let tr = document.querySelector("table tr:nth-child(" + (index + 1) + ")");
		tr.className = "active"
		let x = document.querySelectorAll("table tr:nth-child(" + (index + 1) + ") td");
		// panel.innerHTML = (index + ": " + x[0].innerText + "&nbsp;&nbsp;" + x[3].innerText);

		if(isRandom == true){
			srcollTo(index)
		}
	} else {	
	}

	if(isSerial == false){
		document.getElementById("timer").innerHTML = "" + (iTimes + 1);
	} 
	current = index;
	msg.text = words[index].innerText.replace("~", "");
	speechSynthesis.cancel();
	speechSynthesis.speak(msg);
}

function removeActive(){
	let actives = document.querySelectorAll("table tr.active");
	if(actives != null) {
		actives.forEach(item=>{
			item.className = "";
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