String.prototype.replaceAll = function (source, newStr = "") {
	let s = this.toString().split(source).join(newStr);
	return s;
};
String.prototype.byteLength = function () {
	let len = 0, s = this.toString();
	for (let i = 0; i < s.length; i++) {
		s.charCodeAt(i) < 256 ? len++ : len += 2; // charCode大於256代表是全形字串
	}
	return len;
};

Number.prototype.toString = function (radius) {
	radius = typeof radius === "undefined" ? 0 : radius;
	if (radius > 20)
			radius = 20; // 小數位數不得大於 20
	let s = this.toFixed(radius) + '';
	let x = s.split('.');
	let x1 = x[0];
	let x2 = x.length > 1 ? '.' + x[1] : '';
	let rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
};

Number.prototype.padStart = function (len, padding = "0") {
	let s = this.toString(0).replaceAll(",", "");
	return s.padStart(len, padding);
};
Number.prototype.padEnd = function (len, padding = "0") {
	let s = this.toString(0).replaceAll(",", "");
	return s.padEnd(len, padding);
};

Date.prototype.toString = function (format = "yyyy/mm/dd hh:MM:ss.ms") {
	let y = this.getFullYear(), m = this.getMonth() + 1;
	let d = this.getDate(), h = this.getHours();
	let M = this.getMinutes(), s = this.getSeconds();
	let ms = this.getMilliseconds();
	let r = "";
	if (typeof (format) == "undefined") {
		format = "yyyy/mm/dd hh:MM:ss.ms";
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

Date.prototype.between = function (d, kind) { // 天
	// 1000*60*60*24 or 86400000 or 864e5, beween 有含當天
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

window.renderAccent = (kana, accent) => {
	/**
	 * 渲染日語單詞的重音標記
	 * 
	 * 重音標記規則：
	 * "0" => 無聲音：第一音拔高
	 * "1" => 第一音拔高
	 * 數字 => 該位置之前的音拔高
	 * "," or "，" => 常用表記法（逗號）
	 * "~" => 連接符號（波浪號）
	 * "-" => 句子中的各單字間隔符號
	 */
	const VOICED_SOUNDS = "ゃャゅュょョっッィ"; // 拗音、促音
	const ACCENT_SEPARATORS = ["~", "-"];
	const PERIOD = "。";
	const SPAN_ACCENT = "accent";
	const SPAN_ACCENT_BOTTOM = "accent-bottom";
	const SEPARATOR_WAVE = "~";
	const SEPARATOR_DASH = "-";

	/**
	 * 將單個片段按重音規則分段並加上HTML標記
	 * @param {string} value - 要處理的字符串
	 * @param {string|null} accentPos - 重音位置
	 * @returns {string} HTML標記的結果
	 */
	const segment = (value, accentPos) => {
		if (!value) return "";

		let normalizedAccent = normalizeAccent(accentPos);
		
		// 將拗音和促音與前一個字合併
		let charArray = splitWithVoicedSounds(value);

		// 如果沒有重音標記，直接返回
		if (normalizedAccent === null) {
			return charArray.join("");
		}

		// 分配字符到三個區間：前、重音、後
		const [before, accented, after] = partitionByAccent(charArray, normalizedAccent);

		return buildAccentedHTML(before, accented, after);
	};

	/**
	 * 規範化重音值
	 * @param {string|undefined} accent
	 * @returns {string|null} 規範化後的重音值
	 */
	const normalizeAccent = (accent) => {
		try {
			if (typeof accent === "string" && accent.length > 0) {
				return accent.charAt(0); // 使用 charAt 替代廢棄的 substr
			}
			return null;
		} catch (e) {
			console.warn(`Failed to normalize accent: "${accent}"`, e);
			return null;
		}
	};

	/**
	 * 將字符串拆分，保持拗音和促音與前一字符連接
	 * @param {string} value
	 * @returns {string[]} 字符數組
	 */
	const splitWithVoicedSounds = (value) => {
		const arr = [];
		for (let i = 0; i < value.length; i++) {
			const char = value.charAt(i);
			if (char === PERIOD) {
				// 跳過句號
				continue;
			} else if (VOICED_SOUNDS.includes(char)) {
				// 拗音、促音合併到前一個字
				if (arr.length > 0) {
					arr[arr.length - 1] += char;
				}
			} else {
				arr.push(char);
			}
		}
		return arr;
	};

	/**
	 * 根據重音位置將字符數組分為三部分
	 * @param {string[]} charArray
	 * @param {string} accentPos - 重音位置（"0", "1", 或數字）
	 * @returns {[string, string, string]} [前置, 重音, 後置]
	 */
	const partitionByAccent = (charArray, accentPos) => {
		let [before, accented, after] = ["", "", ""];
		const accentIndex = parseInt(accentPos, 10);

		for (let i = 0; i < charArray.length; i++) {
			const char = charArray[i];
			
			if (accentPos === "0" && i > 0) {
				// "0" 表示第一音拔高，其餘正常
				accented += char;
			} else if (accentPos === "1" && i === 0) {
				// "1" 表示第一音拔高
				accented += char;
			} else if (!isNaN(accentIndex) && accentIndex > 0 && i > 0 && i < accentIndex) {
				// 數字表示該位置之前的音拔高
				accented += char;
			} else {
				// 其餘放在後置或前置
				if (accented.length === 0) {
					before += char;
				} else {
					after += char;
				}
			}
		}

		return [before, accented, after];
	};

	/**
	 * 構建帶有HTML標記的重音結果
	 * @param {string} before
	 * @param {string} accented
	 * @param {string} after
	 * @returns {string} HTML字符串
	 */
	const buildAccentedHTML = (before, accented, after) => {
		let result = "";
		
		if (before) {
			result += `<span class="${SPAN_ACCENT_BOTTOM}">${before}</span>`;
		}
		if (accented) {
			result += `<span class="${SPAN_ACCENT}">${accented}</span>`;
		}
		if (after) {
			result += `<span class="${SPAN_ACCENT_BOTTOM}">${after}</span>`;
		}

		return result;
	};

	/**
	 * 檢測並返回分隔符號
	 * @param {string} str
	 * @returns {string} 分隔符號或空字符串
	 */
	const detectSeparator = (str) => {
		if (str.includes(SEPARATOR_WAVE)) return SEPARATOR_WAVE;
		if (str.includes(SEPARATOR_DASH)) return SEPARATOR_DASH;
		return "";
	};

	// 主邏輯
	const separator = detectSeparator(kana);
	const kanaValues = separator ? kana.split(separator) : [kana];
	const accentValues = separator ? accent.split(separator) : [accent];

	let result = "";
	for (let x = 0; x < kanaValues.length; x++) {
		const kanaValue = kanaValues[x];
		const accentValue = accentValues.length > x ? accentValues[x] : accentValues[0];
		const segmentResult = segment(kanaValue, accentValue);

		if (segmentResult) {
			if (result.length > 0) {
				result += separator === SEPARATOR_WAVE ? " ~ " : " ";
			}
			result += segmentResult;
		}
	}
	return result;
}
