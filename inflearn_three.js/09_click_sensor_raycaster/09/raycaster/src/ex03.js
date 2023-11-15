import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// 별도로 분리하여 정의한 PreventDragClick.js 파일을 모듈로 가져옴
import { PreventDragClick } from './PreventDragClick';

// ----- 주제: 클릭한 메쉬감지 매쉬감지 매시감지 mesh감지 드래그 클릭 방지 시간지연클릭방지 별도의 파일로 모듈화


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
	// 마우스 2D 좌표를 저장할 변수
	const mouse = new THREE.Vector2();

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		// const delta = clock.getDelta(); //draw() 함수가 실행되는 시간간격
		const time = clock.getElapsedTime(); //draw() 함수가 실행된 총 시간(계속 늘어나는 시간)

		// boxMesh.position.y = Math.sin(time) * 2;
		// torusMesh.position.y = Math.cos(time) * 2;

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}
	
	function checkIntersects(){
		if(preventDragClick.mouseMoved) return; // 마우스를 드래그 했을 경우 클릭이 아니므로 함수 종료
		// 광선을 카메라시점에서 마우스 좌표에 맞춰서 생성
		raycaster.setFromCamera(mouse, camera);
		// 광선과 충돌된 Mesh들을 배열로 반환
		const intersects = raycaster.intersectObjects(meshes);
		// if(intersects[0]) console.log(intersects[0].object.name); //아래의 for문을 사용하지 않을 경우
		for(const item of intersects){
			// console.log(item);
			console.log(item.object.name);
			item.object.material.color.set('red');
			break; // 첫번째 광선에 맞은 Mesh만 색상 변경(break가 없으면 모든 광선에 맞은 Mesh의 색상이 변경됨)
		}
	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);

	canvas.addEventListener('click', e => {
		// console.log(e.clientX, e.clientY);
		// 마우스 좌표를 NDC 좌표로 변환
		mouse.x = e.clientX / window.innerWidth * 2 - 1;
		// mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(e.clientY / window.innerHeight * 2 - 1);
		// mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
		// console.log(mouse.x, mouse.y);

		checkIntersects();
	});

	// PreventDragClick 클래스의 인스턴스 생성
	const preventDragClick = new PreventDragClick(canvas);

	draw();
}
