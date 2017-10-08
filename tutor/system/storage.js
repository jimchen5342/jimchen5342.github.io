(function(window, undefined) {
let setting = undefined;
Storage.prototype.Setting = function(data){
	let tbl = "setting";
	if(typeof data == "undefined"){
		if(typeof setting) {
			let s = localStorage.getItem(tbl);
			let json = typeof s == "undefined" || s == null ? {} : JSON.parse(s);
			setting = Object.assign({
				HTML: "00-basic", 
				CSS: "00-basic", 
				JavaScript: "00-basic",
				current: 0,
				doc: 0
			}, json);			
		}
		return setting;
	} else if(data == null){
		setting = undefined;
		delete localStorage[tbl];
	} else {
		setting = Object.assign(setting, data);
		localStorage.setItem(tbl,JSON.stringify(setting));
		return setting;
	}
}
Storage.prototype.System = function(data){
	let tbl = "tutor";
	if(typeof data == "undefined"){
		let s = localStorage.getItem(tbl);
		let json = typeof s == "undefined" || s == null ? {} : JSON.parse(s);
		return Object.assign({user: "", pwd: "", aes: ""}, json);
	} else if(data == null){
		delete localStorage[tbl];
	} else {
		let s = localStorage.getItem(tbl);
		if(typeof s == "string" && s.length > 0){
			data = Object.assign(JSON.parse(s), data);
		}
		localStorage.setItem(tbl,JSON.stringify(data));
		return data;
	}
}
window.storage = localStorage;

})(window);