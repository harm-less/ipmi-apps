var meatballs	 = {}; 		// hash of meatballs
var TSPSConnection,
		camera,
		scene,
		container;

var material = new THREE.MeshPhongMaterial({
	map: new THREE.TextureLoader().load('meatball_texture.png'),
	normalMap: new THREE.TextureLoader().load('meatball_normal.png')
});

function init() {
	container = document.createElement('div');
	document.body.appendChild(container);
	mouse = document.createElement('div');
	// CONNECT TO TSPS WEBSOCKET SERVER
	TSPSConnection = new TSPS.Connection("192.168.1.241");
	// TSPSConnection = new TSPS.Connection();
	TSPSConnection.connect();

	// add listeners
	TSPSConnection.onPersonEntered 	= onPersonEntered.bind(this);
	TSPSConnection.onPersonLeft 	= onPersonLeft.bind(this);

	camera = new THREE.PerspectiveCamera( 40, 675 / 675 , 1, 10000 );
	camera.position.set( 0, 0, 700 );

	scene = new THREE.Scene();

	var loader = new THREE.TextureLoader()
	loader.load(
		'spaghetti.jpg',
		function (texture) {
			var material = new THREE.MeshBasicMaterial( {
				map: texture
			 } );

			var plane = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), material);
		 	plane.material.side = THREE.DoubleSide;
		 	plane.position.x = 0;
		 	plane.rotation.z = 0;
		 	scene.add(plane);
		}
	);

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(675, 675);
	container.appendChild(renderer.domElement);

	var mainLight = new THREE.PointLight( 0xFFFFFF, 1, 0 );
	mainLight.position.set( -670, -675, 200 );
	scene.add( mainLight );

	var backLight = new THREE.PointLight( 0xFFFFFF, 1, 0 );
	backLight.position.set( 650, 50, 50 );
	scene.add( backLight );

	var ambilent = new THREE.AmbientLight( 0x843200, 1, 0 );
	scene.add( ambilent );
}

function animate() {
	requestAnimationFrame(animate);

	for (var id in TSPSConnection.people){
		var person  = TSPSConnection.people[id];

		// Fetch new emiitter or create a new one
		var meatball 	= meatballs[id] || this.newMeatBall(id);

		var x = -( -250 + (person.boundingrect.x + person.boundingrect.width / 2) * 500);
		var y = -250 + (person.boundingrect.y + person.boundingrect.height) * 500;
		meatball.position.x = x;
		meatball.position.y = y;
		//
		// var normalizedVelocity = new THREE.Vector2(person.velocity.x, person.velocity.y);
		// normalizedVelocity.normalize();
		// meatball.position.x += normalizedVelocity.x;
		// meatball.position.y += normalizedVelocity.y;

		meatball.position.z = 30;
		meatball.rotation.x -= person.velocity.y / 200;
		meatball.rotation.y += person.velocity.x / 200;
		meatball.__dirtyPosition = true;
		meatball.__dirtyRotation = true;
	}
	render();
}

function render() {
	renderer.render(scene, camera);
}

function newMeatBall(id){
	var geometry = new THREE.SphereGeometry( 30, 64, 64 );
	meatballs[id] = new THREE.Mesh( geometry, material );

	scene.add( meatballs[id] );
	return meatballs[id];
}

function onPersonEntered(person){
	console.log('person entered');
};
function onPersonLeft(person){
	console.log('person left');
	scene.remove(meatballs[person.id]);
	delete meatballs[person.id];
};

	init();
	animate();
