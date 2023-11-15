import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';

// ----- 주제: cannon.js 기본 세팅과 중력에 의해 떨어지는 객체
// 캐논 물리엔진을 사용하기 위해 npm i cannon-es 설치해야 한다.
// cannon.js 문서
// http://schteppe.github.io/cannon.js/docs/
// 주의! https 아니고 http

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
	camera.position.y = 1.5;
	camera.position.z = 4;
	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// 물리엔진(Cannon)
	const cannonWorld = new CANNON.World();
	cannonWorld.gravity.set(0, -10, 0); //y축 방향으로 중력을 설정한다.(-9.82)

	// 물리엔진이 적용된 바닥 생성
	const floorShape = new CANNON.Plane();
	const floorBody = new CANNON.Body({
		mass: 0, // 이설정을 안하면 물리엔진이 적용된 바닥이 한없이 떨어진다.
		position: new CANNON.Vec3(0, 0, 0), // 바닥의 위치
		shape: floorShape // 바닥의 형태
	});
	floorBody.quaternion.setFromAxisAngle(
		new CANNON.Vec3(-1, 0, 0),
		Math.PI / 2
	); // 바닥의 회전값을 설정한다.
	cannonWorld.addBody(floorBody); // 바닥을 물리엔진에 추가한다.

	// 물리엔진이 적용된 박스 생성
	const boxShape = new CANNON.Box(new CANNON.Vec3(0.25, 2.5, 0.25));
	const boxBody = new CANNON.Body({
		mass: 1, // 박스의 무게
		position: new CANNON.Vec3(0, 10, 0), // 박스의 위치
		shape: boxShape // 박스의 형태
	});
	cannonWorld.addBody(boxBody); // 박스를 물리엔진에 추가한다.

	// Mesh
	const floorMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(10, 10),
		new THREE.MeshStandardMaterial({
			color: 'slategray'
		})
	);
	floorMesh.rotation.x = -Math.PI / 2;
	scene.add(floorMesh);

	const boxGeometry = new THREE.BoxGeometry(0.5, 5, 0.5);
	const boxMaterial = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});
	const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	boxMesh.position.y = 0.5;
	scene.add(boxMesh);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		// 물리엔진 업데이트
		// console.log(delta);
		// 물리엔진은 1초에 60번 업데이트한다.(모니터 주사율(맥북성능)에 따라 1/60(성능보통) 또는 1/120(성능높음))
		let cannonStepTime = (delta < 0.01) ? 1 / 120 : 1 / 60;
		cannonWorld.step(cannonStepTime, delta, 3); //인수: 시간, 이전 프레임과의 시간차, 반복횟수
		// floorMesh가 캐논 바닥바디를 따라가도록 설정한다.
		// (하지만 캐논 바닥바디는 움직이지 않는다.) 그래서 주석처리해도 된다.
		// floorMesh.position.copy(floorBody.position);
		// boxMesh가 캐논 박스바디를 따라가도록 설정한다.
		boxMesh.position.copy(boxBody.position);
		// boxMesh의 회전값을 캐논 박스바디의 회전값으로 설정한다.
		boxMesh.quaternion.copy(boxBody.quaternion);

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
