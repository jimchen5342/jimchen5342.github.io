Date.prototype.toString = function (format = "yyyy/mm/dd hh:MM:ss:ms") {
	let y = this.getFullYear(), m = this.getMonth() + 1;
	let d = this.getDate(), h = this.getHours();
	let M = this.getMinutes(), s = this.getSeconds();
	let ms = this.getMilliseconds();
	let r = "";
	if (typeof (format) == "undefined") {
		format = "yyyy/mm/dd hh:MM:ss:ms";
	}
	r = format.replace("yyyy", y);
	r = r.replace("yy", ("" + y).substr(2, 2));
	if (m < 10)
		m = "0" + m;
	r = r.replace("mm", m);
	if (d < 10)
		d = "0" + d;
	r = r.replace("dd", d);
	if (h < 10)
		h = "0" + h;
	r = r.replace("hh", h);
	if (M < 10)
		M = "0" + M;
	r = r.replace("MM", M);
	if (s < 10)
		s = "0" + s;
	r = r.replace("ss", s);
	if (ms < 10)
		ms = "00" + ms;
	else if (ms < 100)
		ms = "0" + ms;
	r = r.replace("ms", ms);
	return r;
};
Date.prototype.addDays = function (days = 0) {
	let d = this;
	d.setDate(d.getDate() + days);
	return d;
};
Date.prototype.addHours = function (h = 0) {
	let d = this;
	d.setDate(d.getDate() + (h * 60 * 60 * 100));
	return d;
};
Date.prototype.addMinutes = function (m = 0) {
	let d = this;
	d.setDate(d.getDate() + (m * 60 * 100));
	return d;
};
Date.prototype.addSeconds = function (s = 0) {
	let d = this;
	d.setDate(d.getDate() + (s * 100));
	return d;
};
Date.prototype.between = function (d, kind) { // 天
	// 1000*60*60*24 or 86400000 or 864e5
	let seed = 864e5; // 預設為天
	if(typeof kind == "string") {
		if(kind == "s") //秒
			seed = 1000;
		else if(kind == "M")// 分
			seed = 1000 * 60;
		else if(kind == "h")// 時
			seed = 1000 * 60 * 60;
	}

	var t = this,
		i = t.getTime() - d.getTime(),
		r = Math.ceil(i / seed);
	//console.log("between: " + i + "ms => " + r + " => " + (Math.round((i / seed) * 100) / 100));
	return r;
};