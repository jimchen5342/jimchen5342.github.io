
(function(window, undefined) {
	// aes 雷達
	let isConnected = false, offset = 0;
	var fireBase = {
		loaded: false, user: undefined, uid: "", email: null,
		connected: false, loginTime: null
	};

	fireBase.load = function(callback){
		let _callback = function(arg){
			//console.log(arg)
			if(callback){
				callback(arg);
			}
			if(arg == true){
				var offsetRef = firebase.database().ref(".info/serverTimeOffset");
				offsetRef.on("value", function(snap) {
					offset = snap.val();
				});

				var connectedRef = fireBase.database().ref(".info/connected"); // 連線狀況
				connectedRef.on("value", function(snap) {
					if(isConnected == false){
						if(snap.val() === true){
							isConnected = true;
							fireBase.loginTime = fireBase.serverTime();
						}
					} else {
						fireBase.connected = snap.val();
						//showOnlineToast();
					} 
				});
			} else {
				//showOnlineToast();
			}
		}
		system.loadScript("https://www.gstatic.com/firebasejs/4.1.3/firebase.js", loaded);
		function loaded(result){
			if(result.code == "ok"){
				let s1 = "U2FsdGVkX1/GpsAcWPNdhaqOjxIXDapwwWCki2RQeMjn3N39cj7DBT6R6tAlLrzyUcjCRxT/WTv2WfZ/b2uwFQ=="
				let config = {
					apiKey: crypt.decrypt(s1),
					authDomain: "toutor-c913d.firebaseapp.com",
					databaseURL: "https://toutor-c913d.firebaseio.com",
					projectId: "toutor-c913d",
					storageBucket: "toutor-c913d.appspot.com"
				};
				firebase.initializeApp(config);
				fireBase.database = firebase.database;
				fireBase.storage = firebase.storage();
				fireBase.loaded = true;
				_callback(fireBase.loaded);
			} else {
				fireBase.loaded = undefined;
				_callback(fireBase.loaded)
			}
		}
	}
	fireBase.serverTime = function(){
		return new Date().getTime() + offset;
	}
	function openWindow(arg){
		console.log(storage.System());
		if($("#win").get().length > 0) $("#win").remove();
		if($(".panel.window").get().length > 0) $(".panel.window").remove();
		if($(".window-mask").get().length > 0) $(".window-mask").remove();
	
		let div = $("<div id='win' class='flexV' style='overflow: hidden; padding: 3px;' />").appendTo("body");
		$(div).window({
			title: arg.title ? arg.title : "undefined",
			minimizable: arg.minimizable ? arg.minimizable : false,
			maximizable: arg.maximizable ? arg.maximizable : false,
			collapsible: arg.collapsible ? arg.collapsible : false,
			draggable: arg.draggable ? arg.draggable : true,
			resizable: arg.resizable ? arg.resizable : true,
			inline: arg.inline ? arg.inline : false,
			width: arg.width ? arg.width : $("body").width() - 50,
			height: arg.height ? arg.height : $("body").height() - 100,
			modal: arg.modal ? arg.modal : true,
			shadow: false,
			onOpen: function(){
				let w1 = $(".panel.window").width();
				let h1 = $(".panel.window").height();
				let w2 = $("body").width();
				let h2 = $("body").height();
				let left = Math.floor((w2 - w1) / 2);
				let top = Math.floor((h2 - h1) / 2);
				$(".panel.window, .window-shadow").css("left", left); //Math.floor((w2 - w1) / 2));
				$(".panel.window, .window-shadow").css("top", top * 0.8);
				if(arg.onOpen) arg.onOpen(div);
			},
			onClose: function(){
				if(arg.onClose) arg.onClose(div)
				$(div).remove();
				$(".panel.window").remove();
				$(".window-mask").remove();
			}
		});
	}
	fireBase.login = function(callback){
		openWindow({
			title: "登入",
			width: 420,
			height: 230,
			onOpen: function(){
				createLogin();
			},
			onClose: function(){
				$(".btn").unbind("click", click);
			}
		});

		function createLogin(){
			let tbl = "<table id='tblLogin' style='width: 100%;  min-height: 25px; line-height: 25px;' border=0>" +
				"<tr><td><label>電子信箱：</label></td>" +
				"  <td><input id='email' /></td></tr>" +
				"<tr><td><label>密碼：</label></td>" +
				"  <td><input id='password' type='password' /></td></tr>" +
				"<tr><td><label>金鑰：</label></td>" +
				"  <td><input id='aes' /></td></tr>" +
				"</table>" +
				"<div class='footer' style='flex: 1;'>" +
				"  <button id='btnOk' class='btn'>確定</button>" +
				"  <button id='btnCancel' class='btn'>取消</button>" +
				"</div>";
			$(tbl).appendTo("#win");
			$("#tblLogin tr > td").css({
				"padding": "5px"
			});
		
			$("#email, #password, #aes").css({
				"width": "100%"					
			});
			$("#tblLogin tr > td:nth-child(1)").css({
				"text-align": "right",
				"padding-right": "0px",
				//"color": "blue"
			});
			$(".btn").bind("click", click);
			$("#email").focus();

			// $("#email").val("jimc@bethel.com.tw");
			// $("#password").val("firebase5342");
			// $("#aes").val("AN/SPS-60");
		}
		function click(){
			if(this.id == "btnCancel"){
				$("#win").window("close");
			} else {
				let email = $("#email").val().trim();
				let password = $("#password").val().trim();
				let aes = $("#aes").val().trim();
				if(email.length == 0 || email.indexOf("@") == -1){
					alert("請輸入正確的電子信箱");
				} else if(password.length < 6){
					alert("請輸入 6 位數的密碼");
				} else {
					loading(true);
					storage.System({aes: aes});
	
					fireBase.signIn(email, password, function(arg){
						if(arg == "ok"){
							storage.System({user: email, pwd: password});
						
							alert("登入成功, 系統更新...");
							location.reload();
						} else {
							loading(false);
						}
					});						
				}
			}
		}
		function loading(b){
			if(b == true){
				$(".btn").unbind("click", click);
				$(".footer").css({
					"background-image": 'url("./images/loader.gif")',
					"background-position": "20px center",
					"background-size": "35px 35px",
					"background-repeat": "no-repeat"
				});
				$("#email, #password, #aes").prop("disabled", true);		
			} else {
				$(".btn").bind("click", click);
				$(".footer").css({"background-image": 'none'});
				$("#email, #password, #aes").prop("disabled", false);
			}
		}	
	}

	fireBase.signIn = function(email, password, callback){
		if(typeof fireBase.user == "string" && fireBase.user.length > 0)
			callback("ok");
		else
			fireBase.load(login)

		function login(){
			firebase.auth().signInWithEmailAndPassword(email, password)
			.then(()=>{
				fireBase.email = email;
				
				var user = firebase.auth().currentUser;
				if (user != null) {
					user.providerData.forEach(function (profile) {
						fireBase.user = profile.email;
					});
					fireBase.uid = user.uid;
					if(callback) callback("ok");
				}
				console.log("uid: " + fireBase.uid)
			})
			.catch(function(error) {
				var errorCode = error.code;
				var errorMessage = error.message;
				alert(errorMessage)
				if(callback) callback(errorMessage);
			});						
		}
	}

	fireBase.signOut = function(){ // ok
		firebase.auth().signOut().then(function() {
			// Sign-out successful.
		}, function(error) {
			// An error happened.
		});		
	};

	fireBase.resetPassword = function(email, callback){
		firebase.auth().sendPasswordResetEmail(email)
		.then(()=>{
			if(callback) callback("ok");
		})
		.catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log(errorMessage);
			if(callback) callback(errorMessage);
		});
	}

	fireBase.userData = function(folder, callback){
		fireBase.database().ref(folder).once("value", function(snap) {
			let json = snap.val();
			console.log(json)
		}, function(err) {
			alert("無法下載'" + title + "'資料.....");
		});
	}
	window.fireBase = fireBase;
})(window);
/*
-------------------------------------
			let updates = {};
			for(let i = 0; i < ds.length; i++){
				let num = (i + 1) * 10;
				if(ds[i].sort != num && ds[i].sort < 9999999999) {
					updates[ "projects/" + projectName + "/_pages/" + ds[i].id + '/sort'] = num;
				}
			}
			firebase.database().ref().update(updates)
			.then((snap)=>{
				system.loading(false);
				$("#editWin").window("close");
				getProjectData(projectName);
			}).catch(arg=>{
				console.log(arg);
				bHandle = false;
			});
-----------------------------
for(let i = 0; i < ds.length; i++){
				let row2 = ds[i];
				let obj2 = {};
				for(let key in row2){
					if(key == "code")
						continue;
					else {
						obj2[key] = row2[key];
					}
				}
				json[row2.code] = obj2;
			}
			fireBase.database().ref("projects/" + projectName + "/" + row.id).set(json)
			.then(()=>{
				parseDatas(index + 1);
				//$("#modifyDate").remove();
				//updateProject();
			}).catch(arg=>{
				console.log(arg)
			});
--------------------
	let ref = fireBase.database().ref("projects/" + projectName + "/_pages");
	ref.on("value", readValue);
	ref.on("child_added", readAdd);
	ref.on("child_changed", readChange);
	ref.on("child_removed", readRemove);

		let ref = fireBase.database().ref("projects/" + projectName + "/_pages");
		ref.off("value", readValue);
		ref.off("child_added", readAdd);
		ref.off("child_changed", readChange);
		ref.off("child_removed", readRemove);
-----

function readValue(){
	newItems = true;
}
function readAdd(snap){ // 不用寫
	if(newItems == false) return;
}
function readChange(snap){
	if(newItems == false) return;
	let json = $.extend({id: snap.getKey()}, snap.val());
	if(typeof json.user == "undefined") return;
	//console.log("user: " + json.user + "==" + fireBase.user + "->" + (json.user != fireBase.user))
	if(json.user != fireBase.user && !isKeyMan){
		let b = false;
		for(let i = 0; i < ds.length; i++){
			if(ds[i].id == json.id){
				let node = $('#tree').tree('find', json.id);
				$('#tree').tree('update', {
					target: node.target,
					text: json.page
				});
				b = true;
				system.information("更新原功能 '" + ds[i].page + "' 為 '" + json.page + "'!!<br /><br/>操作者：" + json.user);
				break;
			}
		}
		if(b== false){
			addPage(json);
			system.information("新增功能 '" + json.page + "'!!<br /><br/>操作者：" + json.user);
		}
	}
}
function readRemove(snap){
	if(newItems == false) return;
	let json = $.extend({id: snap.getKey()}, snap.val());
	if(typeof json.user == "undefined") return;
	if(json.user != fireBase.user && !isKeyMan){
		let b = false;
		for(let i = 0; i < ds.length; i++){
			if(ds[i].id == json.id){
				let node = $("#tree").tree('find', ds[i].id);
				$("#tree").tree('remove', node.target);
				system.information("功能 '" + json.page + "' 已刪除!!<br /><br/>操作者：" + json.user);
				break;
			}
		}
	}
}
*/