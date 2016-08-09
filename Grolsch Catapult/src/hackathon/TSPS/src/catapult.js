GameTSPS.prototype.catapult = function(person, onCompleteFunc) {

  return {
    velocity:0,
    angle:0,
    x: person.x,
    y: person.y,

    start: function(){
      game.tsps.onUpdate(this.update.bind(this))
    },

    update: function(data){

      //x: ((data.boundingrect.x) + data.boundingrect.width/2) * $$gamesetup.gameWidth - offset.x,
      //y: ((data.boundingrect.y) + data.boundingrect.height) * $$gamesetup.gameHeight - offset.y

      var lx = (person.x - data.boundingrect.x * $$gamesetup.gameWidth) + (data.boundingrect.width * $$gamesetup.gameWidth / 2)
      var ly = (person.y - data.boundingrect.y * $$gamesetup.gameHeight) + (data.boundingrect.height * $$gamesetup.gameHeight)
      var diagonal = Math.sqrt(Math.abs((lx*lx) + (ly*ly)))

      //console.log();
      this.angle = this.calcAngle($$gamesetup.gameWidth/2,0, person.x, person.y)-90;
      this.velocity = person.y;
    },

    stop: function(data){
      onCompleteFunc();
    },

    calcAngle: function (cx, cy, ex, ey) {
      var dy = ey - cy;
      var dx = ex - cx;
      var theta = Math.atan2(dy, dx); // range (-PI, PI]
      theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
      //if (theta < 0) theta = 360 + theta; // range [0, 360)
      return theta;
    }
  }
}
