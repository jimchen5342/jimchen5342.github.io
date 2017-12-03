chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
	//console.log(msg.data)
	let url = window.location.href;
	//console.log(msg)
	if (msg.ready === "download") {
		sendResponse({download : "download"});
	} else if (msg.ready === "ready") {
		if(url.indexOf("localhost:") > -1 || url.indexOf("http://jimchen5342.github.io/") > -1){
			window.postMessage({cmd: 'screen', base64: msg.data}, "*");
		} else if (confirm('確定擷取畫面?')) {
			sendResponse({download : "download"});
		}
	}
}); 

window.onmessage = function(e){
	if(e.data.cmd == "snapshot"){
		chrome.runtime.sendMessage(e.data, function(response) { // 送到 background.js
			//console.log(response);
		});
	}
}