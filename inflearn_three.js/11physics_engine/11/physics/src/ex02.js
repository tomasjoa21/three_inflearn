import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';

// ----- 주제: 재질에 따른 마찰력과 반발력 (Contact Material)
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
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
	directionalLight.castShadow = true;
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// 물리엔진(Cannon)
	const cannonWorld = new CANNON.World();
	cannonWorld.gravity.set(0, -10, 0); //y축 방향으로 중력을 설정한다.(-9.82)

	// Cantact Material (마찰력과 반발력)
	const defaultMaterial = new CANNON.Material('default');
	const rubberMaterial = new CANNON.Material('rubber');
	const ironMaterial = new CANNON.Material('iron');
	// 기본재질과 기본재질의 마찰력 반발력에 대한 정의(마찰력과 반발력)
	const defaultContactMaterial = new CANNON.ContactMaterial(
		defaultMaterial, // 첫번째 재질
		defaultMaterial, // 두번째 재질
		{
			friction: 0.5, // 마찰력
			restitution: 0.3, // 반발력
		}
	);
	// 캐논 물리엔진의 재질속성에 적용할 재질을 대입한다.(마찰력과 반발력)
	cannonWorld.defaultContactMaterial = defaultContactMaterial;

	// 필요에 따라 고무재질과 기본재질의 마찰력 반발력에 대한 정의을 추가한다.(마찰력과 반발력)
	const rubberContactMaterial = new CANNON.ContactMaterial(
		rubberMaterial, // 첫번째 재질
		defaultMaterial, // 두번째 재질
		{
			friction: 0.5, // 마찰력
			restitution: 0.7, // 반발력
		}
	);
	// 캐논 물리엔진의 재질속성에 적용할 재질을 추가한다.(마찰력과 반발력)
	cannonWorld.addContactMaterial(rubberContactMaterial);

	// 필요에 따라 철재질과 기본재질의 마찰력 반발력에 대한 정의을 추가한다.(마찰력과 반발력)
	const ironContactMaterial = new CANNON.ContactMaterial(
		ironMaterial, // 첫번째 재질
		defaultMaterial, // 두번째 재질
		{
			friction: 0.5, // 마찰력
			restitution: 0, // 반발력
		}
	);
	// 캐논 물리엔진의 재질속성에 적용할 재질을 추가한다.(마찰력과 반발력)
	cannonWorld.addContactMaterial(ironContactMaterial);

	// 물리엔진이 적용된 바닥 생성
	const floorShape = new CANNON.Plane();
	const floorBody = new CANNON.Body({
		mass: 0, // 이설정을 안하면 물리엔진이 적용된 바닥이 한없이 떨어진다.
		position: new CANNON.Vec3(0, 0, 0), // 바닥의 위치
		shape: floorShape, // 바닥의 형태
		material: defaultMaterial, // 바닥의 재질(마찰력과 반발력)
	});
	floorBody.quaternion.setFromAxisAngle(
		new CANNON.Vec3(-1, 0, 0),
		Math.PI / 2
	); // 바닥의 회전값을 설정한다.
	cannonWorld.addBody(floorBody); // 바닥을 물리엔진에 추가한다.

	// 물리엔진이 적용된 공 생성
	const sphereShape = new CANNON.Sphere(0.5);
	const sphereBody = new CANNON.Body({
		mass: 1, // 공의 무게
		position: new CANNON.Vec3(0, 10, 0), // 공의 위치
		shape: sphereShape, // 공의 형태
		// material: rubberMaterial, // 공의 재질
		material: ironMaterial, // 공의 재질(마찰력과 반발력)
	});
	cannonWorld.addBody(sphereBody); // 공을 물리엔진에 추가한다.

	// Mesh
	const floorMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(10, 10),
		new THREE.MeshStandardMaterial({
			color: 'slategray'
		})
	);
	floorMesh.rotation.x = -Math.PI / 2;
	floorMesh.receiveShadow = true;
	scene.add(floorMesh);

	const sphereGeometry = new THREE.SphereGeometry(0.5);
	const sphereMaterial = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});
	const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphereMesh.position.y = 0.5;
	sphereMesh.castShadow = true;
	scene.add(sphereMesh);

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
		// sphereMesh가 캐논 공바디를 따라가도록 설정한다.
		sphereMesh.position.copy(sphereBody.position);
		// sphereMesh의 회전값을 캐논 공바디의 회전값으로 설정한다.
		sphereMesh.quaternion.copy(sphereBody.quaternion);

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
