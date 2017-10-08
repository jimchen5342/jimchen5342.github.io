(function(window, undefined) {
	var crypt = {};
	crypt.initial = function(){
		if(typeof this.key == "undefined"){
			let iv = storage.System().aes;
			//if(typeof s == "undefined") s = "";
			this.key = CryptoJS.enc.Utf8.parse("tutor");
			this.iv = CryptoJS.enc.Utf8.parse(iv);
			this.key = (this.key + "0123456789ABCDEF").substr(0, 16);
			this.iv = (this.iv + "0123456789ABCDEF").substr(0, 16);			
		}
	}
	crypt.encrypt = function(data){
		this.initial();
		var encrypted = CryptoJS.AES.encrypt(data, this.key, {
			iv: this.iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return encrypted.toString();
	}
	crypt.decrypt = function(data){
		this.initial();
		var decrypted = CryptoJS.AES.decrypt(data, this.key, {
			iv: this.iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return CryptoJS.enc.Utf8.stringify(decrypted);
	}
	window.crypt = crypt; 
})(window);
