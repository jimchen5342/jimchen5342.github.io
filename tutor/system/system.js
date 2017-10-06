window.system = {};
//console.log(storage)
system.urlElement = function(key, defaultKey){
	let value = null;
	let i = window.location.href.indexOf("?");
	if(i > -1){
		let s = window.location.href.substr(i + 1);
		let arr = s.split("&");
		for(let i = 0; i < arr.length; i++){
			let arr2 = arr[i].split("=");
			if(arr2[0] == key){
				return decodeURIComponent(arr2[1].replace("#"));
			}
		}
	}
	return typeof defaultKey == "string" ? defaultKey: null;
}

system.loadScript = function(filename, callback ){
	var arrScript = [];
	if( typeof filename == "string" )
		arrScript.push( filename );
	else
		arrScript = filename;

	function start( index ){
		if( index == arrScript.length ){
			if( callback ) callback({code: "ok"});
			return;
		} else if (arrScript[index].indexOf(".css") > 1){ //if filename is an external CSS file
			if(document.querySelector("link[href='" + arrScript[index] + "']") != null){
				start(index+1);
				return;
			}
			var fileref=document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", arrScript[index]);
			if(typeof fileref!="undefined")
				document.getElementsByTagName("head")[0].appendChild(fileref)

			start(index+1);
		} else if (arrScript[index].indexOf(".js") > 1){
			if(document.querySelector("script[src='" + arrScript[index] + "']") != null){ // 
				start(index+1);
				return;
			}
			var script   = document.createElement("script");
			script.type  = "text/javascript";
			script.src   = arrScript[index]; //filename;
			if(typeof script != "undefined"){
				script.onload = function(){
					start(index+1);
				};
				script.onerror = function(e){
					console.log(script.src);
					console.log(e);
					if( callback ) callback({src: script.src, code: "error"});
				}
				document.getElementsByTagName("head")[0].appendChild(script);
			} else
				start(index+1);
		} else
			start(index+1);
	}
	start(0);
}
system.isSignon = function(){
	return window.storage.System().user.length > 0 ? true : false;
}
system.isTeacher = function(){
	let i = -1; //window.location.href.indexOf("localhost");
	if(window.location.href.indexOf("student=") > -1)
		i = -1;
	else 
		i = window.location.href.indexOf("localhost");
	return i >= 0 ? true : false;
}

let toast = null;
window.showToast = function(msg){
	if(toast != null){
		$(toast).remove();
		toast = null;
	}

	$.toast({
		heading: 'tutor', // 
		text: typeof msg == "string" ? msg : msg.msg,
		icon: typeof msg == "object" && typeof msg.icon == "string" ? msg.icon : "", //'info', 'error', 'success', 'warning'
		position: typeof msg == "object" && typeof msg.position == "string" ? msg.position : "top-right", //'top-right', 'top-left'
		hideAfter: typeof msg == "object" && typeof msg.hideAfter == "number" ? msg.hideAfter : 10 * 1000,
		//stack: false,
		allowToastClose: typeof msg == "object" && typeof msg.allowToastClose == "boolean" ? msg.allowToastClose : true,
		afterShown: function(arg){
			toast = this;
		},
		afterHidden: function(){
			toast = null;
		}
	});
}

system.loading = (function(){ 
	var $mask, $maskMsg; 
	var defMsg = '正在處理，請稍待......'; 
	function init(){ 
		if(!$mask){ 
			$mask = $("<div class=\"datagrid-mask mymask\"></div>").appendTo("body"); 
		} 
		if(!$maskMsg){ 
			$maskMsg = $("<div class=\"datagrid-mask-msg mymask\">"+defMsg+"</div>") 
				.appendTo("body").css({'font-size':'16px', height: "auto"}); 
		} 
		$mask.css({width:"100%",height: "100%", zIndex: 9990, backgroundColor: "rgb(0,0,0)", opacity: "0.6"}); 
		var scrollTop = $(document.body).scrollTop(); 
		$maskMsg.css({ 
			left: "50%",
			top: "50%",
			marginTop: "-60px",
			marginLeft: "-60px",
			minWidth: "120px",
			zIndex: 9991
		}); 
	} 
	return { 
		show:function(msg){ 
			init(); 
			$mask.show(); 
			$maskMsg.html(msg||defMsg).show(); 
		},
		close:function(){
			if(typeof $mask == "object") {
				$mask.remove(); 
				$maskMsg.remove(); 
				$mask = undefined;
				$maskMsg = undefined;
			}
		}
	}
 }());


