import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { PreventDragClick } from './PreventDragClick'; // 드래그를 했을 경우 클릭이벤트를 실행하지 않도록 하는 객체
import { MySphere } from './MySphere';

// ----- 주제: 랜덤한 위치에 공생성(Performance 성능높임 성능향상 성능 높게 하기)
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

	// #### 성능을 위한 세팅 ####
	//--------------------------
	// 즉, body가 엄청 느려지면, 테스트 안함
	// 게임에서는 이 설정이 적합하지 않을 수 있다.(필요에 따라 잘 고려해서 사용)
	cannonWorld.allowSleep = true;
	// 아래 설정을 하면 물리엔진이 작동하지 않는 물체를 계산하지 않는다.
	// SAPBroadphase 제일 좋은 성능을 보여준다.(추천)
	// NaiveBroadphase는 모든 물체를 계산하기 때문에 성능이 떨어진다.(default)
	// GridBroadphase는 물체를 격자로 구역을 나눠서 계산하기 때문에 성능이 좋다.
	cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);

	// Cantact Material (마찰력과 반발력)
	const defaultMaterial = new CANNON.Material('default');
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
	
	// 구체 geometry와 material만 작성
	const spheres = [];
	const sphereGeometry = new THREE.SphereGeometry(0.5);
	const sphereMaterial = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});
	

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		// 물리엔진 업데이트
		// console.log(delta);
		// 물리엔진은 1초에 60번 업데이트한다.(모니터 주사율(맥북성능)에 따라 1/60(성능보통) 또는 1/120(성능높음))
		let cannonStepTime = (delta < 0.01) ? 1 / 120 : 1 / 60;
		cannonWorld.step(cannonStepTime, delta, 3); //인수: 시간, 이전 프레임과의 시간차, 반복횟수
		
		spheres.forEach(item => {
			// sphereMesh가 캐논 공바디를 따라가도록 설정한다.
			item.mesh.position.copy(item.cannonBody.position);
			// sphereMesh의 회전값을 캐논 공바디의 회전값으로 설정한다.
			item.mesh.quaternion.copy(item.cannonBody.quaternion);
		});

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
	canvas.addEventListener('click', () => {
		spheres.push(new MySphere({
			// scene: scene, // 속성과 값이 같으면 scene 하나만 써도 된다.
			scene,
			// cannonWorld: cannonWorld, // 속성과 값이 같으면 cannonWorld 하나만 써도 된다.
			cannonWorld,
			geometry: sphereGeometry,
			material: sphereMaterial,
			x: (Math.random() - 0.5) * 2, // -1 ~ 1 사이의 랜덤한 값
			y: Math.random() * 5 + 2, // 2 ~ 7 사이의 랜덤한 값
			z: (Math.random() - 0.5) * 2, // -1 ~ 1 사이의 랜덤한 값
			scale: Math.random() + 0.2, // 0.2 ~ 1.2 사이의 랜덤한 값
		}));
	});

	// 드래그 여부를 감지해서 클릭이벤트를 실행하지 않도록 하는 객체
	const preventDragClick = new PreventDragClick(canvas);

	draw();
}
