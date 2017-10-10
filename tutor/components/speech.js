(function(window, undefined) {
speech = {}, date = fireBase.serverTime();
let s = localStorage.getItem("speech");
if(typeof s == "string" && s.length > 0){
	speech.storage = JSON.parse(s);
} else {
	speech.storage = {
		msg: []
	}
}
speech.adjust = function(){
	$('#winSpeech').window({
		onOpen:function(){ 
			speechOpened = true;
			$("#taSpeech").focus();
		},
		onBeforeClose:function(){ 
			speechOpened = false;
		},
		onMove: function(left, top) {
			if(speechOpened){
				storage.Setting({
					winSpeech: {
						left, top
					}
				})
			}
		},
		onResize: function(width, height) {
			if(speechOpened){
			}
			//console.log("onResize")
		},
		onCollapse:function(){
			//console.log("onCollapse")
		},
		onExpand:function(){
			//console.log("onExpand")
		},
		onFocus: function(){
			console.log("onFocus")
		},
		onBlur: function(){
			console.log("onBlur")
		},
		onMaximize: function(){
			console.log("onMaximize")
		},
		onMinimize: function(){
			console.log("onMinimize");
		}
	});

	//delete setting.winSpeech;
	let left = 0, top = 0;
	if(typeof setting.winSpeech == "undefined"){
		top = document.body.clientHeight - 480; //$("#winSpeech").height;
		left = 5; //document.body.clientWidth - 320; //$("#winSpeech").width;
	} else {
		top = setting.winSpeech.top;
		left = setting.winSpeech.left;
	}

	$("#winSpeech").window('move', {left: left, top: top});
	if(system.isTeacher()){

	} else {
		/*
		//$('#layoutSpeech').layout('remove',  "north"); // 目前沒 show , 也沒寫多人版
		let p = $('#layoutSpeech').layout('panel', "south");
		$(p).panel("resize", {height: 320})
		$('#layoutSpeech').layout('resize');
		*/
	}

	$("#taSpeech").bind("keyup", function(e){
		//console.log(e)
		if(e.keyCode == 13){ // enter
			let s = $(this).val();
			if(s.length > 0 && s.substr(s.length -1) == "\n")
				s = s.substr(0, s.length - 1);
			if(s.length > 0){
				send(s);
			}
			$(this).val("");
		} else if(e.keyCode == 27){ // esc
			$(this).val("");
		} else {
		}
	});
	//$('#winSpeech').window('open'); // for test
}

function send(data){
	let div = $("<div class='flexH' style='padding-left: 10px;'>" +
		"<div style='flex: 1;'></div>" +
		"</div>").appendTo("#divSpeech");
	let bubble = $("<div class='speech-bubble right'>" + formatter(data) + "</div>").appendTo(div);
	//$("#divSpeech").scrollTop($("#divSpeech").height());

	let h = 0;
	let arr = $('#divSpeech').children();
	for(let i = 0; i < arr.length; i++){
		//console.log(i + ": " + $(arr[i]).outerHeight())
		h += $(arr[i]).outerHeight();
	}
	$("#divSpeech").animate({
		scrollTop: h
	}, 1000);
	let obj = {
		date: fireBase.serverTime(),
		uid: fireBase.uid,
		data: data,
		to: system.isTeacher() ? student : null
	}
	//console.log(obj)
	let key = storage.System().teacher.length > 0 ? storage.System().teacher : fireBase.uid;
	fireBase.database().ref("speech/" + key + "/" + fireBase.uid).set(obj)
	.then(()=>{
	}).catch(arg=>{
	});
}
function receive(data){
	data = formatter(data);
	let div = $("<div style='padding-right: 10px;'>" +
		"<div style='flex: 1;'></div>" +
		"</div>").appendTo("#divSpeech");
	let bubble = $("<div class='speech-bubble left'>" + data + "</div>").appendTo(div);
	window.showToast({
		msg: "你有新訊息!!", 
		icon: "info",
		allowToastClose: false
	});
	//$(bubble).html(data)
}
function formatter(data){
	data = data.replaceAll("<", "&lt;");
	data = data.replaceAll(">", "&gt;");
	data = data.replaceAll("\n", "<br/>");
	data = data.replaceAll("  ", "\t");
	data = data.replaceAll("\t", "&nbsp;&nbsp;");
	return data;
}
speech.listen = function(snap){
	if(snap.key != fireBase.uid){
		if(student.length == 0 && snap.val().to != fireBase.uid)
			return;
		if(snap.val().date > date){
			receive(snap.val().data);
			speech.storage.msg.push(snap.val());
			date = snap.val().date;
		}
	}
	localStorage.setItem("speech", JSON.stringify(speech.storage));
}
window.speech = speech
})(window);