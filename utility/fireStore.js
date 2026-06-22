
	// https://firebase.google.com/docs/firestore/quickstart?authuser=1
	// https://www.oxxostudio.tw/articles/201905/firebase-firestore.html
  // https://t.codebug.vip/questions-1920875.htm
  class FireStore{
    static db;
    static login = false;
  
    static initial(key){
      var firebaseConfig = {
        // 在後台名稱 jimc052，
        apiKey: "AIzaSyDo4JUSUpPqQhdZ17o1ULvhI5FeC9AqziA",
        authDomain: "project-1879557896342808990.firebaseapp.com",
        databaseURL: "https://project-1879557896342808990.firebaseio.com",
        projectId: "project-1879557896342808990",
        appId: "1:146765116801:web:e6f947c7134226947b6480"
      };

      firebase.initializeApp(firebaseConfig);
      this.db = firebase.firestore();
    }
    static mail(){
      return firebase.auth().currentUser.email;
    }
    static uid(){
      return firebase.auth().currentUser.uid;
    }
    static async signIn(email, password){
      try {
        let result = await firebase.auth().signInWithEmailAndPassword(email, password);
        FireStore.login = true;
        // console.log(result)
        return result;
      } catch(e) {
        throw e;
      }
    }

    static async update(json){
      let date = (new Date()).getTime(); // /" + report
      let ref = this.db.collection("VOA").doc("" + json.key);
      json.modifyDate = date;
      let obj = Object.assign({}, json);
      delete obj.key;
      try {
        let x = await ref.set(obj);
      } catch(e) {
        throw e;
      }
    }
    static async delete(tblName, PK){
      let ref = this.db.collection(tblName).doc("" + PK);
      try {
        let x = await ref.delete();
      } catch(e) {
        throw e;
      }
    }

    static async getSetting(key){ // 沒有用到，2026-06-22
			try {
				let snapshot1 = await FireStore.db.collection("users").doc(FireStore.uid())
					.collection("setting").doc(key)
          .get();
        return snapshot1.data();
      } catch(e) {
        // console.log(e)
        // vm.showMessage(typeof e == "object" ? JSON.stringify(e) : e);
      }
    }
    static async setSetting(key, json){ // 沒有用到，2026-06-22
      let ref = FireStore.db.collection("users").doc(FireStore.uid())
        .collection("setting").doc(key);
      try {
        let x = await ref.set(json,{merge: true});
      } catch(e) {
        console.log(e)
        throw e;
      }
    }
  }