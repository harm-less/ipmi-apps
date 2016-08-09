GameTSPS.prototype.follow = function(stageObj, offset){
  offset = offset || {x:0,y:0}

  this.onUpdate(function(data){
    createjs.Tween.get(stageObj, {override:true}).to(
      {
        x: ((1-data.boundingrect.x) - data.boundingrect.width/2) * $$gamesetup.gameWidth - offset.x,
        y: ((1-data.boundingrect.y) - data.boundingrect.height) * $$gamesetup.gameHeight - offset.y
      }, 100);
  });
}
