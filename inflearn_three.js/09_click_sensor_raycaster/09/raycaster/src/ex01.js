import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 특정 방향의 광선(Ray)에 맞은 Mesh 매쉬 메쉬 판별하기

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
	camera.position.x = 5;
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

	// Mesh
	const lineMaterial = new THREE.LineBasicMaterial({ color: 'yellow' });
	// 선을 그리기 위한 2개의 점을 정의
	const points = [];
	points.push(new THREE.Vector3(0, 0, 100));
	points.push(new THREE.Vector3(0, 0, -100));
	// 선을 만들기 위한 geometry
	const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
	const guide = new THREE.Line(lineGeometry, lineMaterial);
	scene.add(guide);

	// 사각형 Mesh
	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	const boxMaterial = new THREE.MeshStandardMaterial({ color: 'plum' });
	const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	boxMesh.name = 'box';

	// 도너츠 Mesh 인수 (radius, tube, radialSegments, tubularSegments)
	const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
	const torusMaterial = new THREE.MeshStandardMaterial({ color: 'lime' });
	const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
	torusMesh.name = 'torus';

	scene.add(boxMesh, torusMesh);

	// 광선에 맞은 Mesh를 저장할 변수
	const meshes = [boxMesh, torusMesh];

	// Raycaster
	const raycaster = new THREE.Raycaster();
	

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		// const delta = clock.getDelta(); //draw() 함수가 실행되는 시간간격
		const time = clock.getElapsedTime(); //draw() 함수가 실행된 총 시간(계속 늘어나는 시간)

		boxMesh.position.y = Math.sin(time) * 2;
		torusMesh.position.y = Math.cos(time) * 2;
		boxMesh.material.color.set('plum');
		torusMesh.material.color.set('lime');

		// 광선의 방향을 설정
		const origin = new THREE.Vector3(0, 0, 100);
		//-100이나 -1이나 같은 방향이지만, -1로 설정하면 광선의 방향이 더 명확해진다.
		// const direction = new THREE.Vector3(0, 0, -1);
		// 만약 -1대신 -100으로 할 경우 normalize()(정규화)를 사용해야 한다.
		const direction = new THREE.Vector3(0, 0, -100).normalize();
		// 또는 
		// const direction = new THREE.Vector3(0, 0, -100);
		// direction.normalize();
		raycaster.set(origin, direction);

		// console.log(raycaster.intersectObjects(meshes));
		const intersects = raycaster.intersectObjects(meshes);
		intersects.forEach(item => {
			console.log(item.object.name);
			item.object.material.color.set('red');
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

	draw();
}
