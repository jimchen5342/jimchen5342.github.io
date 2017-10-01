window.system = {};

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
	return false;
}
system.isTeacher = function(){
	let i = window.location.href.indexOf("localhost");
	return i > -1 ? true : false;
}

/*
var x = document.createElement("SCRIPT");
var t = document.createTextNode("alert('Hello World!')");
x.appendChild(t);
document.body.appendChild(x);

// 沒試過
var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);

    var newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", cssFile);

    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink)
*/