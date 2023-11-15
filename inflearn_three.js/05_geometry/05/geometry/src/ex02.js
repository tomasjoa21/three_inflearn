import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ----- 주제: Geometry 정점(Vertex) 형태변경 형태조작 형태변형

export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

	// Scene
	const scene = new THREE.Scene();

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.z = 10;
	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);

	// OrbitControls
	const controls = new OrbitControls(camera, renderer.domElement);

	// Mesh
	// const geometry = new THREE.PlaneGeometry(10, 10, 32, 32);
	const geometry = new THREE.SphereGeometry(5, 64, 64);
	const material = new THREE.MeshStandardMaterial({
		color: 'seagreen',
		side: THREE.DoubleSide,
		flatShading: true // 표면을 각진 형태로 만들어줌
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
	//geometry.SphereGeometry.attributes.position.array정보를 이용해서 형태를 변경할 수 있다.
	//위의 array요소를 3개씩 묶어서 x,y,z좌표를 만들어서 형태를 변경할 수 있다.
	// console.log(geometry.attributes.position.array);
	const positionArray = geometry.attributes.position.array;
	const randomArray = [];
	for(let i = 0; i < positionArray.length; i += 3) {
		// 정점(Vertex) 한 개의 x, y, z좌표를 랜덤으로 조정
		//(Math.random()은 0~1사이의 랜덤값을 리턴 하기 때문에
		//-0.5를 더하면 -0.5~0.5사이의 랜덤값을 리턴한다.)
		// x좌표를 랜덤하게 -0.5~0.5사이로 변경
		positionArray[i] += (Math.random() - 0.5) * 0.2;
		// y좌표를 랜덤하게 -0.5~0.5사이로 변경
		positionArray[i+1] += (Math.random() - 0.5) * 0.2;
		// z좌표를 랜덤하게 -0.5~0.5사이로 변경
		positionArray[i+2] += (Math.random() - 0.5) * 0.2;

		randomArray[i] = (Math.random() - 0.5) * 0.2;
		randomArray[i+1] = (Math.random() - 0.5) * 0.2;
		randomArray[i+2] = (Math.random() - 0.5) * 0.2;
	}
	// console.log(positionArray.length, randomArray);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		//초단위로 시간을 리턴(각도의 변화값으로 사용) 너무 느리면 이 값에 3정도를 곱해서 사용
		const time = clock.getElapsedTime() * 3; 

		for(let i = 0; i < positionArray.length; i += 3) {
			positionArray[i] += Math.sin(time + randomArray[i] * 100) * 0.001;
			positionArray[i+1] += Math.sin(time + randomArray[i+1] * 100) * 0.002;
			positionArray[i+2] += Math.sin(time + randomArray[i+1] * 100) * 0.002;
		}

		geometry.attributes.position.needsUpdate = true; //geometry의 position정보가 변경되었음을 알림

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);

	draw();
}
