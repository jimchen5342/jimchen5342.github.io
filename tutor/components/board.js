(function(window, undefined) {
	let board = {}, whiteBoard;

	function adjust(){
		$('#winBoard').window({
			border:'thin',
			cls:'c10',
			maximizable: false,
			collapsible: false,
			draggable: false,
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
			},
			tools:[{
				iconCls: 'icon-ok',
				handler: send
			/*}, {
				iconCls:'icon-speech',
				id: "speech",
				handler:function(){
				}		
			}, {
				iconCls:'icon-man',
				id: "man",
				handler:function(){

				}*/
			}]
		});
		//$('#winBoard').window('open');
	}
	function send(){
		if(system.isSignon() == false){
			alert("請先登入!!")
			return;
		}
		system.loading.show();
		let data = whiteBoard.canvas.toDataURL();
		console.log(data)
		let obj = {
			type: "canvas",
			date: fireBase.serverTime(),
			uid: fireBase.uid,
			data: data
		}
		if(system.isTeacher())
			obj.to = student; // : "All"
		let key = storage.System().teacher.length > 0 ? storage.System().teacher : fireBase.uid;
		fireBase.database().ref("broadcast/" + key + "/" + fireBase.uid).set(obj)
		.then(()=>{
			system.loading.close();
			window.showToast({
				msg: "圖檔已送出", 
				icon: "info",
				allowToastClose: false
			});
		}).catch(arg=>{

		});
	}
	setTimeout(function(){
		adjust();
	}, 600);

	board.load = function(base64){ // 由 chrome extension 通知
		whiteBoard = new WhiteBoard(base64);
	}

	board.listen = function(snap){
		
		let row = snap.val();
		//console.log(base64)
		if(typeof row.cmd == "string"){

		} else if(typeof row.data == "string"){
			whiteBoard = new WhiteBoard(row.data);
			
			return;
			$("#layoutBoard").html("")
			var img = new Image();
			img.onerror = function() {
			};
			img.onload = function() {
				canvas = document.createElement('canvas');
				let ctx = canvas.getContext("2d");
				let r1 = $("#layoutBoard").width() / img.width;
				let r2 = $("#layoutBoard").height() / img.height;
				if(r2 < r1){
					canvas.width = img.width * r2;
					canvas.height = $("#layoutBoard").height();
					rate = r2;
				} else {
					canvas.height = img.height * r1;
					canvas.width = $("#layoutBoard").width();
					rate = r1;
				}
				ctx.drawImage(img,0,0, img.width, img.height, 0, 0, canvas.width, canvas.height);
				$(canvas).appendTo("#layoutBoard")
			};
			img.src = row.data;			
		}
	}

	window.board = board;

	let WhiteBoard = function(base64){
		$("#layoutBoard").html("");
		$('#winBoard').window('open');
		this.rate = 1, self = this;
	
		var img = new Image();
		img.onerror = function() {
		};
		img.onload = function() {
			let canvas = document.createElement('canvas');
			canvas.id = "canvas"
			$(canvas).appendTo("#layoutBoard");
			let h = $("#layoutBoard").height(), w = $("#layoutBoard").width() - 0;
			let r1 = w / img.width;
			let r2 = h / img.height;
			if(r2 < r1){
				canvas.width = img.width * r2;
				canvas.height = h;
				self.rate = r2;		
			} else {
				canvas.height = img.height * r1;
				canvas.width = w;
				self.rate = r1;
			}
			self.canvas = new fabric.Canvas('canvas', {selection: false});

			let imgInstance = new fabric.Image(img, {
				lockMovementX: true,
				lockMovementY: true,
				scaleX: self.rate,
				scaleY: self.rate
			});
			self.canvas.add(imgInstance);
			imgInstance.set('selectable', false);
			
			handle();
		};
		img.src = base64;

		let line, isDown, position = {}, mode = "line";
		function handle(){
			self.canvas.on('mouse:down', function(o){
				isDown = true;
				var pointer = self.canvas.getPointer(o.e);
				if(mode == "line"){
					var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
					line = new fabric.Line(points, {
						strokeWidth: 2,
						fill: 'red',
						stroke: 'red',
						originX: 'center',
						originY: 'center'
					});
					self.canvas.add(line);					
				}
				position = {x1: pointer.x, y1: pointer.y};
			});
			
			self.canvas.on('mouse:move', function(o){
				if (!isDown) return;
				var pointer = canvas.getPointer(o.e);
				if(mode == "line"){
					line.set({ x2: pointer.x, y2: pointer.y });
				}
				self.canvas.renderAll();
				position = Object.assign(position, { x2: pointer.x, y2: pointer.y });
				//console.log(position)
			});
			
			self.canvas.on('mouse:up', function(o){
				isDown = false;
				setTimeout(function(){
					//self.canvas.remove(line);
				}, 3000)
				
			});
		}
	}
	WhiteBoard.prototype = {
		execute: function(){

		}
	};

})(window);