import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// RectAreaLightHelper는 기본적으로 포함되어 있지 않으므로 따로 import 해줘야 한다.
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import dat from 'dat.gui';

// ----- 주제: 빛 라이트 광원 RectAreaLight 사각광원, dat.GUI, AxesHelper, lightHelper

export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
	// 그림자를 만들어주는 속성
	renderer.shadowMap.enabled = true;
	// ### 그림자의 타입을 설정하는 속성 ###
	// default THREE.PCFShadowMap
	// renderer.shadowMap.type = THREE.PCFShadowMap;
	// Anti-aliasing이 없는 그림자 거친 그림자(성능이 좋음) radius(블러) 적용 안됨
	// renderer.shadowMap.type = THREE.BasicShadowMap; 
	// Anti-aliasing이 있는 그림자 부드러운 그림자(성능에 영향을 준다) radius(블러) 적용 안됨
	// renderer.shadowMap.type = THREE.PCFSoftShadowMap;


	// Scene
	const scene = new THREE.Scene();

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

	// Light (AmbientLight는 은은하게 전체적인 베이스를 잡아주는 빛)
	// 인수 (색상(0xffffff or 'white'), 강도(1))
	// const ambientLight = new THREE.AmbientLight('white', 0.5);
	// scene.add(ambientLight);

	// Light (RectAreaLight는 사각형광원으로 빛을 뿜는다)
	// 인수 (색상(0xffffff or 'white'), 강도(1), 너비(10), 높이(10)
	const light = new THREE.RectAreaLight('orange', 10, 2, 2);
	// light.position.x = -5;
	light.position.y = 2; //light.position.set(2, 2, 0);
	light.position.z = 3;
	scene.add(light);

	// Light의 위치를 보여주는 Helper
	// RectAreaLightHelper는 기본적으로 포함되어 있지 않으므로 따로 위에서 import 해줘야 한다.
	// 따로 import 해줬으므로 new THREE.RectAreaLightHelper()로 사용할 수 없고
	// 아래와 같이 THREE를 빼고 사용해야 한다.
	const lightHelper = new RectAreaLightHelper(light);
	scene.add(lightHelper);

	// 라이트가 빛이 그림자를 만들어주는 속성(HemisphereLight는 반구광원이므로 필요없음)
	// light.castShadow = true;
	// 그림자의 해상도를 높여주는 속성 (성능에 영향을 준다)(HemisphereLight는 반구광원이므로 필요없음)
	// light.shadow.mapSize.width = 1024; // default: 512
	// light.shadow.mapSize.height = 1024; // default: 512
	// 그림자의 테두리에 블러를 주는 속성(HemisphereLight는 반구광원이므로 필요없음)
	// light.shadow.radius = 5;
	// 그림자의 생기는 범위를 조절하는 속성(HemisphereLight는 반구광원이므로 필요없음)
	// light.shadow.camera.near = 1; // default: 0.5
	// light.shadow.camera.far = 30; // default: 500

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// Geometry
	const planeGeometry = new THREE.PlaneGeometry(10, 10);
	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16);
	// Material1
	const material1 = new THREE.MeshStandardMaterial({color: 'white'});
	const material2 = new THREE.MeshStandardMaterial({color: 'white'});
	const material3 = new THREE.MeshStandardMaterial({color: 'white'});
	// Mesh
	const plane = new THREE.Mesh(planeGeometry, material1);
	const box = new THREE.Mesh(boxGeometry, material2);
	const sphere = new THREE.Mesh(sphereGeometry, material3);

	// plane을 바닥으로 눞히기
	plane.rotation.x = -Math.PI * 0.5; // -Math.PI / 2 (90도)
	// box를 위로 올리기
	box.position.set(1, 1, 0);
	// sphere를 왼쪽으로 옮기기
	sphere.position.set(-1, 1, 0);

	// 바닥(plane)에 그림자가 만들어지는 속성
	plane.receiveShadow = true;
	// box에 그림자를 만드는 속성
	box.castShadow = true;
	// box에 그림자가 만들어지는 속성
	box.receiveShadow = true;
	// sphere에 그림자를 만들어주는 속성
	sphere.castShadow = true;
	// sphere에 그림자가 만들어지는 속성
	sphere.receiveShadow = true;


	scene.add(plane, box, sphere);

	// AxesHelper
	const axesHelper = new THREE.AxesHelper(3);
	scene.add(axesHelper);

	// Dat GUI
	const gui = new dat.GUI();
	// DirectionalLight의 위치 조정하는 GUI
	gui.add(light.position, 'x', -5, 5, 0.1).name('빛 X');
	gui.add(light.position, 'y', -5, 5, 0.1).name('빛 Y');
	gui.add(light.position, 'z', -5, 5, 0.1).name('빛 Z');
	/*
	// 카메라 위치 조정하는 GUI
	gui.add(camera.position, 'x', -5, 5, 0.1).name('카메라 X');
	gui.add(camera.position, 'y', -5, 5, 0.1).name('카메라 Y');
	gui.add(camera.position, 'z', 2, 10, 0.1).name('카메라 Z');
	*/
	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		// const delta = clock.getDelta(); // draw() 함수가 실행되는 시간간격
		const time = clock.getElapsedTime(); // draw() 함수가 실행된 총 시간(계속 늘어나는 시간)

		// 빛을 위에서 원형으로 돌리기
		light.position.x = Math.cos(time) * 5;
		light.position.z = Math.sin(time) * 5;

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
