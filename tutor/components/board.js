(function(window, undefined) {
	let board = {};
	board.load = function(base64){
		//console.log(base64)
		var img = new Image();
		img.onerror = function() {
		};
		img.onload = function() {

		};
		img.src = base64;
		$(img).appendTo("#layoutBoard")
		$('#winBoard').window('open');
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