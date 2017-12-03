(function(window, undefined) {
	let board = {}, whiteBoard;
/*
more_vert
save
delete
phonelink_erase
*/
	function dropImage(){
		let $drop = $("#layoutBoard");
		//抑制瀏覽器原有的拖拉操作效果
		function stopEvent(evt) {
			evt.stopPropagation();
			evt.preventDefault();
		}
		$drop.bind("dragover", function (e) {
			//滑鼠經過上方時加入特效
			stopEvent(e);
			$(e.target).addClass("hover");
		}).bind("dragleave", function (e) {
			//滑鼠移開時移除特效
			stopEvent(e);
			$(e.target).removeClass("hover");
		}).bind("drop", function (e) {
			//拖放操作完成事件
			stopEvent(e);
			$(e.target).removeClass("hover");
			//由dataTransfer.files取得檔案資訊
			var files = e.originalEvent.dataTransfer.files;
			var imageFiles = $.map(files, function (f, i) {
				//只留下type為image/*者，例如: image/gif, image/jpeg, image/png...
				return f.type.indexOf("image") == 0 ? f : null;
			});
			
			//逐一讀入各圖檔，取得DataURI，顯示在網頁上
			$.each(imageFiles, function (i, file) {
				//使用File API讀取圖檔內容轉為DataUri
				var reader = new FileReader();
				reader.onload = function (e) {
					console.log(e.target.result)
					whiteBoard = new WhiteBoard(e.target.result);
				}
				reader.readAsDataURL(file);
			});
		});		
	}
	function adjust(){
		dropImage();
		$('#winBoard').window({
			border:'thin',
			cls:'c10',
			zIndex: 10,
			maximizable: false,
			collapsible: false,
			draggable: false,
			onOpen:function(){ 
			},
			onBeforeClose:function(){
				if(system.isSignon() && system.isTeacher() && student.length > 0)
					send({cmd: "close"})
				whiteBoard = undefined;
			}
		});
		//$('#winBoard').window('open');
	}
	function tools(){ // 調色盤
		$("#cmd > li").bind("click", function(){
			if($(this).text() == "close"){
				$('#winBoard').window('close');
			} else if($(this).text() == "comment"){
					$('#winSpeech').window('open');
			} else if(typeof whiteBoard == "object"){
				if($(this).text() == "share"){ // 分享....
					whiteBoard.send();
				} else if($(this).text() == "undo")
					whiteBoard.set("undo");
				else
					whiteBoard.set("clearAll");
			}
		});
		$("#sharp > li").bind("click", function(){
			$("#sharp > li").removeClass("active");
			$(this).addClass("active");
			console.log($(this).text())
			if(typeof whiteBoard == "object"){
				whiteBoard.set("mode", ($(this).text() == "edit") ? "line" : "rect");
			}
		});
		$("#palette > li").bind("click", function(){
			$("#palette > li").removeClass("active");
			$(this).addClass("active");
			let color = $("#palette > li.active > i").css("color");
			//console.log(color)
			if(typeof whiteBoard == "object"){
				whiteBoard.set("color", color);
			}
		});
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
		tools();
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
		//$('#winSpeech').window('close');
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
			$("#share").addClass("active");
			handle();
		};
		img.src = base64;

		let line, rect, isDown, drawingMode = true, position = {};
		self.mode = "line"; self.color = "red";
		function handle(){
			//self.mode = "rect";
			self.canvas.on('mouse:down', function(o){
				isDown = true;
				if(self.mode == "line"){
					let pointer = self.canvas.getPointer(o.e);
					let points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
					line = new fabric.Line(points, {
						strokeWidth: 2,
						fill: self.color,
						stroke: self.color,
						originX: 'center',
						originY: 'center'
					});
					self.canvas.add(line);
					position = {x1: pointer.x, y1: pointer.y};
				} else if(self.mode == "rect"){
					position = {x1: o.e.offsetX, y1: o.e.offsetY};
					rect = new fabric.Rect({
            left: position.x1, //o.e.clientX,
            top: position.y1, //o.e.clientY,
            width: 0,
            height: 0,
            stroke: self.color,
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
				if(self.mode == "line"){
					var pointer = self.canvas.getPointer(o.e);
					line.set({x2: pointer.x, y2: pointer.y});
					position = Object.assign(position, {x2: pointer.x, y2: pointer.y});
				} else if(self.mode == "rect"){
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
						cmd: self.mode,
						position,
						color: self.color,
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
					left: points[0],
					top: points[1],
					width: Math.abs(points[2] - points[0]),
					height: Math.abs(points[3] - points[1]),
					stroke: json.color,
					strokeWidth: 2,
					originX: "left",
					originY: "top",
					fill: ''
				});
				rect.set('selectable', false);
				self.canvas.add(rect);
			}
		},
		send: function(){
			system.loading.show();
			let data = this.canvas.toDataURL();
			send({data}, 
				function(){
					$("#share").removeClass("active");
					system.loading.close();
					window.showToast({
						msg: "圖檔已送出", 
						icon: "info",
						allowToastClose: false
					});
				}
			)
		},
		set: function(option, cmd){
			//console.log(option + " == " + cmd)
			if(option == "color"){
				this.color = cmd;
			} else if(option == "mode"){
				this.mode = cmd;
			} else {
				let objs = this.canvas.getObjects();
				for(let i = objs.length - 1; i > 0; i-- ){
					this.canvas.remove(objs[i]);
					if(option == "undo")
						break;
				}
			}
		}
	};
	window.board = board;	
})(window);