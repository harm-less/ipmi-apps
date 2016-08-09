var game = new Game();
var initGame = game.init.bind(game);
var socket = game.websocket("192.168.1.130", "1337", "catapult");

socket.connect();

$(document).ready( function() {
  var persons = [];
  var person;

  var catapult = false;
  var shootTimeOutMilli = 5000;
  var shootTimeOut = false;
  var is_shooting = false;

  var string_left = new createjs.Shape();
  var string_right = new createjs.Shape();

  var pin_left = new createjs.Bitmap("assets/images/pin.png");
  pin_left.scaleX = pin_left.scaleY = 0.5;
  pin_left.scaleX *= -1;
  pin_left.x = 33;
  pin_left.y = $$gamesetup.gameHeight/2 - 200;

  var pin_right = new createjs.Bitmap("assets/images/pin.png");
  pin_right.scaleX = pin_right.scaleY = 0.5;
  pin_right.x = $$gamesetup.gameWidth - 33;
  pin_right.y = $$gamesetup.gameHeight/2 - 200;

  var dop = new createjs.Bitmap("assets/images/kroon.png");
  dop.scaleX = dop.scaleY = 0.5;
  dop.regY = 183;

  var dopHolder = new createjs.Bitmap("assets/images/houder.png");
  dopHolder.scaleX = dopHolder.scaleY = 0.5;

  //add bottom screen visuals to stage
  game.stage.addChild(string_left);
  game.stage.addChild(string_right);
  game.stage.addChild(pin_left);
  game.stage.addChild(pin_right);
  game.stage.addChild(dop);
  game.stage.addChild(dopHolder);

  game.tsps.onEnter(function(data){
    var circle = new createjs.Shape();
    circle.graphics.beginFill("#ccc").drawCircle(0, 0, 20);
    game.stage.addChild(circle);

    game.tsps.follow(circle, {x:0, y:0});
    persons[data.id] = (circle);
  })

  game.tsps.onLeave(function(data){
    game.stage.removeChild(persons[data.id]);
    persons.splice(data.id, 1);
  })

  var personShape = new createjs.Shape();
  personShape.graphics.beginFill("green").drawCircle(0, 0, 50);

  game.stage.addEventListener("stagemousemove", function(evt){

    personShape.x = evt.stageX;
    personShape.y = evt.stageY;

  });

  $("#gameCanvas").on("mouseenter", function(){
    game.stage.addChild(personShape);
    persons[0] = personShape;
  });

  $("#gameCanvas").on("mouseout", function(){
    game.stage.removeChild(personShape);
    persons.splice(0, 1);
  });

  shootTimeOut = setInterval(function(){
    is_shooting = true;
    if (!person) return;
    createjs.Tween.get(dopHolder, {override:true}).to(
      {
        x: $$gamesetup.gameWidth/2 - dopHolder.getBounds().width/4 ,
        y: 200
      },  1500 - (person.y-300) * 1.5,
      createjs.Ease.elasticOut)

    createjs.Tween.get(dop, {override:true}).to(
      {
        x: ($$gamesetup.gameWidth - person.x) ,
        y: 0
      },  700 - (person.y-300) * 1.5)
      .call(function(){
      socket.sendJson({
        type: "shot",
        velocity: person.y,
        shotX: ($$gamesetup.gameWidth - person.x)
      });
    });

    setTimeout(function(){
      is_shooting = false;
    }, 1200)
  }, 6000)

  game.update = function(){
    for (var firstKey in persons) break;
    person = persons[firstKey];

    if(person){

      if(!catapult){
        catapult = game.tsps.catapult(person, function(){
          alert('Shoot!');
        });
        catapult.start();
      }

      if(!is_shooting) {
        dopHolder.x = person.x - dopHolder.getBounds().width/4;
        dopHolder.y = person.y - 75;

        dop.x = person.x - dop.getBounds().width/4;
        dop.y = dopHolder.y+20;

        socket.sendJson({
          type: "aim",
          crosshairX: person.x,
          crosshairY: person.y
        });
      }

      string_left.graphics.clear();
      string_left.graphics.setStrokeStyle(5);
      string_left.graphics.beginStroke("#4EA334");
      string_left.graphics.moveTo(30, $$gamesetup.gameHeight/2-165);
      string_left.graphics.lineTo(dopHolder.x+5, dopHolder.y+5);
      string_left.graphics.endStroke();

      string_right.graphics.clear();
      string_right.graphics.setStrokeStyle(5);
      string_right.graphics.beginStroke("#4EA334");
      string_right.graphics.moveTo($$gamesetup.gameWidth-30, $$gamesetup.gameHeight/2-165);
      string_right.graphics.lineTo(dopHolder.x-5+dopHolder.getBounds().width/2, dopHolder.y+5);
      string_right.graphics.endStroke();

    }else{
      catapult = false;
    }
  }

})
