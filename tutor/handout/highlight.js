$(document).ready(function() {
	let arr = [];
	arr.push("https://apps.bdimg.com/libs/highlight.js/9.1.0/styles/monokai-sublime.min.css");
	arr.push("http://apps.bdimg.com/libs/highlight.js/9.1.0/highlight.min.js");
	arr.push("http://cdnjs.cloudflare.com/ajax/libs/highlightjs-line-numbers.js/2.1.0/highlightjs-line-numbers.min.js");
	arr.push("../../extend/String.js");
	//arr.push("./extend/String.js");
	system.loadScript(arr, loaded);
});

function loaded(){
	$('pre').each(function(i, block) {
		let s = "";
		let arr = block.innerHTML.split("</code>");
		for(let i = 0; i < arr.length; i++){
			s += parse(arr[i]);
		}
		block.innerHTML = s;
	});

	function parse(h){
		let i1 = h.indexOf("<code");
		let i2 = h.indexOf(">", i1);
		let start = h.substr(i1, i2 + 1)
		h = h.substr(i2 + 1);
		h = h.replace("</code>", "");
	
		let arr = h.split("\n");
		if(arr.length > 0 && arr[0] == "") 
			arr.splice(0, 1);
		if(arr.length > 0 && arr[arr.length - 1].trim() == "") 
			arr.splice(arr.length - 1, 1);
		let s = "";
		for(let i = 0; i < arr.length; i++){
			let row = arr[i];
			for(let j = 0; j < row.length; j++){
				let c = row.substr(j, 1);
				if(c == " " || c == "\t")
					s += c == " " ? c : "  ";
				else
					break;
			}
			if(s.length > 0)
				break;
		}
		console.log("s: " + s.length)
		for(let i = 0; i < arr.length; i++){
			if(arr[i].indexOf("\t") > -1)
				arr[i] = arr[i].replaceAll("\t", "  ");
			arr[i] = arr[i].replace(s, "");
			arr[i].trim();
			console.log(arr[i])
		}
		if(arr.length > 0 && arr[0] == "") 
			arr.splice(0, 1);
		if(arr.length > 0 && arr[arr.length - 1].trim() == "") 
			arr.splice(arr.length - 1, 1);
		//console.log(arr)
		return start.trim() + arr.join("\n") + "</code>";
	}
	
	$('pre code').each(function(i, block) {
		hljs.highlightBlock(block);
	});
	$('code.hljs').each(function(i, block) {
		hljs.lineNumbersBlock(block);
	});
}
