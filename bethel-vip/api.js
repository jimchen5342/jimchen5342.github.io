(function () {
	omniChannel = {};
	var url = "http://rd.jabezpos.com:12345";
	var setting = {};

	omniChannel.ajax = function(api, arg, success, error){
		let headers = {
			"content-type": "application/x-www-form-urlencoded",
			"cache-control": "no-cache",
			"x-debug": 1
		}
		if(typeof omniChannel.token != "undefined"){
			headers["x-app-token"] = omniChannel.token;
			headers["x-db"] = "vip_dbs01_dbo";
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
				console.log(XMLHttpRequest, textStatus)
			},
			timeout: 6000
		});
	};
	
	omniChannel.topUp = function(success, error){ // 儲值碼
		signon(function(result){
			//console.log(result)
			omniChannel.ajax("retailAPPs_VIP/store/genBarCode/" + $("#SITE").val(), {
				ID_NO: result.ID_NO, //'0937170831',
			}, 
			function(result){
				//console.log(result)
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
		console.log(JSON.stringify({
			VERIFY_ID: $("#VERIFY_ID").val(), //'0937170831',
			VERIFY_PW: $("#VERIFY_PW").val(), //"12345",
			SITE: $("#SITE").val(), //"BSMS000032"
		}))
		omniChannel.ajax("retailAPP_VIP/loginByVerifyID",  {
			VERIFY_ID: $("#VERIFY_ID").val(), //'0937170831',
			VERIFY_PW: $("#VERIFY_PW").val(), //"12345",
			SITE: $("#SITE").val(), //"BSMS000032"
		}, 
		function(result){
			if(typeof result.data == "object" && result.data != null && typeof result.data.token == "string"){
				omniChannel.ID_NO = result.data.ID_NO;
				omniChannel.token = result.data.token;
				success({token: omniChannel.token, ID_NO: omniChannel.ID_NO});
				//console.log(omniChannel.token)			
			} else if(error) {
				error("登入失敗");
			}
		},
		function(err){
			console.log(err)
			if(error) error("登入失敗");
		});
	}

	window.omniChannel = omniChannel;
	})();