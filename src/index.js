import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let Clock = new THREE.Clock();

let isPOV = 0;

let camera, controls, scene, renderer;
let bird_eye_renderer;
let bird_eye;

const frustumSize = 5000;

camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000000);
camera.position.set(0, 50, 150);

const aspect = window.innerWidth / window.innerHeight;
bird_eye = new THREE.OrthographicCamera( frustumSize * aspect / - 8, frustumSize * aspect / 8, frustumSize / 8, frustumSize / - 8, 1, 1000 );
bird_eye.position.set(0, 200, 0);
bird_eye.zoom = 6

let speed = 0;
let rotation_ticks = 0;

const loader = new GLTFLoader();
let car
loader.load(
	// resource URL
	'../src/old_rusty_car/scene.gltf',
	// called when the resource is loaded
	function (gltf) {
		console.log(gltf);
		car = gltf.scene;
		car.scale.set(0.1, 0.1, 0.1)
		car.position.set(0, 0, 0)
		car.rotation.y = 3.14
		car.attach(camera)
		car.attach(bird_eye)
		scene.add(car);
	},
	// called while loading is progressing
	function (xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	},
	// called when loading has errors
	function (error) {
		console.log('An error happened');
	}
);


let stadium
loader.load(
	// resource URL
	'../src/Race_Track/scene.gltf',
	// called when the resource is loaded
	function (gltf) {
		console.log(gltf);
		stadium = gltf.scene;
		stadium.scale.set(2000, 2000, 2000)
		stadium.position.set(0, -10, 0)
		stadium.rotation.y = 1.40
		scene.add(stadium);
	},
	// called while loading is progressing
	function (xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	},
	// called when loading has errors
	function (error) {
		console.log('An error happened');
	}
);

let startingLine;
loader.load(
	// resource URL
	'../src/starting_line/scene.gltf',
	// called when the resource is loaded
	function (gltf) {
		console.log(gltf);
		startingLine = gltf.scene;
		startingLine.scale.set(1.5, 1.5, 1.5)
		startingLine.position.set(-2.5, 0, 0)
		scene.add(startingLine);
	},
	// called while loading is progressing
	function (xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	},
	// called when loading has errors
	function (error) {
		console.log('An error happened');
	}
)

for (let i = 0; i < 10; i++) {
	loader.load(
		// resource URL
		'../src/Crowd/scene.gltf',
		// called when the resource is loaded
		function (gltf) {
			console.log(gltf);
			people[i] = gltf.scene;
			people[i].scale.set(60, 60, 60)
			people[i].position.set(-600, -i * 200, 0)
			people[i].rotation.y = 1.40
			scene.add(people[i]);
		},
		// called while loading is progressing
		function (xhr) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		// called when loading has errors
		function (error) {
			console.log('An error happened');
		}
	)
}

init();
animate();

function init() {

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xcccccc);
	// scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.querySelector(".Main").appendChild(renderer.domElement);

	bird_eye_renderer = new THREE.WebGLRenderer({ antialias: true });
	bird_eye_renderer.setPixelRatio(window.devicePixelRatio);
	bird_eye_renderer.setSize(300, 200);
	document.querySelector(".Sub").appendChild(bird_eye_renderer.domElement);
	// document.querySelector("#bird_eye").appendChild(bird_eye_renderer.domElement);


	// bird_eye.lookAt(car.position.x, car.position.y, car.positon.z);
	bird_eye.lookAt(0, 0, 0)

	scene.add(new THREE.AxesHelper(500000000));

	document.addEventListener("keydown", onDocumentKeyDown, false);
	function onDocumentKeyDown(event) {
		var keyCode = event.which;
		if (keyCode == 87) {
			if (speed < 2.5) {
				speed += 0.04;
			}
		} else if (keyCode == 83) {
			if (speed > -2.5) {
				speed -= 0.04;
			}
		}
		else if (keyCode == 68) {
			rotation_ticks -= 5;
		}
		else if (keyCode == 65) {
			rotation_ticks += 5;
		}
		else if (keyCode == 32) {
			console.log(camera.position);
			if (isPOV == 0) {
				camera.position.x -= 0;
				camera.position.y -= 450;
				camera.position.z += 1800;
				console.log(camera.position);
				isPOV = 1;
			} else {
				camera.position.x -= 0;
				camera.position.y += 450;
				camera.position.z -= 1800;
				console.log(camera.position);
				isPOV = 0;
			}
		}
	};


	//Lights

	const dirLight1 = new THREE.DirectionalLight(0xffffff);
	dirLight1.position.set(1, 1, 1);
	scene.add(dirLight1);

	const dirLight2 = new THREE.DirectionalLight(0x002288);
	dirLight2.position.set(- 1, - 1, - 1);
	scene.add(dirLight2);

	const ambientLight = new THREE.AmbientLight(0x222222);
	scene.add(ambientLight);

	//

	window.addEventListener('resize', onWindowResize);

}

function turn_car() {
	if (rotation_ticks > 2) {
		rotation_ticks -= 2;
		console.log(rotation_ticks);
		car.rotation.y += 0.01;
	}
	if (rotation_ticks < -2) {
		rotation_ticks += 2;
		console.log(rotation_ticks);
		car.rotation.y -= 0.01;
	}
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
	bird_eye_renderer.setSize(window.innerWidth/2, window.innerHeight/2);
}

function animate() {
	Clock.start();
	requestAnimationFrame(animate);

	// controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
	// console.log(Clock.elapsedTime)
	car.translateZ(0.4);
	car.translateZ(speed);
	turn_car();
	render();
}

function render() {
	renderer.render(scene, camera);
	bird_eye_renderer.render(scene, bird_eye);
}