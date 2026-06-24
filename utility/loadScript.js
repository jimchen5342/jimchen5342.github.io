let loadScript = function(filename){
	return new Promise(function(resolve, reject){
		let arrScript = [];
		if( typeof filename == "string" )
			arrScript.push( filename );
		else
			arrScript = filename;

		function start( index ){
			if( index === arrScript.length ){
				resolve();
				return;
			}

			const item = arrScript[index];
			if(!item){
				start(index+1);
				return;
			}

			if (item.indexOf(".css") > -1){ // external CSS file
				let link = document.createElement("link");
				link.setAttribute("rel", "stylesheet");
				link.setAttribute("type", "text/css");
				link.setAttribute("href", item);
				link.className = "css";
				document.getElementsByTagName("head")[0].appendChild(link);
				start(index+1);
			} else if (item.indexOf(".js") > -1){
				let script = document.createElement("script");
				script.type = "text/javascript";
				script.src = item;
				script.className = "js";
				script.onload = function(){
					start(index+1);
				};
				script.onerror = function(){
					reject(new Error('Failed to load script: ' + item));
				};
				document.getElementsByTagName("head")[0].appendChild(script);
			} else {
				start(index+1);
			}
		}

		removeClass(".js");
		removeClass(".css");
		start(0);

		function removeClass(cls) {
			let els = document.querySelectorAll(cls)
			for(let i = 0; i < els.length; i++) {
				els[i].parentNode.removeChild(els[i]);
			}
		}
	});
};