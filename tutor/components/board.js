(function(window, undefined) {
	let board = {}, canvas;
	board.load = function(base64){
		$('#winBoard').window('open');
		//console.log(base64)
		$("#layoutBoard").html("")
		var img = new Image();
		img.onerror = function() {
		};
		img.onload = function() {
			canvas = document.createElement('canvas');
			let ctx = canvas.getContext("2d");
			canvas.width = $("#layoutBoard").width() - 0;
			canvas.height = $("#layoutBoard").height() - 0;
			ctx.drawImage(img,0,0, img.width, img.height, 0, 0, canvas.width, canvas.height);
			$(canvas).appendTo("#layoutBoard")
		};
		img.src = base64;
		
	}
	function adjust(){
		$('#winBoard').window({
			border:'thin',
			cls:'c6',
			maximizable: false,
			collapsible: false,
			onOpen:function(){ 
			},
			onBeforeClose:function(){ 
			},
			onMove: function(left, top) {
			},
			onResize: function(width, height) {
			},
			onCollapse:function(){
			},
			onExpand:function(){
			},
			onMaximize: function(){
			},
			onMinimize: function(){
			}
		});
	}
	setTimeout(function(){
		adjust();
	}, 600)
	window.board = board;
})(window);