String.prototype.byteLength = function () {
    /*
    let arr=this.match(/[^\x00-\xff]/ig);
    return arr == null ? this.length : this.length + arr.length;
    */
    let len = 0, s = this.toString();
    for (let i = 0; i < s.length; i++) {
        s.charCodeAt(i) < 256 ? len++ : len += 2; // charCode大於256代表是全形字串
    }
    return len;
};
String.prototype.UNICodeLength = function () { // 為了相容
    return this.byteLength();
};
String.prototype.left = function (len = 0) {
    let maxLen = 0, s = this.toString(), result = "";
    for (let i = 0; i < s.length; i++) {
        let cLen = s.charCodeAt(i) < 256 ? 1 : 2; // charCode大於256代表是全形字串
        if (cLen + maxLen <= len) {
            result += s.substr(i, 1);
            maxLen += cLen;
        }
        else
            break;
    }
    return result;
};
String.prototype.replaceAll = function (source, newStr = "") {
    let s = this.toString().split(source).join(newStr);
    return s;
};
String.prototype.isDigital = function () {
    let s = this.toString();
    let regExp = /^[\d]+$/;
    return regExp.test(s);
};
String.prototype.isNumber = function () {
    let s = this.toString();
    s = s.replaceAll(",");
    let arr = s.split(".");
    let b = true;
    for (let i = 0; i < arr.length; i++) {
        let regExp = /^[\d]+$/;
        b = regExp.test(arr[i]);
        if (b == false)
            break;
    }
    return b;
};
String.prototype.isAlpha = function () {
    let s = this.toString();
    let regExp = /^[a-zA-Z]+$/;
    return regExp.test(s);
};
String.prototype.leftPadding = function (len, padding = "0") {
    let s = this.toString();
    while (s.byteLength() < len) {
        s = padding + s;
    }
    return s;
};
String.prototype.rightPadding = function (len, padding = " ") {
    let s = this.toString();
    while (s.byteLength() < len) {
        s += padding;
    }
    return s;
};
String.prototype.toHex = function () {
    let str = this.toString();
    let result = '';
    for (let i = 0; i < str.length; i++) {
        let c1 = str.substr(i, 1);
        let ch = str.charCodeAt(i).toString(16).toUpperCase();
        while (ch.length < 4) {
            ch = "0" + ch;
        }
        result += (result.length == 0) ? "" : " ";
        result += ch;
    }
    return result;
};
String.prototype.toDate = function () {
    /*
    1. sample:
      20160101, 20160101T123045, 20160101T12:30:45, 20160101 123045, 20160101 12:30:45,
      2016-01-01, 2016-01-01T123045, 2016-01-01T12:30:45, 2016-01-01 123045, 2016-01-01 12:30:45,
    2. 日期如沒有分隔符號，就必須要有8個字元，分隔符號有 - , /
    3. 日期和時間的分隔符號為空白字元或 T
    4. 時間部份最少要到分
    */
    let d = new Date();
    let s = this.toString();
    if (s.length > 0) {
        let arr1 = s.split((s.indexOf("T") > 0) ? "T" : " ");
        //-----------------------------------------------
        let date = [1911, 0, 1];
        if (s.indexOf("-") > 0 || s.indexOf("/") > 0) {
            let arr2 = arr1[0].indexOf("-") > -1 ? arr1[0].split("-") : arr1[0].split("/");
            for (let i = 0; i < arr2.length; i++) {
                if (!isNaN(arr2[i])) {
                    date[i] = parseInt(arr2[i], 10) - (i == 1 ? 1 : 0);
                }
            }
        }
        else if (!isNaN(arr1[0]) && arr1[0].length == 8) {
            date[0] = parseInt(arr1[0].substr(0, 4), 10);
            date[1] = parseInt(arr1[0].substr(4, 2), 10) - 1;
            date[2] = parseInt(arr1[0].substr(6, 2), 10);
        }
        d.setFullYear(date[0], date[1], date[2]);
        //-----------------------------------------------
        if (arr1.length > 1 && typeof arr1[1] == "string" && arr1[1].length > 0) {
            let arr3 = arr1[1].split(":");
            let time = [0, 0, 0, 0];
            if (arr3.length >= 2) {
                for (let j = 0; j < arr3.length; j++) {
                    if (!isNaN(arr3[j])) {
                        time[j] = parseInt(arr3[j], 10);
                    }
                }
            }
            else if (arr3.length == 1 && !isNaN(arr3[0]) && arr3[0].length >= 4) {
                time[0] = parseInt(arr3[0].substr(0, 2), 10);
                time[1] = parseInt(arr3[0].substr(2, 2), 10);
                if (arr3[0].length >= 6) {
                    time[2] = parseInt(arr3[0].substr(4, 2), 10);
                }
                if (arr3[0].length > 6) {
                    time[3] = parseInt(arr3[0].substr(6), 10);
                }
            }
            d.setHours(time[0]);
            d.setMinutes(time[1]);
            d.setSeconds(time[2]);
            d.setMilliseconds(time[3]);
        }
    }
    return d;
};
String.prototype.toNumeric = function () {
    // 去除逗點
    let s = this.toString().replaceAll(",", "");
    let n = (isNaN(s)) ? undefined : parseFloat(s);
    return n;
};
//# sourceMappingURL=String.js.map