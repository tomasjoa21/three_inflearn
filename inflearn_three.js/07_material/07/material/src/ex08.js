import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 객체재질 매쉬재질 매시재질 메쉬재질 메시재질 표면재질 택스쳐이미지변환 텍스쳐이미지변환

export default function example() {
	// 텍스쳐 이미지 로드
	const loadingManager = new THREE.LoadingManager();
	// 이미지 로드가 시작될 때 호출되는 함수
	loadingManager.onStart = () => {
		console.log('Load Start');
	}
	// 여러 이미지를 로드할 때 하나하나의 이미지가 로드될 때마다 호출되는 함수
	loadingManager.onProgress = (item, loaded, total) => {
		console.log(item + '로드', loaded, total);
	} 
	// 이미지 로드가 완료될 때 호출되는 함수
	loadingManager.onLoad = () => {
		console.log('Load Complete');
	}
	// 이미지 로드가 에러가 발생될 때 호출되는 함수
	loadingManager.onError = () => {
		console.log('Load Error');
	}

	// 텍스쳐 이미지 로드하기
	const textureLoader = new THREE.TextureLoader(loadingManager);
	/*
	webpack을 사용하기 때문에
	파일 경로는 webpack.config.js에 new CopyWebpackPlugin({ 부분에 지정을 해 주어야 한다.
	...
	{ from: "./src/textures", to: "./textures" },
	*/
	const texture = textureLoader.load('/textures/skull/Ground Skull_basecolor.jpg');
	
	// 텍스쳐 이미지 변환
	// 이미지 반복시 반드시 wrapS, wrapT를 설정해야 한다.
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	// texture.offset.x = 0.3;
	// texture.offset.y = 0.3;

	// texture.repeat.x = 2;
	// texture.repeat.y = 2;
	
	// 이미지 회전
	// texture.rotation = Math.PI / 4;
	// texture.rotation = Math.PI * 0.25;
	texture.rotation = THREE.MathUtils.degToRad(45);
	// 이미지의 회전중심을 설정
	texture.center.x = 0.5;
	texture.center.y = 0.5;


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
