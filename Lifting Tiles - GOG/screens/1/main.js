/* global THREE, Track, scene, camera, renderer, stats, tsps */
"use strict";
(function() {
  var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.75 );
  scene.add( ambientLight );

  var blockwidth = 1;
  var blockheight = 1;

  var light = new THREE.DirectionalLight( 0xdddddd, 0.5, 0 );
  light.position.set( 100, 100, 50 );
  // light.castShadow = true;
  light.shadow.camera.left = -2;
  light.shadow.camera.right = 2;
  light.shadow.camera.top = 2;
  light.shadow.camera.bottom = -2;
  light.shadow.mapSize.width = 1024; // default is 512
  light.shadow.mapSize.height = 1024; // default is 512
  scene.add( light );

  // camera.position.y = -70;
  camera.position.z = 7.5;
  camera.lookAt(scene.position);

  var cubes = [];
  var loader = new THREE.TextureLoader();
  var texture = loader.load('textures/sandstone2.png');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
  texture.repeat.set(2, 1);

  var floorTexture = loader.load("textures/dirt.jpg");

  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
  floorTexture.repeat.set(20, 20);

  var floorGeometry = new THREE.PlaneGeometry(blockwidth*10, blockheight*10, 1),
      floorMaterial = new THREE.MeshPhongMaterial({
        map: floorTexture,
        color: 0x333,
        shininess: 0,
        // bumpMap: floorTexture,
        bumpScale: 1
      }),
      floor = new THREE.Mesh(floorGeometry, floorMaterial);

  // scene.add(floor);

  var logos = [
    loader.load('textures/gog.png')
  ];
  for (var i = 0; i < logos.length; i++) {
    // logos[i].wrapS = logos[i].wrapT = THREE.RepeatWrapping; 
    logos[i].repeat.set(1, 1);
    // logos[i].offset.x = -0.4;
  }

  function generateCubes() {
    for (var i = 0; i < 100; i++) {
      var geometry, material, cube;
      geometry = new THREE.CubeGeometry( blockwidth, blockheight, 0.1 );

      var cubeTextures = {
        bk: logos[Math.round(Math.random()*(logos.length-1))],
        dn: texture,
        ft: texture,//logos[Math.round(Math.random()*(logos.length-1))],
        lf: texture,
        rt: texture,
        up: texture,
      };
      var directions = ["lf", "rt", "up", "dn", "ft", "bk"],
          faceMaterials = [];

      for (var j = 0; j < 6; j++) {
        faceMaterials.push(new THREE.MeshPhongMaterial(
          {
            map: cubeTextures[directions[j]],
            side: THREE.DoubleSide
          }
        ));
      }      
      material = new THREE.MeshFaceMaterial(faceMaterials);
      // material = new THREE.MeshPhongMaterial({
      //   // color: 0x990000,
      //   map: texture,
      //   bumpMap: texture,
      //   bumpScale: 3
      //   // side: THREE.DoubleSide
      // });
      cube = new THREE.Mesh( geometry, material );

      var xOffset = (((i%10)*blockheight)-(blockheight*4.5)),
          yOffset = -((Math.floor(i/10)*blockwidth)-(blockwidth*4.5));
      cube.position.set(xOffset, yOffset, 0);
      // cube.rotation.z = Math.PI;
      // cube.castShadow = true;
      // cube.receiveShadow = true;
      scene.add(cube);
      cubes.push(cube);

      cube.frame = null;
      cube.animate = false;
      cube.stopAnimate = false;
      cube.animator = function() {
        if (this.frame === null && this.animate) this.frame = 0;

        if (this.frame !== null) {
          if (this.animate) {
            if (this.frame < 50) {
              this.position.z = this.frame/100;
              this.frame+=10;
            } else {
              if ((this.frame-50)%200 <= 50 || (this.frame-50)%200 >= 150) {         
                this.rotation.x = Math.PI*((this.frame-50)/50);
              } else {
                // this.rotation.x = Math.PI*((this.frame-50)/200);
              }
              this.frame++;
            }
            
            if (this.stopAnimate && (this.frame-50)%200 == 0 && this.frame > 50) {
              this.animate = false;
              this.rotation.x = 0;
            }
          }
          if(this.stopAnimate && !this.animate && (this.frame-50)%200 <= 50) {
            this.position.z = .5-(((this.frame-50) % 200)/100)
            this.frame+=10;
          } else if (this.stopAnimate && !this.animate) {
            this.frame = null;
          }
        }
      };
    }
  }

  var spheres = [];
  for (var i = 0; i < 50; i++) {
    var geometry = new THREE.SphereGeometry( 3, 10, 10 );
    var material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(Math.random(), Math.random(), Math.random()),
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    });
    var sphere = new THREE.Mesh( geometry, material );
    // scene.add( sphere );
    spheres.push(sphere);
    sphere.position.x = 1000;
    sphere.position.y = 1000;
    sphere.position.z = 10;
    geometry.castShadow = true;
}

  generateCubes();
  tsps.onMessageReceived = function(data) {
    var activeCubes = [];

    var counter = 0;

    for (var i = 0; i < spheres.length; i++) {
      spheres[i].position.x = 1000;
      spheres[i].position.y = 1000;
    }

    for (var id in tsps.people) {
      var person = tsps.people[id];
      var personXRaw = person.boundingrect.x + person.boundingrect.width/2;
      var personYRaw = person.boundingrect.y + person.boundingrect.height;

      var targetCubes = predictCubes(personXRaw, personYRaw, person.velocity);

      for (var i = 0; i < targetCubes.length; i++) {
        targetCubes[i].animate = true;
        targetCubes[i].stopAnimate = false;

        var sphere = spheres[counter++];
        sphere.position.x = targetCubes[i].position.x;
        sphere.position.y = targetCubes[i].position.y;
        sphere.position.z = 7.5;

        if (i == 0) {
          sphere.material.color = new THREE.Color(1, 0, 0);
          sphere.scale.set(1, 1, 1);
        } else {
          sphere.material.color = new THREE.Color(0, 3, 0);
          sphere.scale.set(0.5, 0.5, 0.5);
        }
      }

      // var personX = (-5*blockwidth)+(personXRaw*blockwidth*10);
      // var personY = (5*blockheight)+(personYRaw*blockheight*-10);
    }

    for (var i = 0; i < cubes.length; i++) {
      cubes[i].stopAnimate = true;
    }

    // if (data.type == "scene") {
    //   for (var i = 0; i < data.grid.length; i++) {
    //     if (data.grid[i] == 1) {
    //       // cubes[i].position.z = -5;
    //       cubes[i].animate = true;
    //       cubes[i].stopAnimate = false;
    //     } else {
    //       // cubes[i].position.z = 0;
    //       cubes[i].stopAnimate = true;
    //     }
    //   }
    // }
  };

  function predictCubes(personXRaw, personYRaw, velocity) {
    var targets = [];

    if (velocity.x < 0.5 && velocity.y < 0.5) {
      velocity.x = 0;
      velocity.y = 0;
    }

    for (var i = 0; i < 3; i++) {
      velocity = new THREE.Vector2(velocity.x, velocity.y);
      velocity.normalize();

      var veloX = velocity.x/7.5*i;
      var veloY = velocity.y/7.5*i;
      var personX = (-5*blockwidth)+((personXRaw+veloX)*blockwidth*10);
      var personY = (5*blockheight)+((personYRaw+veloY)*blockheight*-10);
      var col = Math.floor(personX/blockwidth)+5;
      var row = 10-(Math.floor(personY/blockheight)+5);
      var cube = row*10+col;
      if (cubes[cube]) targets.push(cubes[cube])
    }

    return targets;
  }

  var globalframe = 0;
  function render() {
    stats.begin();

    var randomcube = Math.round(Math.random()*99);
    if (globalframe%300 == 0 && !cubes[randomcube].animate) cubes[randomcube].animate = true;
    for (var i = 0; i < cubes.length; i++) {
      cubes[i].animator();
    }
    if (globalframe%300 == 0 && !cubes[randomcube].animate) cubes[randomcube].stopAnimate = true;

    globalframe++;

    renderer.render(scene, camera);
    stats.end();
    requestAnimationFrame(render);
  }  
  render();
})();