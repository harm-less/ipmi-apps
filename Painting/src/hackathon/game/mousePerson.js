Game.prototype.fakePerson = function(){
  this.fakeperson = new createjs.Shape();
   this.fakeperson.graphics.beginFill("green").drawCircle(0,0, 50);
  game.stage.addChild( this.fakeperson);


  game.stage.addEventListener("stagemousemove", function(evt){
     this.fakeperson.x = evt.stageX;
     this.fakeperson.y = evt.stageY;
  });

  $("#gameCanvas").on("mouseenter", function(){
    game.stage.addChild( this.fakeperson);
  });
  $("#gameCanvas").on("mouseout", function(){
    game.stage.removeChild( this.fakeperson);
  });
}
