init();
animate();

var meatball,
		TSPSConnection,
		camera,
		scene,
		test,
		container;

function init() {
	container = document.createElement('div');
	document.body.appendChild(container);
	// CONNECT TO TSPS WEBSOCKET SERVER
	// TSPSConnection = new TSPS.Connection("192.168.1.191", 7681);
	TSPSConnection = new TSPS.Connection('192.168.1.241');
	TSPSConnection.connect();

	// add listeners
	TSPSConnection.onPersonEntered 	= onPersonEntered.bind(this);
	TSPSConnection.onPersonLeft 	= onPersonLeft.bind(this);

	camera = new THREE.PerspectiveCamera( 40, 675 / 675 , 1, 10000 );
	camera.position.set( 0, 0, 700 );

	scene = new THREE.Scene();

	var plane = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load('spaghetti.jpg')
		})
	);

	plane.material.side = THREE.DoubleSide;
	plane.position.x = 0;
	plane.rotation.z = Math.PI;
	scene.add(plane);

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(675, 675);
	container.appendChild(renderer.domElement);

	// Lights
	var mainLight = new THREE.PointLight( 0xFFFFFF, 1, 0 );
	mainLight.position.set( -670, -675, 200 );
	scene.add( mainLight );

	var backLight = new THREE.PointLight( 0xFFFFFF, 1, 0 );
	backLight.position.set( 650, 50, 50 );
	scene.add( backLight );

	var ambilent = new THREE.AmbientLight( 0x843200, 1, 0 );
	scene.add( ambilent );

	// The meathball
	var geometry = new THREE.SphereGeometry( 30, 64, 64 );
	var material = new THREE.MeshPhongMaterial({
		map: new THREE.TextureLoader().load('meatball_texture.png'),
		normalMap: new THREE.TextureLoader().load('meatball_normal.png')
	});
	meatball = new THREE.Mesh( geometry, material );
	scene.add( meatball );

	// Test sphere represeting the person
	var testgeo = new THREE.SphereGeometry( 10, 8, 8 );
	test = new THREE.Mesh( testgeo );
	scene.add( test );
}

function animate() {

		requestAnimationFrame(animate);

		for (var id in TSPSConnection.people){
			var person  = TSPSConnection.people[id];


			var x = -( -250 + (person.boundingrect.x + person.boundingrect.width / 2) * 500);
			var y = -250 + (person.boundingrect.y + person.boundingrect.height) * 500;

			var normalizedVelocity = new THREE.Vector2(person.velocity.x, person.velocity.y);
			normalizedVelocity.normalize();

			test.position.x = x;
			test.position.y = y;

			personVector = new THREE.Vector3(x, y, 0);
			var distance = meatball.position.distanceTo(personVector);
			if(distance && distance < 50){
				// hit
				meatball.position.x -= normalizedVelocity.x;
 				meatball.position.y += normalizedVelocity.y;
				meatball.rotation.x -= normalizedVelocity.y / 10;
				meatball.rotation.y -= normalizedVelocity.x / 10;

				if(meatball.position.x > 200){
					meatball.position.x = 200;
				}
				if(meatball.position.x < -200){
					meatball.position.x = -200;
				}
				if(meatball.position.y > 200){
					meatball.position.y = 200;
				}
				if(meatball.position.y < -200){
					meatball.position.y = -200;
				}
			}
			meatball.__dirtyPosition = true;
		}

		render();
	}

	function render() {
		renderer.render(scene, camera);
	}

	function onPersonEntered(person){
		console.log('person entered');
	};
	function onPersonLeft(person){
		console.log('person left');
	};
