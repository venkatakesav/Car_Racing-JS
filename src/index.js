import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

let Clock = new THREE.Clock();
Clock.start();

let Health = 0; // Health of the player
let Fuel = 0; // Fuel of the player
let Score = 0; // Score of the player

let isPOV = 0;

let camera, controls, scene, renderer;
let can;
let bird_eye_renderer;
let bird_eye;

const frustumSize = 5000;

camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000000);
camera.position.set(0, 50, 150);


let FuelTank = [
	[60.873041091420454, 0, - 1907.8854737263919],
	[-367.24245420600977, 0, -2479.427586682133],
	[48.04237154649154, 0, -3960.8580737403377],
	[68.4901351607058, 0, -3977.366476545493],
	[1501.9237979593831, 0, -4371.767757269876],
	[2318.7470423741443, 0, -3421.260484062915],
	[2153.0845236944206, 0, -1981.6720136944612],
	[2101.050292229666, 0, -1579.1611450185273],
	[2063.647410184328, 0, -1268.9680148323496],
	[1963.2397168090085, 0, -857.6213133604109],
	[1307.8585129482951, 0, -836.6381164751313],
	[1451.344748425768, 0, -1400.8169789500128],
	[1485.557223662956, 0, -1896.250291175657],
	[1550.2080834626845, 0, -2370.038995919365],
	[1635.3288599596915, 0, -2801.1891534655465],
	[1635.0528922365513, 0, -3162.0292181915484],
	[1336.843375729829, 0, -3797.833110100884],
	[1319.5077502231175, 0, -3800.3504442833173],
	[821.2403684568039, 0, -3710.618852694087],
	[465.8654293443228, 0, -3315.3978873861224],
	[470.5252899253826, 0, -3295.4961462722113],
	[574.672744963673, 0, -2754.863127863875],
	[766.9382081629524, 0, -2196.372629644826],
	[711.808196519213, 0, -1412.362670559135],
	[659.1505824310369, 0, -1074.8880929659792],
	[624.4885997802527, 0, -820.5794875604718],
	[613.338998399867, 0, -549.2863048428699],
	[615.2659910905519, 0, -254.41681820277316],
	[631.5509464723799, 0, 57.57187650544248],
	[632.6015158659003, 0, 75.06034996510725],
	[858.7401092507354, 0, 455.0692034885388],
	[881.5523125395458, 0, 460.0698588204126],
	[1279.1985905536067, 0, 574.84953381561],
	[1582.0719577736868, 0, 909.2211777869965],
	[1564.7786973182829, 0, 1133.317531391225],
	[1533.516176616605, 0, 1558.3262355303575],
	[1516.6083891733049, 0, 1726.8401409618425],
	[1462.6607464657766, 0, 2030.9658888277224],
	[1031.2150679447798, 0, 2969.172461146516],
	[863.765547453525, 0, 2333.9438214829943],
	[943.1741155300306, 0, 2116.2853768550763],
	[948.1158087736208, 0, 1938.2756681535645],
	[941.8924139999368, 0, 1751.5187656045703],
	[285.6015442909424, 0, 1452.832762033113],
	[288.25073625262695, 0, 1473.0962338720701],
	[318.65687945920746, 0, 1567.3384870744173],
	[341.4017226436124, 0, 1624.284202527968],
	[368.0585968706278, 0, 2298.712827832877],
	[361.55682082141976, 0, 2324.175846275433],
	[50.17305317331068, 0, 2629.578150266865],
	[-347.9350858583221, 0, 2357.4595696137644],
	[-297.65514157287043, 0, 1917.250343981672],
	[-297.31145330050344, 0, 1876.371788743364],
	[-135.63235307210223, 0, 1338.0949185230038],
	[-80.47025428693311, 0, 1065.8724968952595],
	[-80.11108276401012, 0, 835.3502513603692],
	[-39.1867442118355, 0, 411.0192253702205],
	[-21.076782813029208, 0, 233.8242833247367]
];

let selectedCans = [];
for (let i = 0; i < 20; i++) {
	/*Generate a Random 20 Cans out of 58 */
	let random = Math.floor(Math.random() * 58);
	if (!selectedCans.includes(random)) {
		selectedCans.push(random);
	}
}

console.log(selectedCans)

const aspect = window.innerWidth / window.innerHeight;
bird_eye = new THREE.OrthographicCamera(frustumSize * aspect / - 8, frustumSize * aspect / 8, frustumSize / 8, frustumSize / - 8, 1, 1000);
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

let FuelModel = []
function loadFuel() {
	loader.load(
		// resource URL
		'../src/Fuel_Can/scene.gltf',
		// called when the resource is loaded
		function (gltf) {
			gltf.scene.scale.set(30, 30, 30)
			for (let i = 0; i < 58; i++) {
				if (selectedCans.includes(i)) {
					FuelModel[i] = SkeletonUtils.clone(gltf.scene)
					FuelModel[i].position.set(FuelTank[i][0], FuelTank[i][1], FuelTank[i][2])
					scene.add(FuelModel[i])
				}
			}
		});
}

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

loadFuel();

function checkFuelCollisions(){
	for (let i = 0; i < 58; i++) {
		if (selectedCans.includes(i)) {
			if (car.position.distanceTo(FuelModel[i].position) < 50) {
				scene.remove(FuelModel[i])
				selectedCans.splice(selectedCans.indexOf(i), 1)
				fuel += 100
				if (fuel > 1000) {
					fuel = 1000
				}
				document.querySelector(".fuel").innerHTML = "Fuel: " + fuel
			}
		}
	}
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
		if (keyCode == 69) {
			[
				console.log(car.position.x, car.position.y, car.position.z)
			]
		}
		if (keyCode == 70){
			console.log("Game Over")
			document.querySelector(".Main").remove()
			document.body.style.backgroundImage = "url('http://localhost:8080/src/assets/GameOver.jpg')"
			document.getElementById("paragraph").remove()
			// document.getElementsByTagName("body")[0].backgroundImage = "url('http://localhost:8080/src/assets/GameOver.jpg')"
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
		// console.log(rotation_ticks); 
		car.rotation.y += 0.01;
	}
	if (rotation_ticks < -2) {
		rotation_ticks += 2;
		// console.log(rotation_ticks);
		car.rotation.y -= 0.01;
	}
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
	bird_eye_renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
}

function animate() {
	requestAnimationFrame(animate);

	// controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
	// console.log(Clock.elapsedTime)
	car.translateZ(0.4);
	car.translateZ(speed);

	checkFuelCollisions()

	document.querySelector("#paragraph").innerHTML = ("Time: " + Math.floor(Clock.getElapsedTime()) + 
	" Health: " + Health + " Fuel: " + Fuel + " Score: " + Score)

	// can.rotation.y += 0.01
	turn_car();
	render();
}

function render() {
	renderer.render(scene, camera);
	bird_eye_renderer.render(scene, bird_eye);
}