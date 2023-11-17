import * as THREE from 'three';
import { CreateScene } from './CreateScene';

// ----- 주제: 여러개의 캔버스 사용하기

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// Scene
const scene1 = new CreateScene({
	//renderer: renderer // 속성과 값이 같으면 한 개만 서술 가능
	renderer,
	placeholder: '.canvas-placeholder.a',
	cameraPosition: { x: -1, y: 1, z: 2 }
});
// 조명은 scene별로 별도로 설정한다.
scene1.set(() => {
	const light = new THREE.DirectionalLight('white', 1);
	light.position.set(-1, 2, 3);
	scene1.scene.add(light);

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshStandardMaterial({ 
		color: 'green' 
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene1.scene.add(mesh);
});

// 그리기
const clock = new THREE.Clock();

function draw() {
	const delta = clock.getDelta();

	// scene1
	scene1.render();

	renderer.setAnimationLoop(draw);
}

function setSize() {
	renderer.setSize(window.innerWidth, window.innerHeight);
}

// 이벤트
window.addEventListener('resize', setSize);

draw();
