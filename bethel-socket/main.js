/*
  1.初始化
    client = new SocketClient('設定的clientId','連線socket主機','連線socket path',site) //clientId設定為null,會自動產生,並存在localStorage
    client.init() 
  2.接收socket訊息
    client.listen(function(response){
      // response.data 為接收到的資料
      data.type:事件類別
      data.state:所帶的socket資料
    })
  3.傳送socket訊息  
    client.send('接收者id','要傳送的資料') //接收者id為string,傳送資料可以是物件或字串
  4.設定clinetId
    client.setClientId('要設定的client id字串') //可以隨時改變clientId, 
*/
//var client = new SocketClient(null,'https://rd.jabezpos.com','/socket/socket.io','mmjd5566')
'use strict'
var client, from, sendTime;
new Vue({
  el:"#app",
  data:function(){
    return {
      clientId: "", //client.getClientId(),//自己的clientId
      receiveData:"",//接收到的socket 資料
      receiver:"", //接收者
      dataType:"", //要傳送的事件
      dataState:"", //要傳送的資料
      dataCode: "",
      ip: "",
      site: "",
      msg: [],
      connected: false
    }
  },
  mounted:function(){
    // 接收socket 資料
    var _this = this
    /*
    client.listen(function(response){
      console.log('socket response data')
      console.log(response)
      // 將接收到的資料轉為string顯示在網頁上
      _this.receiveData = JSON.stringify(response.data)
      // data.type="WebMenu.HaveNewOrder" 是新訂單訊息
      if(response.data.type=="WebMenu.HaveNewOrder"){
        alert('有新訂單！！')
      }
    })*/
    let ip = localStorage["ip"];
    if(typeof ip == "string") {
      this.ip = ip;
    } else {
      this.ip = 'http://rd.jabezpos.com:54321';
    }
    let site = localStorage["site"];
    if(typeof site == "string") {
      this.site = site;
    } else 
      this.site = 'BSMS000032';
    
    let to = localStorage["to"];
    if(typeof to == "string")
      this.receiver = to;
    
    let type = localStorage["type"];
    if(typeof type == "string")
        this.dataType = type;
    let code = localStorage["code"];
    if(typeof code == "string")
        this.dataCode = code;
    let state = localStorage["state"];
    if(typeof state == "string")
        this.dataState = state;
  },
  methods:{
    clickConnect(){
      let self = this;
      if(this.ip.length == 0 || this.site.length == 0){
        if(this.ip.length == 0)
          alert("請輸入 Server IP")
        else
          alert("請輸入 Site")
        return;
      } else {
        localStorage["site"] = this.site;
        localStorage["ip"] = this.ip
      }

      client = new SocketClient(null, this.ip, null, this.site);
      client.onConnect(function (params) {
        self.connected = true;
      })

      this.clientId = client.getClientId(),//自己的clientId
      client.init()
      client.listen(this.listen);
    },
    listen(response){
      if(typeof response.sendTime != "undefined"){
        if(response.sendTime == sendTime && response.from == from)
          return;
        from = response.from;
        sendTime = response.sendTime;
      }
      // console.log('socket response data')
      // console.log(response)
      // 將接收到的資料轉為string顯示在網頁上
      if(this.msg.length > 0) this.msg.unshift("-----------------------------------------")
      let s = "from: " + response.from + "\n" + "to: " + response.to + "\n" +
        (typeof response.token != "undefined" ? ("token: " + response.token + "\n") : "") +
        (typeof response.sendTime != "undefined" ? ("sendTime: " + response.sendTime + "\n") : "") +
        (typeof response.code == "string" && response.code.length > 0 ? ("code: " + response.code + "\n") : "") +
        JSON.stringify(response.data);
      this.msg.unshift(s)
      this.msg = this.msg.splice(0, 50);

      this.receiveData = this.msg.join("\n"); //JSON.stringify(response.data)
      // data.type="WebMenu.HaveNewOrder" 是新訂單訊息
      if(response.data.type=="WebMenu.HaveNewOrder"){
        alert('有新訂單！！')
      }
    },
    clickSendBtn:function(){
      // 傳送 socket資料 client.send('接收者id','要傳送的資料')
      let state = undefined;
      try {
        if(this.dataState.trim().length > 0){
          state = this.dataState.trim();
          if((state.indexOf("{") == 0 || state.indexOf("{") == 1)&& state.indexOf("}") > 1){
            state = JSON.parse(state);
          }
        }

        var data = {
          type: this.dataType, //事件類型
          state: state //傳送的內容
        }
        client.send(this.receiver, data, this.dataCode)
        localStorage["to"] = this.receiver;
        localStorage["type"] = this.dataType;
        localStorage["code"] = this.dataCode;
        localStorage["state"] = this.dataState;        
      } catch(e){
        console.log(e);
        alert("State 的 JSON 格式錯誤")
      }

    },
    clickClearBtn(){
      this.msg = [];
      this.receiveData = "";
    }
  },
  watch:{
    clientId:function(val,oldVal){
      // 可以隨時改變clientId, client.setClientId('要設定的client id字串')
      client.setClientId(val)
    }
  }
})
window.myClient = client