var Game = function(){
  this.tsps = new GameTSPS();
  this.stage = this.tsps.stage = new createjs.Stage("gameCanvas");

  this.properties = {};

  this.init =  function(){
    createjs.Ticker.setFPS(60);
    createjs.Ticker.on("tick", this.ontick.bind(this));
    this.tsps.connection.connect();
  }

  this.ontick = function(event){
    this.stage.update(event);
    if (this.update) this.update();
  }

  this.get = function(prop){
    return this.properties[prop];
  }

  this.set = function(prop, value){
    return this.properties[prop] = value;
  }
}
