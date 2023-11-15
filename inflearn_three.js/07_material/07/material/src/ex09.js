import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 객체재질 매쉬재질 매시재질 메쉬재질 메시재질 표면재질 (여러 이미지의 텍스쳐가 적용된 큐브)

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
	const rightTexture = textureLoader.load('/textures/mcstyle/right.png');
	const leftTexture = textureLoader.load('/textures/mcstyle/left.png');
	const topTexture = textureLoader.load('/textures/mcstyle/top.png');
	const bottomTexture = textureLoader.load('/textures/mcstyle/bottom.png');
	const frontTexture = textureLoader.load('/textures/mcstyle/front.png');
	const backTexture = textureLoader.load('/textures/mcstyle/back.png');
	// 재질 배열
	const materials = [
		new THREE.MeshBasicMaterial({ map: rightTexture }),
		new THREE.MeshBasicMaterial({ map: leftTexture }),
		new THREE.MeshBasicMaterial({ map: topTexture }),
		new THREE.MeshBasicMaterial({ map: bottomTexture }),
		new THREE.MeshBasicMaterial({ map: frontTexture }),
		new THREE.MeshBasicMaterial({ map: backTexture }),
	];

	// 픽셀이 깨지는 현상을 방지하기 위해 텍스쳐를 선형으로 보간
	rightTexture.magFilter = THREE.NearestFilter;
	leftTexture.magFilter = THREE.NearestFilter;
	topTexture.magFilter = THREE.NearestFilter;
	bottomTexture.magFilter = THREE.NearestFilter;
	frontTexture.magFilter = THREE.NearestFilter;
	backTexture.magFilter = THREE.NearestFilter;

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
	const mesh = new THREE.Mesh(geometry, materials);
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
