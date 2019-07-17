//  還沒寫。。。。。。。。。。。。。。。。。。。。。
var firebaseConfig = {
	apiKey: "AIzaSyBWQniiIXp02FQfrehGV26lp7-zLofe0ZE",
	authDomain: "japan-5342.firebaseapp.com",
	databaseURL: "https://japan-5342.firebaseio.com",
	projectId: "japan-5342",
	storageBucket: "japan-5342.appspot.com",
	messagingSenderId: "537930091559",
	appId: "1:537930091559:web:77b19f52b57ca356"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

class Firebase {
	static load(){
		
	}
	static signin(email, password){
		let self = this;
		firebase.auth().signInWithEmailAndPassword(email, password)
		.then(()=>{
			let user = firebase.auth().currentUser;
			console.log(user.uid);
			let msg = "ok"
			
		})
		.catch(function(error) {
			console.log(error)
		});		
	}

	static setData(){

	}
}

loadScript = function(filename, callback ){
	var arrScript = [];
	if( typeof filename == "string" )
		arrScript.push( filename );
	else
		arrScript = filename;

	function start( index ){
		if( index == arrScript.length ){
			if( callback ) callback({code: "ok"});
			return;
		} else if (arrScript[index].indexOf(".css") > 1){ //if filename is an external CSS file
			if(document.querySelector("link[href='" + arrScript[index] + "']") != null){
				start(index+1);
				return;
			}
			var fileref=document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", arrScript[index]);
			if(typeof fileref!="undefined")
				document.getElementsByTagName("head")[0].appendChild(fileref)

			start(index+1);
		} else if (arrScript[index].indexOf(".js") > 1){
			if(document.querySelector("script[src='" + arrScript[index] + "']") != null){ // 
				start(index+1);
				return;
			}
			var script   = document.createElement("script");
			script.type  = "text/javascript";
			script.src   = arrScript[index]; //filename;
			if(typeof script != "undefined"){
				script.onload = function(){
					start(index+1);
				};
				script.onerror = function(e){
					console.log(script.src);
					console.log(e);
					if( callback ) callback({src: script.src, code: "error"});
				}
				document.getElementsByTagName("head")[0].appendChild(script);
			} else
				start(index+1);
		} else
			start(index+1);
	}
	start(0);
}
/*


  
  setTimeout(()=>{
    // getData()
    setTimeout(()=>{
      // getData()
    }, 3000)
  }, 3000)

  function setData(params) {
    // vocabulary
    db.collection("vocabulary").doc("單字").set([
      {id: 1, name: "test1" },
      {id: 2, name: "test2" }
    ]);
  }
  
  function getData() {
    var docRef = db.collection("vocabulary").doc("單字");
    docRef.get().then(function(doc) {
        if (doc.exists) {
          console.log(doc.data());
        } else {
          console.log("找不到文件");
        }
      })
      .catch(function(error) {
        console.log("提取文件時出錯:", error);
      });
	}
*/