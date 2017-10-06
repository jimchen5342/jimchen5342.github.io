/*  
* 名稱：全通路-支付－反向
* 2017/02/18
* LinePay: 706, 
* 支付寶(台新): 703
* 支付寶(永豐): 707
* 票券核銷 － 503
* linepay QRCode: http://sandbox-web-pay.line.me/web/sandbox/payment/otk
*/

(function () {
	//--------------------------------------------------------------
	omniChannel = {};
	var url = "http://rd.jabezpos.com:12345";
	//console.log(url);
	var setting = {}, title = "", P_ID = "";
	
	omniChannel.ajax = function(api, arg, success, error){
		console.log(api + ": " + JSON.stringify(arg));
		let headers = {
			"content-type": "application/x-www-form-urlencoded",
			"cache-control": "no-cache",
			"x-debug": 1
		}
		if(typeof omniChannel.token != "undefined"){
			headers["x-app-token"] = omniChannel.token;
		}
		$.ajax({
			url: url + "/" + api, //encode(),
			"data": arg,
			type: 'POST',
			async: true,
			"headers": headers,	
			success: function (result) {	
				success(result);
			},
			error: function (XMLHttpRequest, textStatus, errorThrown){
				
			},
			timeout: 6000
		});
	};
	
	omniChannel.topUp = function(success, error){ // 儲值碼
		signon(function(result){
			omniChannel.ajax("retailAPPs_VIP/store/genBarCode/" + $("#SITE").val(), {
				ID_NO: result.ID_NO, //'0937170831',
			}, 
			function(result){
				console.log(result.data)
				if(success)
					success(result.data)
			},
			function(){
				if(error)
					error();
			});
		}, error);
	}
	
	function signon(success, error){
		omniChannel.ajax("retailAPP_VIP/loginByVerifyID",  {
			VERIFY_ID: $("#VERIFY_ID").val(), //'0937170831',
			VERIFY_PW: $("#VERIFY_PW").val(), //"12345",
			SITE: $("#SITE").val(), //"BSMS000032"
		}, 
		function(result){
			console.log(result);
			if(typeof result.data == "object" && typeof result.data.token == "string"){
				omniChannel.ID_NO = result.data.ID_NO;
				omniChannel.token = result.data.token;
				success({token: omniChannel.token, ID_NO: omniChannel.ID_NO});				
			} else if(error) {
				error("登入失敗");
			}
		},
		function(){
			if(error) error("登入失敗");
		});
	}

	
	window.omniChannel = omniChannel;
	})();