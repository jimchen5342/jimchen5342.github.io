function write(s, v) {
	let body = document.getElementsByTagName('body')[0];

	body.innerHTML += 
		(arguments.length == 2 ? "<span style='color: red'>" + s + ": </span>" + v : s)
		 + "<br/>";
}