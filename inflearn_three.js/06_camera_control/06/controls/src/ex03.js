import * as THREE from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

// ----- 주제: FlyControls

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
	/*
	w : 전진
	s : 후진
	a : 좌로 이동
	d : 우로 이동
	q : z축기준으로 시계방향 회전
	e : z축기준으로 반시계방향 회전
	r : 위로 이동
	f : 아래로 이동
	*/
	const controls = new FlyControls(camera, renderer.domElement);
	controls.rollSpeed = 0.5; //회전속도 (0.005가 기본값)
	controls.movementSpeed = 3; //이동속도 (1이 기본값)
	controls.dragToLook = true; //마우스 움직임에 따라 자동으로 회전할지 여부 (false가 기본값)
	

	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	let mesh;
	let material;
	for(let i = 0; i < 20; i++) {
		material = new THREE.MeshStandardMaterial({
			//배경이0이니 색상이 0인 객체는 아보이므로 최소 50을 더해준다.
			// 최초 50을 더해줬으니 랜덤값의 최대값은 255가 아닌 205가 된다.
			color: `rgb(
				${50 + Math.floor(Math.random() * 205)},
				${50 + Math.floor(Math.random() * 205)},
				${50 + Math.floor(Math.random() * 205)}
			)
			`
		});
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.x = (Math.random() - 0.5) * 5;
		mesh.position.y = (Math.random() - 0.5) * 5;
		mesh.position.z = (Math.random() - 0.5) * 5;
		scene.add(mesh);
	}

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		//TrackballControls는 반드시 update를 해줘야 한다.
		// 인수로 반드시 delta를 넘겨줘야 한다.
		controls.update(delta); 

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
