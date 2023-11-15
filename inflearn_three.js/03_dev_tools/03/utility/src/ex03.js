import * as THREE from 'three';
import dat from 'dat.gui';

// ----- 주제: GUI 컨트롤 npm i dat.gui -----

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
	camera.position.y = 1;
	camera.position.z = 5;
	// camera.lookAt(0, 0, 0);
	scene.add(camera);
	

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);
	const directionallight = new THREE.DirectionalLight('white', 1);
	directionallight.position.x = 1;
	directionallight.position.z = 2;
	scene.add(directionallight);

	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	// Dat GUI
	const gui = new dat.GUI();
	gui.add(mesh.position, 'y', -5, 5, 0.01).name('메쉬의 Y위치'); // 최소, 최대, 단계
	gui.add(camera.position, 'x', -10, 10, 0.01).name('카메라의 X위치');
	/*
	gui
		.add(mesh.position, 'z')
		.min(-10)
		.max(3)
		.step(0.01)
		.name('메쉬의 Z위치')
	*/

	// 카메라가 메쉬를 바라보도록
	camera.lookAt(mesh.position);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const time = clock.getElapsedTime();

		mesh.rotation.y = time;

		// 카메라가 메쉬를 바라보도록
		camera.lookAt(mesh.position);
		
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
