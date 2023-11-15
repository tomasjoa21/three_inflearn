import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 랜덤한 랜덤파티클

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
	controls.enableDamping = true;
	

	// Mesh
	// 랜덤한 점을 만들기 위해 일정한 형태가 없는 BufferGeometry를 사용
	const geometry = new THREE.BufferGeometry(); 
	const count = 100000; // 점의 개수(파티클의 개수)
	// Float32Array: 32비트 부동소수점 배열
	// count * 3: 점의 개수 * 3(점의 위치를 나타내는 x, y, z)
	const positions = new Float32Array(count * 3); // 점의 위치를 저장할 배열
	for (let i = 0; i < positions.length; i++) {
		positions[i] = (Math.random() - 0.5) * 10; // -5 ~ 5 사이의 랜덤한 숫자
	}
	geometry.setAttribute(
		'position', 
		new THREE.BufferAttribute(positions, 3) //1개의 Vertex(정점)을 위해 값 3개 필요
	);

	const material = new THREE.PointsMaterial({
		size: 0.03,
		// color: 'plum'
	});
	
	// Mesh에 해당하는 points를 생성
	const particles = new THREE.Points(geometry, material);
	scene.add(particles);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		controls.update();

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
