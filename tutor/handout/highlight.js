$(document).ready(function() {
	let arr = [];
	arr.push("https://apps.bdimg.com/libs/highlight.js/9.1.0/styles/monokai-sublime.min.css");
	arr.push("http://apps.bdimg.com/libs/highlight.js/9.1.0/highlight.min.js");
	arr.push("../../extend/String.js");
	system.loadScript(arr, loaded);
});

function loaded(){
	$('pre code').each(function(i, block) {
		let arr = block.innerHTML.split("\n");
		let s = "";
		for(let i = 0; i < arr.length; i++){
			let row = arr[i];
			for(let j = 0; j < row.length; j++){
				let c = row.substr(j, 1);
				if(c == " " || c == "\t")
					s += c;
				else
					break;
			}
			if(s.length > 0)
				break;
		}
		for(let i = 0; i < arr.length; i++){
			arr[i] = arr[i].replace(s, "");
			arr[i] = arr[i].replaceAll("\t", "  ");
		}
		block.innerHTML = arr.join("\n");
	});

	$('pre code').each(function(i, block) {
		hljs.highlightBlock(block);
	});
}