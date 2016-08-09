var game = new Game();
var initGame = game.init.bind(game);


$(document).ready( function() {

  var persons = [];


  game.tsps.onEnter(function(data){
    var circle = new createjs.Shape();
    circle.graphics.beginFill("#ccc").drawCircle(0, 0, 1);
    game.stage.addChild(circle);

    game.tsps.draw(circle, {x:0, y:0});
    persons[data.id] = (circle);
  })

  game.tsps.onLeave(function(data){
    game.stage.removeChild(persons[data.id]);
    persons.splice(data.id, 1);
  })

  game.update = function(){

  }
})
