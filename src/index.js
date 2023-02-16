import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let Clock = new THREE.Clock();

let camera, controls, scene, renderer;
camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000000);
camera.position.set(0, 100, 300);

const loader = new GLTFLoader();
let car
loader.load(
	// resource URL
	'../src/old_rusty_car/scene.gltf',
	// called when the resource is loaded
	function (gltf) {
		console.log(gltf);
		car = gltf.scene;
		car.scale.set(0.3, 0.3, 0.3)
		car.position.set(0, 0, 0)
		car.attach(camera)
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

// movement - please calibrate these values
var xSpeed = 30;
var ySpeed = 50;

let rotation = 0;
let camrotation = 0;

init();
animate();

function init() {

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xcccccc);
	// scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// camera.lookAt(car.position);

	scene.add(new THREE.AxesHelper(500000000));

	document.addEventListener("keydown", onDocumentKeyDown, false);
	function onDocumentKeyDown(event) {
		var keyCode = event.which;
		if (keyCode == 87) {
			car.translateZ(-ySpeed)
		} else if (keyCode == 83) {
			car.translateZ(ySpeed)
		}
		else if (keyCode == 68) {
			car.rotation.y -= 0.1;
			car.translateZ(-xSpeed * Math.cos(car.rotation.y));
			car.translateX(-xSpeed.Math.sin(car.rotation.y));
		}
		else if (keyCode == 65) {
			car.rotation.y += 0.1;
			car.translateZ(xSpeed.Math.cos(car.rotation.y));
			car.translateX(xSpeed.Math.sin(car.rotation.y));
		}
		else if (keyCode == 32) {
			car.position.set(0, 0, 0);
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

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
	Clock.start();
	requestAnimationFrame(animate);

	// controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
	console.log(Clock.elapsedTime)
	render();
}

function render() {

	renderer.render(scene, camera);

}