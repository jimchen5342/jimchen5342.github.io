let menu = [
	{
		text: "HTML",
		data: [{
				id: "00-basic",
				text: "基本架構",
				context: "lesson00.t.html",
				html: "lesson00.html",
				css: "style.css",
				js: "system.js"
			}, {
				id: "01-block",
				text: "區塊/標題",
				context: "lesson01.t.html",
				html: "lesson01.html",
			}, {
				id: "02-ul",
				text: "項目清單",
				context: "lesson02.t.html",
				html: "lesson02.html",
			}, {
				id: "03-img",
				text: "圖片和超連結",
				context: "lesson03.t.html",
				html: "lesson03.html",
			}, {
				id: "04-font",
				text: "字體",
				context: "lesson04.t.html",
				html: "lesson04.html",				
			}, {
				id: "05-table",
				text: "表格",
				context: "lesson05.t.html",
				html: "lesson05.html",
			}, {
				id: "06-form",
				text: "表單",
				context: "lesson06.t.html",
				html: "lesson06.html",	
			}, {
				id: "07-iframe",
				text: "框窗",
				context: "lesson07.t.html",
				html: "lesson07.html",	
			}, {
				id: "08-event",
				text: "事件",
				context: "lesson08.t.html",
				html: "lesson08.html",	
			}, {
				id: "09-color",
				text: "顏色",
				context: "lesson09.t.html",
				html: "lesson09.html"
			}
		] //
	}, {
		text: "CSS",
		data: [{
			id: "00-basic",
			text: "基本架構",
			context: "lesson00.t.html",
			html: "lesson00.html",
			css: "style.css",
		}, {
			id: "01-selector",
			text: "選擇器",
			children: [{
				id: "011-selector",
				text: "簡單選擇器",
				context: "lesson01.1.t.html",
				html: "lesson01.1.html",
			}, {
				id: "012-selector",
				text: "複合選擇器",
				context: "lesson01.2.t.html",
				html: "lesson01.2.html",
			}, {
				id: "013-selector",
				text: "屬性選擇器",
				context: "lesson01.3.t.html",
				html: "lesson01.3.html",
			}, {
				id: "014-selector",
				text: "偽類別選擇器一",
				context: "lesson01.4.t.html",
				html: "lesson01.4.html",
			}, {
				id: "015-selector",
				text: "偽類別選擇器二",
				context: "lesson01.5.t.html",
				html: "lesson01.5.html",
			}, {
				id: "016-selector",
				text: "偽元素選擇器",
				context: "lesson01.6.t.html",
				html: "lesson01.6.html",				
			}]
		}, {
			id: "02-font",
			text: "字體",
			context: "lesson02.t.html",
			html: "lesson02.html",
		}, {
			id: "03-text",
			text: "文本",
			context: "lesson03.t.html",
			html: "lesson03.html",
		}, {
			id: "04-dimension",
			text: "尺寸",
			context: "lesson04.t.html",
			html: "lesson04.html",
		}, {
			id: "05-layout",
			text: "布局",
			context: "lesson05.t.html",
			html: "lesson05.html",
		}, {
			id: "06-position",
			text: "定位",
			context: "lesson06.t.html",
			html: "lesson06.html",
		}, {
			id: "07-background",
			text: "背景",
			context: "lesson07.t.html",
			html: "lesson07.html",	
		}, {
			id: "21-box",
			text: "Box Model",
			context: "lesson21.t.html",
			//html: "lesson21.html",
			children: [{
				id: "211-margin",
				text: "margin",
				context: "lesson21.1.t.html",
				html: "lesson21.1.html",
			}, {
				id: "212-border",
				text: "border",
				context: "lesson21.2.t.html",
				html: "lesson21.2.html",
			}, {
				id: "213-padding",
				text: "padding",
				context: "lesson21.3.t.html",
				html: "lesson21.3.html",
			}, {
				id: "214-box-sizing",
				text: "box-sizing",
				context: "lesson21.4.t.html",
				html: "lesson21.4.html",
			}, {
					id: "215-box-shadow",
					text: "box-shadow",
				context: "lesson21.5.t.html",
				html: "lesson21.5.html",
			}]
		}, {
			id: "22-flexbox",
			text: "Flex Box",
			context: "lesson22.t.html",
			html: "lesson22.html",
		// }, {
		// 	id: "90-RWD",
		// 	text: "RWD",
		// 	context: "lesson90.t.html",
		// 	html: "lesson90.html",			
		}]
	}, {
		text: "JavaScript",
		data: [{
			id: "00-basic",
			text: "概述",
			//context: "00-basic.t.html",
		}, {
				text: "入門",
				children: [{
					id: "01-include",
					text: "如何使用",
					//context: "01-include.t.html",
				}, {
					id: "02-syntax",
					text: "語法",
					// context: "02-syntax.t.html",
					// html: "02-syntax.html",
					files: "html"
				}, {
					id: "03-declare",
					text: "宣告",
					// context: "03-declare.t.html",
					// html: "03-declare.html",
					files: "html"
				}, {
					id: "04-variable",
					text: "變數",
					// context: "04-variable.t.html",
					// html: "04-variable.html",
					files: "html"
				}]
		}, {
			//id: "05-operator",
			text: "運算子",
			children: [{
				id: "051-assign",
				text: "指派運算子",
				// context: "051-assign.t.html",
				// html: "051-assign.html",
			}, {
					id: "052-assign",
					text: "字串運算子",
					context: "052-string.t.html",
					html: "052-string.html",				
			}, {
				id: "053-math",
				text: "算術運算子",
				// context: "053-math.t.html",
				// html: "053-math.html",
			}, {
				id: "054-compare",
				text: "比較運算子",
				// context: "054-comparecompare.t.html",
				// html: "054-compare.html",
			}, {
				id: "055-logic",
				text: "邏輯運算子",
				// context: "055-logic.t.html",
				// html: "055-logic.html",
			// 	html: "05-.html",
			}]
		}, {
			text: "條件陳述句",
			children: [{
				id: "061-if",
				text: "if",
			}, {
					id: "062-switch",
					text: "switch",
			}]
		}, {
			text: "迴圈陳述句",
			children: [{
				id: "071-for",
				text: "for",
			}, {
				id: "072-while",
				text: "while",
			}]
		//}, {
			// id: "01",
			// text: "",
			// context: ".t.html",
			// html: ".html",
			// children: [{
			// 	id: "01",
			// 	text: "a",
			// 	context: ".t.html",
			// 	html: ".html",
			// }]
		//}, {
			// id: "01",
			// text: "",
			// context: ".t.html",
			// html: ".html",
			// children: [{
			// 	id: "01",
			// 	text: "a",
			// 	context: ".t.html",
			// 	html: ".html",
			// }]
		//}, {
			// id: "01",
			// text: "",
			// context: ".t.html",
			// html: ".html",
			// children: [{
			// 	id: "01",
			// 	text: "a",
			// 	context: ".t.html",
			// 	html: ".html",
			// }]
		}]
	}, {
		text: "作業",
		data: []
	}
];
