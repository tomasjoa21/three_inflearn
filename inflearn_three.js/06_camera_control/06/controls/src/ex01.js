import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ----- 주제: OrbitControls

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
	controls.enableDamping = true; //카메라회전 카메라움직임을 부드럽게 해준다.
	// controls.enableZoom = false; //줌인아웃을 막는다.
	// controls.maxDistance = 10; //줌인아웃 최대값
	// controls.minDistance = 5; //줌인아웃 최소값
	// controls.minPolarAngle = Math.PI / 4; //위아래로 움직일수 있는 각도의 범위(아래와 공일기능)
	// controls.minPolarAngle = THREE.MathUtils.degToRad(45); //위아래로 움직일수 있는 각도의 범위(아래와 공일기능)
	// controls.minPolarAngle = THREE.MathUtils.degToRad(135); //위아래로 움직일수 있는 각도의 범위(아래와 공일기능)
	// controls.target.set(2, 2, 2);
	controls.autoRotate = true; //자동으로 회전한다.
	controls.autoRotateSpeed = 5; //자동으로 회전하는 속도

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

		//위에서 enableDamping을 true로 설정했으므로 update를 해줘야 한다.
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
