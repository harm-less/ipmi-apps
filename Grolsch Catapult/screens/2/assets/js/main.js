var game = new Game();
var initGame = game.init.bind(game);
var socket = game.websocket("192.168.1.130", "1337", "catapult");

var monstersHit = 0;

for (var i=0; i < 5; i++){
  var bottle = new createjs.Bitmap("assets/images/beugel.png");
  //bottle.scaleX = bottle.scaleY = 0.5;
  bottle.x = 230 * i + 100;
  bottle.y=180;
  game.stage.addChild(bottle);
}

var mon1 = new createjs.Bitmap("assets/images/monster01.png");
//bottle.scaleX = bottle.scaleY = 0.5;
mon1.x = 100;
mon1.y=470;
game.stage.addChild(mon1);

var mon2 = new createjs.Bitmap("assets/images/monster02.png");
mon2.scaleX = mon2.scaleY = 0.85;
mon2.x = 430;
mon2.y=330;
game.stage.addChild(mon2);

var mon3 = new createjs.Bitmap("assets/images/monster03.png");
mon3.scaleX = mon3.scaleY = 0.5;
mon3.x = 540;
mon3.y=60;
game.stage.addChild(mon3);

var mon4 = new createjs.Bitmap("assets/images/monster04.png");
//bottle.scaleX = bottle.scaleY = 0.5;
mon4.x = 760;
mon4.y=480;
game.stage.addChild(mon4);

var mon5 = new createjs.Bitmap("assets/images/monster05.png");
mon5.scaleX = mon5.scaleY = 0.8;
mon5.x = 1000;
mon5.y=140;
game.stage.addChild(mon5);

var monsters = [mon1, mon2, mon3, mon4, mon5];

var crosshair = new createjs.Bitmap("assets/images/crossfire.png");
crosshair.scaleX = crosshair.scaleY = 0.5;
game.stage.addChild(crosshair);

socket.listen = function(event){

  var data = JSON.parse(event.data);

  if (data.type == "shot"){
    var velocity = $$gamesetup.gameHeight - ((data.velocity-100)/675) * $$gamesetup.gameHeight;
    game.set('velocity', velocity);
    game.set('shotX', data.shotX);
    initShotFired();
  }

  if (data.type == "aim"){
    crosshair.x = $$gamesetup.gameWidth - (data.crosshairX/675) * $$gamesetup.gameWidth
    crosshair.y = $$gamesetup.gameHeight - (data.crosshairY/475) * $$gamesetup.gameHeight + 400
  }

};

socket.connect();

var initShotFired = function() {
  var shot = new createjs.Shape();
  shot.graphics.beginFill("green").drawCircle(0, 0, 50);

  shot.x = (game.get("shotX")/675) * $$gamesetup.gameWidth + crosshair.getBounds().width/4;;
  shot.y = crosshair.y + crosshair.getBounds().height/4;

  var monster = isMonster(shot);

  if (monster){
    monstersHit += 1
    createjs.Tween.get(monster, {override:true}).to(
      {
        y: monster.y + 500,
        alpha: 0
      }, 500, createjs.Ease.elasticIn);

    if(monstersHit == 5){

      setTimeout(function(){
        mon1.y=470;
        mon1.alpha = 1;
        mon2.y=330;
        mon2.alpha = 1;
        mon3.y=60;
        mon3.alpha = 1;
        mon4.y=480;
        mon4.alpha = 1;
        mon5.y=140;
        mon5.alpha = 1;
      }, 2000)

      monstersHit = 0;
    }

  }

  createjs.Tween.get(shot, {override:true}).to(
    {
      y: shot.y + 100,
      alpha: 0
    }, 500);

  game.stage.addChild(shot);
}

var isMonster = function(shot){
  var monsterHit = false
  $.each(monsters, function(i, monster){
    var x1 = monster.x
    var x2 = monster.x + monster.getBounds().width;
    var y1 = monster.y
    var y2 = monster.y + monster.getBounds().height;

    if(shot.x > x1 && shot.x < x2){
      if (shot.y > y1 && shot.y < y2 ){
        monsterHit = monster;
      }
    }
  });

  return monsterHit;
}
