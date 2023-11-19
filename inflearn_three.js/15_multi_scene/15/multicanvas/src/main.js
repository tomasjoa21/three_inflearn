import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
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

const gltfLoader = new GLTFLoader();

// Scene
const scene1 = new CreateScene({
	//renderer: renderer // 속성과 값이 같으면 한 개만 서술 가능
	renderer,
	placeholder: '.canvas-placeholder.a',
	// cameraPosition: { x: -1, y: 1, z: 2 }
});
// 조명은 scene별로 별도로 설정한다.
scene1.set(() => {
	const light = new THREE.DirectionalLight('white', 1);
	light.position.set(-1, 2, 3);
	// 라이트를 scene1의 scene에 추가한다.
	// scene1.scene.add(light);
	// 하지만 아래에서 controls를 사용하기 위해 라이트를 scene1의 camera에 추가한다.
	scene1.camera.add(light);

	scene1.controls = new OrbitControls(scene1.camera, scene1.elem);

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshStandardMaterial({ 
		color: 'green' 
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene1.meshes.push(mesh);
	scene1.meshes.forEach(mesh => {
		scene1.scene.add(mesh);
	});
});

// Scene
const scene2 = new CreateScene({
	//renderer: renderer // 속성과 값이 같으면 한 개만 서술 가능
	renderer,
	placeholder: '.canvas-placeholder.b',
	// cameraPosition: { x: -1, y: 1, z: 2 }
});
// 조명은 scene별로 별도로 설정한다.
scene2.set(() => {
	const light = new THREE.DirectionalLight('white', 1);
	light.position.set(-1, 2, 3);
	// 라이트를 scene1의 scene에 추가한다.
	// scene1.scene.add(light);
	// 하지만 아래에서 controls를 사용하기 위해 라이트를 scene1의 camera에 추가한다.
	scene2.camera.add(light);

	scene2.controls = new OrbitControls(scene2.camera, scene2.elem);

	const geometry = new THREE.BoxGeometry(0.4, 1, 0.7);
	const material = new THREE.MeshStandardMaterial({ 
		color: 'red' 
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene2.meshes.push(mesh);
	scene2.meshes.forEach(mesh => {
		scene2.scene.add(mesh);
	});
});

// Scene
const scene3 = new CreateScene({
	//renderer: renderer // 속성과 값이 같으면 한 개만 서술 가능
	renderer,
	placeholder: '.canvas-placeholder.c',
	// cameraPosition: { x: -1, y: 1, z: 2 }
});
// 조명은 scene별로 별도로 설정한다.
scene3.set(() => {
	const light = new THREE.DirectionalLight('white', 1);
	light.position.set(-1, 2, 3);
	// 라이트를 scene1의 scene에 추가한다.
	// scene1.scene.add(light);
	// 하지만 아래에서 controls를 사용하기 위해 라이트를 scene1의 camera에 추가한다.
	scene3.camera.add(light);

	scene3.controls = new OrbitControls(scene3.camera, scene3.elem);

	// 외부 모델을 불러올거기 때문에 src/models경로를 사용할 수 있도록 
	// webpack.config.js에 설정을 추가한다.
	gltfLoader.load(
		'./models/ilbuni.glb',
		glb => {
			// console.log(glb.scene.children[0]);
			const mesh = glb.scene.children[0];
			scene3.meshes.push(mesh);
			scene3.scene.add(mesh);
		}
	);

	// scene3.meshes.push(mesh);
	// scene3.meshes.forEach(mesh => {
	// 	scene3.scene.add(mesh);
	// });
});

// 그리기
const clock = new THREE.Clock();

function draw() {
	const delta = clock.getDelta();

	scene1.meshes.forEach(mesh => {
		mesh.rotation.y += delta;
	});

	// scene1
	scene1.render();
	// scene2
	scene2.render();
	// scene3
	scene3.render();

	renderer.setAnimationLoop(draw);
}

function setSize() {
	renderer.setSize(window.innerWidth, window.innerHeight);
}

// 이벤트
window.addEventListener('resize', setSize);

draw();
