import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 객체재질 매쉬재질 매시재질 메쉬재질 메시재질 표면재질 EnvironmentMap 환경맵 표면에 주변환경을 반사하는 효과
/*
https://polyhaven.com
https://polyhaven.com/hdris
원하는 이미지를 선택하고 옵션에 EXR이 아닌 HDR을 선택하고 다운로드 받는다.

HDR이미지를 사용하기 위해서는 cubemap으로 변환해야 한다.
구글에서 hdr to cubemap을 검색하면 여러가지 사이트가 나오는데 그 중에
HDRI to CubeMap 항목을 선택한다.
https://matheowis.github.io/HDRI-to-CubeMap/
이 사이트에서 "UPLOAD HDRI"을 눌러 다운받은 hdr 이미지를 
"CUBEMAP VIEW"를 누르면 큐브를 펼진 형태의 이미지를 확인할 수 있다.
"SAVE"를 눌러서 옵션(256, png, 6개따로분리된이미지)등을 선택하고
(여기서는 6개 따로 분리된 이미지형태로 다운로드 받았다.)
"PROCESS"를 이미지 편집을 진행한다.
"SAVE"를 눌러서 다운로드 받는다.
*/


export default function example() {
	// 텍스쳐 이미지 로드
	const cubeTextureLoader = new THREE.CubeTextureLoader();
	const envTex = cubeTextureLoader
		.setPath('/textures/cubemap/')
		.load([
			// +,-순서 px, nx, py, ny, pz, nz에서 p는 plus, n은 minus를 의미한다.
			// 아래 순서를 지키지 않으면 환경맵이 제대로 표현되지 않는다.
			'px.png','nx.png',
			'py.png','ny.png',
			'pz.png','nz.png'
		]);

	// console.log(envTex);

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
	const geometry = new THREE.BoxGeometry(3, 3, 3);
	//MeshLambertMaterial: 하이라이트, 반사광이 없는 재질
	// const material = new THREE.MeshStandardMaterial({
	const material = new THREE.MeshBasicMaterial({
		// matalness: 20,
		// roughness: 0.1,
		envMap: envTex,
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
