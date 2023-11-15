import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 객체재질 매쉬재질 매시재질 메쉬재질 메시재질 표면재질 텍스쳐 texture 이미지 로드하기

export default function example() {
	// 텍스쳐 이미지 로드하기
	const textureLoader = new THREE.TextureLoader();
	/*
	webpack을 사용하기 때문에
	파일 경로는 webpack.config.js에 new CopyWebpackPlugin({ 부분에 지정을 해 주어야 한다.
	...
	{ from: "./src/textures", to: "./textures" },
	*/
	// const texture = textureLoader.load('/textures/brick/Brick_Wall_019_basecolor.jpg');
	const texture = textureLoader.load(
		'/textures/brick/Brick_Wall_019_basecolor.jpg',
		() => {
			console.log('로드 완료');
		},
		() => {
			console.log('로드중');
		},
		() => {
			console.log('로드 에러');
		}
	);

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
	scene.background = new THREE.Color('white');

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.y = 1.5;
	camera.position.z = 4;
	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.set(1, 1, 2);
	scene.add(ambientLight,directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// Mesh
	const geometry = new THREE.BoxGeometry(2, 2, 2);
	//MeshLambertMaterial: 하이라이트, 반사광이 없는 재질
	const material = new THREE.MeshStandardMaterial({
		// color: 'orangered',
		map: texture
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

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
