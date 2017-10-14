(function(window, undefined) {
	let board = {}, whiteBoard;

	function adjust(){
		let tools = [];
		if(system.isSignon() && system.isTeacher()){
			tools.push({
				iconCls: 'icon-ok',
				handler: function(){
					system.loading.show();
					let data = whiteBoard.canvas.toDataURL();
					send({data}, 
						function(){
							system.loading.close();
							window.showToast({
								msg: "圖檔已送出", 
								icon: "info",
								allowToastClose: false
							});
						}
					)
				}
			});
		}

		$('#winBoard').window({
			border:'thin',
			cls:'c10',
			maximizable: false,
			collapsible: false,
			draggable: false,
			onOpen:function(){ 
			},
			onBeforeClose:function(){
				if(system.isSignon() && system.isTeacher() && student.length > 0)
					send({cmd: "close"})
				whiteBoard = undefined;
			},
			tools: tools
		});
		//$('#winBoard').window('open');
	}
	function send(json, success, error){
		if(system.isSignon() == false){
			system.loading.close();
			alert("請先登入!!");
			if(error) error();
			return;
		} else if(system.isTeacher() && student.length == 0){
			system.loading.close();
			alert("請先指定學生!!");
			if(error) error();
			return;
		}
	
		let obj = {
			type: "canvas",
			date: fireBase.serverTime(),
			uid: fireBase.uid,
		}
		if(system.isTeacher())
			obj.to = student; // : "All"
		obj = Object.assign(obj, json);

		let key = storage.System().teacher.length > 0 ? storage.System().teacher : fireBase.uid;
		fireBase.database().ref("broadcast/" + key + "/" + fireBase.uid).set(obj)
		.then(()=>{
			if(success) success();
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
			if(row.cmd == "close")
				$('#winBoard').window('close');
			else if(typeof whiteBoard == "object") {
				whiteBoard.execute(row);
			}
		} else if(typeof row.data == "string"){
			whiteBoard = new WhiteBoard(row.data);
		}
	}

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
			//console.log(self.canvas.width)

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

		let line, rect, isDown, drawingMode = true, position = {}, mode = "line", color = "red";
		function handle(){
			mode = "rect";
			self.canvas.on('mouse:down', function(o){
				isDown = true;
				if(mode == "line"){
					let pointer = self.canvas.getPointer(o.e);
					let points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
					line = new fabric.Line(points, {
						strokeWidth: 2,
						fill: color,
						stroke: color,
						originX: 'center',
						originY: 'center'
					});
					self.canvas.add(line);
					position = {x1: pointer.x, y1: pointer.y};
				} else if(mode == "rect"){
					position = {x1: o.e.offsetX, y1: o.e.offsetY};
					rect = new fabric.Rect({
            left: position.x1, //o.e.clientX,
            top: position.y1, //o.e.clientY,
            width: 0,
            height: 0,
            stroke: color,
						strokeWidth: 2,
						originX: "left",
						originY: "top",
            fill: ''
					});
					rect.set('selectable', false);
					self.canvas.add(rect);
				}
			});
			
			self.canvas.on('mouse:move', function(o){
				if (!isDown || !drawingMode) return;
				if(mode == "line"){
					var pointer = self.canvas.getPointer(o.e);
					line.set({x2: pointer.x, y2: pointer.y});
					position = Object.assign(position, {x2: pointer.x, y2: pointer.y});
				} else if(mode == "rect"){
					position = Object.assign(position, {x2: o.e.offsetX, y2: o.e.offsetY});
					rect.width = Math.abs(position.x2 - position.x1);
					rect.height = Math.abs(position.y2 - position.y1);
				}
				self.canvas.renderAll();
			});
			
			self.canvas.on('mouse:up', function(o){
				isDown = false;
				if(system.isSignon() && (!system.isTeacher() || (system.isTeacher() && student.length > 0))){
					let json = {
						cmd: mode,
						position,
						color,
						width: self.canvas.width
					}
					send(json, 
						function(){
						}, 
						function(){
						}
					)
				}
			});
			self.canvas.on('object:selected', function(){
				drawingMode = false;         
			});
			self.canvas.on('selection:cleared', function(){  
					drawingMode = true;      
			});
		}
	}
	WhiteBoard.prototype = {
		execute: function(json){
			let self = this;
			let rate = self.canvas.width / json.width;
			let points = [json.position.x1 * rate, json.position.y1 * rate, 
				json.position.x2 * rate, json.position.y2 * rate];
			if(json.cmd == "line"){
				line = new fabric.Line(points, {
					strokeWidth: 2,
					fill: json.color,
					stroke: json.color,
					originX: 'center',
					originY: 'center'
				});
				self.canvas.add(line);
				self.canvas.renderAll();
			} else if(json.cmd == "rect"){
				rect = new fabric.Rect({
					left: points.x1,
					top: points.y1,
					width: Math.abs(points.x2 - points.x1),
					height: Math.abs(points.y2 - points.y1),
					stroke: color,
					strokeWidth: 2,
					originX: "left",
					originY: "top",
					fill: ''
				});
				rect.set('selectable', false);
				self.canvas.add(rect);
			}
		}
	};

	window.board = board;	
})(window);