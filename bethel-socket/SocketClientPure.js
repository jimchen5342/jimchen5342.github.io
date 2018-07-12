'use strict'
/* data structure
from:
to:
time:
data:
*/
class SocketClient {
  static get author() {
    return 'ozzysun'
  }
  static get ver() {
    return '0.1.0'
  }
  static get ioVer() {
    return '2.0.3'
  }
  static get useTrace() {
    return false // 用來設定是否開啟trace功能
  }
  constructor(_clientId = null, socketURL, socketPath = null, room = 'all') {
    this.socketURL = socketURL
    this.socketPath = socketPath === null ? '/socket.io' : socketPath
    // if (ns === 'all' || ns === null) ns = '/'
    // if (ns.indexOf('/') === -1) ns = `/${ns}`
    // this.ns = ns // 連線name space 與socketPath不同
    this.ns = '/' // 連線name space 與socketPath不同 全部都用 /
    this.socket = null
    this.defaultChannel = room
    this.orderId = null
    // 斷線重新連線設定
    this.autoReconnect = true // 連線失敗是否自動重新連線
    this.reconnectDelay = 5000// 重新連線 delay ms
    this.reconnectAttemps = 20// 重新連線測試的次數
    this.nowReconnectAttemp = 0 // 目前已重新連線次數
    // this.nickName = null // 使用者暱稱, 用這來辨識同一桌的使用者
    this.isConnected = false
    this.cdn = {
      io: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.slim.js'
    }
    this.connectHandler = null // 建立連線時會被觸發的handler
    this.disconnectHandler = null // 中斷連線會被觸發的handler
    if (typeof this.constructor.name === 'undefined') {
      this.className = ''
    } else {
      this.className = this.constructor.name
    }
    if (_clientId === null) {
      if (this.getLocal('clientId') !== null) {
        this.setClientId(this.getLocal('clientId'))
      } else {
        this.setClientId()
      }
    } else {
      this.setClientId(_clientId)
    }
  }
  init(reconnectDelay = null, reconnectAttemps = null, callback = null) {
    if (reconnectDelay !== null) this.reconnectDelay = reconnectDelay
    if (reconnectAttemps !== null) this.reconnectAttemps = reconnectAttemps
    this.libReady(() => {
      this.ready(() => {
        if (callback !== null) callback()
      })
    })
  }
  setClientId(_clientId = null) {
    if (_clientId === null) _clientId = `client_${new Date().getTime()}`
    this.clientId = _clientId
    this.setLocal('clientId', this.clientId)
  }
  getClientId() {
    return this.clientId
  }
  setOrderId(orderId) {
    this.orderId = orderId
  }
  getOrderId() {
    return this.orderId
  }
  setNickNameId(_nickNameId = null) {
    if (_nickNameId === null) _nickNameId = `usr${new Date().getTime()}`
    this.setLocal('nickNameId', _nickNameId)
  }
  getNickNameId() {
    return this.getLocal('nickNameId')
  }
  // 提供 使用者接收socket訊息
  listen(callback = null) {
    const run = () => {
      this.socketHandler(callback)
      this.ioHandler()
    }
    const id = setInterval(() => {
      if (this.socket !== null) {
        clearInterval(id)
        run()
      }
    }, 200)
  }
  socketHandler(callback = null) {
    this.socket.on(this.defaultChannel, (response) => {
      const _from = response.from
      let _to = response.to
      // this.trace('Have Message obj!!')
      // this.trace(response)
      // _to 接收者 轉為array 可處理多接收者
      _to = _to.indexOf(',') !== -1 ? _to.split(', ') : [_to]
      // response.to = _to 先不改變原始source
      // 要檢查是否屬於這裡
      const checkTarget = [this.clientId, 'all']
      if (this.orderId !== null) checkTarget.push(this.orderId)

      for (let i = 0; i < _to.length; i++) {
        if (checkTarget.indexOf(_to[i]) !== -1 && (_to[i] !== 'all' || _from !== this.clientId)) {
          if (callback !== null) callback(response)
        }
      }
    })
    this.socket.on('disconnect', () => {
      this.trace('---------------Disconnect--')
      this.emit('NetStatus', 'Socket.DisConnect')
      if (this.disconnectHandler !== null) this.disconnectHandler()
    })
    this.socket.on('connecting', () => {
      this.trace('---------------Connecting---')
      this.emit('NetStatus', 'Socket.Connecting')
    })
    this.socket.on('connect', () => {
      this.trace('---------------Connect !!---')
      this.nowReconnectAttemp = 0
      this.isConnected = true
      this.emit('NetStatus', 'Socket.Connect', this.socket.id)
      if (this.connectHandler !== null) this.connectHandler()
    })
    this.socket.on('connect_error', () => {
      this.disconnect()
      this.isConnected = false
      this.trace('---------------Connection Failed---')
      this.emit('NetStatus', 'Socket.ConnectError')
      if (this.autoReconnect) {
        setTimeout(() => {
          if (this.nowReconnectAttemp < this.reconnectAttemps) {
            this.trace('do reconnect!!.......nowReconnectAttemp=' + this.nowReconnectAttemp)
            this.socket.open()
            this.nowReconnectAttemp++
          } else {
            this.trace('重新連線超過次數, 停止')
            this.nowReconnectAttemp = 0
            this.emit('NetStatus', 'Socket.ConnectFail')
          }
        }, this.reconnectDelay)
      }
    })
    this.socket.on('connect_timeout', () => {
      // this.trace('....is connect_timeout')
      this.trace('---------------Connection Timeout---')
      this.emit('NetStatus', 'Socket.TIME_OUT')
    })
    this.socket.on('reconnect', (ms) => {
      this.trace(`Socket reconnect=${ms}ms`)
    })
    this.socket.on('reconnecting', (ms) => {
      this.trace(`Socket reconnecting=${ms}ms`)
    })
    this.socket.on('reconnect_error', (obj) => {
      this.trace(`Socket reconnect error`)
      this.trace(obj)
    })
    this.socket.on('error', (error) => {
      this.emit('NetStatus', 'Socket.Error', error)
      this.trace(error)
    })
    this.socket.on('ping', () => {
      // this.trace('....is Ping')
      this.emit('NetStatus', 'Socket.Ping', this.socket.id)
    })
    this.socket.on('pong', (ms) => {
      this.emit('NetStatus', 'Socket.Pong', ms)
    })
  }
  ioHandler() {
  }
  // 提供使用者發送訊息 , _to 可以是 以, 隔開做多使用者廣播
  send(_to, __data) {
    const _sendData = {
      from: this.clientId,
      to: _to,
      time: new Date().getTime(),
      data: __data
    }
    if (this.socket !== null) {
      this.socket.emit(this.defaultChannel, _sendData)
    } else {
      this.trace('Warning!!socket not exist')
    }
  }
  connect(ns = '/', room = 'all') {
    console.log(`this.socketURL=${this.socketURL} this.socketPath=${this.socketPath} room=${room}`)
    const opts = {
      secure: this.socketURL.indexOf('https') !== -1,
      transports: ['polling', 'websocket'],
      autoConnect: true, // 斷線自動連線
      reconnection: true
    }
    if (this.socketPath !== null) opts.path = this.socketPath
    console.log(`connect=${this.socketURL} room=${room}`)
    if (room === 'all') {
      this.socket = window.io(`${this.socketURL}${this.ns}?author=ozzysun`, opts)
    } else {
      this.socket = window.io(`${this.socketURL}${this.ns}?author=ozzysun&room=${room}`, opts)
    }
    this.socket.on('connect', () => {
      if (this.connectHandler !== null) this.connectHandler()
    })
    setTimeout(() => {
      this.trace(`.......socket id=${this.socket.id}`)
    }, 500)
  }
  disconnect() {
    if (this.socket !== null) this.socket.disconnect()
  }
  reconnect() {
    this.socket.open()
  }
  onConnect(connectHandler) {
    this.connectHandler = connectHandler
  }
  onDisconnect(disconnectHandler) {
    this.disconnectHandler = disconnectHandler
  }
  // - utils --
  ready(callback = null) {
    const _checkid = setInterval(() => {
      this.connect(this.ns, this.defaultChannel)
      if (callback !== null) callback()
      clearInterval(_checkid)
      this.trace('New SocketClient ready')
    }, 1000)
  }
  libReady(callback) {
    if (window.io !== undefined) {
      this.trace('io already exist')
      callback()
    } else {
      this.trace('start load io lib.......')
      this.loadScript(this.cdn.io, callback)
    }
  }
  // --Load External Script --
  loadScript(url, callback = null, _id = null) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.setAttribute('defer', 'defer')
    if (_id !== null) script.id = `jss_${_id}`
    if (script.readyState) { // IE
      script.onreadystatechange = () => {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null
          this.trace(`load url=${url} success`)
          if (callback !== null) callback()
        }
      }
    } else { // Others
      script.onload = () => {
        if (callback !== null) callback()
      }
    }
    script.src = url
    document.getElementsByTagName('head')[0].appendChild(script)
  }
  setLocal(key, value) {
    localStorage.setItem(key, value);
  }
  getLocal(key){
    return localStorage.getItem(key)
  }
  trace(info) {
    console.log(info)
  }
  emit(...args) {
    // emit 給其他物件接收 這部分尚未實作
  }
}
window.SocketClient = SocketClient
// 當 module import使用 則改用 以下
// export default SocketClient