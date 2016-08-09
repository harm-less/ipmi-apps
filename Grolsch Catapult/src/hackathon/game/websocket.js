Game.prototype.websocket = function(ip, port, id){
  id = id || "";

  return {
    connected: false,
    socket: false,

    connect: function(){
      this.socket = new WebSocket('ws://' + ip + ':'+ port +'/' + id);

      console.log('connecting to game socket: ' + 'ws://' + ip + ':'+ port +'/' + id)

      this.socket.onopen = function(event) {
        this.connected = true;
        console.log('connected to game socket: ' + 'ws://' + ip + ':'+ port +'/' + id)
      }.bind(this);

      this.socket.onmessage = this.listen;
    },

    listen:function(event){
      console.log(JSON.parse(event.data));
    },

    sendJson:function(data) {
      if(this.connected) {
        var jsonStr = JSON.stringify(data)
        this.socket.send(jsonStr);
      }
    },
  }
}
