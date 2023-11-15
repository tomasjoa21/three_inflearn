import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { PreventDragClick } from './PreventDragClick'; // 드래그를 했을 경우 클릭이벤트를 실행하지 않도록 하는 객체
import { MySphere } from './MySphere';

// ----- 주제: 오브젝트 제거하기 오브젝트제거 객체제거 삭제하기 오브젝트삭제 객체삭제
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

	// 사운드 로드
	/*
	경로를 인식하기 위해 webpack.config.js에 
	사운드파일이 저장된 폴더경로의 설정을 추가해야 한다.
	예)
	....
	new CopyWebpackPlugin({
		patterns: [
			{ from: "./src/main.css", to: "./main.css" },
			// { from: "./src/images", to: "./images" },
			// { from: "./src/models", to: "./models" },
			{ from: "./src/sounds", to: "./sounds" }
		],
	})
	....
	*/
	const sound = new Audio('./sounds/boing.mp3');

	// 충돌함수정의
	function collide(e) {
		// console.log(e);

		const velocity = e.contact.getImpactVelocityAlongNormal();
		// console.log(velocity);
		if(velocity > 3){ // 충돌속도가 3이상이면 사운드를 재생한다.
			/*
			sound.play()함수만 쓰면 사운드가 끝까지 재생되어 
			공이 충돌하는 타이밍에 맞춰 사운드가 재생되지 않는 문제가 있는데
			이를 해결하기 위해 아래와 같이 currentTime을 0으로 설정해야 한다.
			*/
			sound.currentTime = 0; // 사운드의 재생위치를 처음으로 되돌린다.
			sound.play();
		}
	}

	// 이벤트
	window.addEventListener('resize', setSize);
	canvas.addEventListener('click', () => {
		const mySphere = new MySphere({
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
		});
		spheres.push(mySphere);
		//collide이벤트(충돌이벤트)를 감지해서 위에 정의한 collide()함수를 실행한다.
		mySphere.cannonBody.addEventListener('collide', collide);
	});

	// 드래그 여부를 감지해서 클릭이벤트를 실행하지 않도록 하는 객체
	const preventDragClick = new PreventDragClick(canvas);

	//삭제하기 제거하기
	const btn = document.createElement('button');
	btn.style.cssText = 'position: absolute; left: 20px; top: 20px; font-size: 20px;';
	btn.innerHTML = '삭제';
	document.body.append(btn);

	btn.addEventListener('click', () => {
		// 공메쉬를 제거할때 메쉬와 관련된 물리엔진의 공바디도 같이 제거해야 한다.
		// 그리고 관련된 이벤트도 제거해야 한다.(충돌이벤트 등)
		spheres.forEach(item => {
			item.cannonBody.removeEventListener('collide', collide); // 이벤트 제거
			cannonWorld.removeBody(item.cannonBody); // 물리엔진에서 공바디를 제거 한다.
			scene.remove(item.mesh); // 씬에서 공메쉬를 제거한다.
		});
	});

	draw();
}
