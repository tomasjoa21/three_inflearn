import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { House } from './House';
import gsap from 'gsap';

// ----- 주제: 스크롤에 따라 움직이는 3D 페이지

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true; // 그림자 활성화
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 그림자의 타입 설정

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('white');

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.set(-5, 2, 25);
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight('white', 0.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight('white', 0.7); // color, intensity(조명 색상, 조명 세기)
spotLight.position.set(0, 150, 100); // x, y, z 위치설정
spotLight.castShadow = true; // 그림자 활성화
spotLight.shadow.mapSize.width = 1024; // 그림자의 해상도 너비
spotLight.shadow.mapSize.height = 1024; // 그림자의 해상도 높이
spotLight.shadow.camera.near = 1; // 그림자의 카메라 near는 카메라가 보이는 가까운 면
spotLight.shadow.camera.far = 200; // 그림자의 카메라 far는 카메라가 보이는 먼 면
scene.add(spotLight);

// GLTFLoader
const gltfLoader = new GLTFLoader();

//바닥Mesh 
const floorMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(100, 100),
	new THREE.MeshStandardMaterial({ color: 'yellow' })
);
// 처음에는 바닥이 세워져 있으므로 바닥을 눕히기 위해 x축으로 -90도 회전
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.receiveShadow = true; // 바닥에 그림자가 생기도록 설정
scene.add(floorMesh);

// House
const houses = [];
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/house.glb', x: -5, z: 20, height: 2 }));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/house.glb', x: 7, z: 10, height: 2 }));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/house.glb', x: -10, z: 0, height: 2 }));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/house.glb', x: 10, z: -10, height: 2 }));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/house.glb', x: -5, z: -20, height: 2 }));

// 그리기
const clock = new THREE.Clock();

function draw() {
	const delta = clock.getDelta();

	renderer.render(scene, camera);
	renderer.setAnimationLoop(draw);
}

let currentSection = 0;
function setSection() {
	//window.scrollY는 스크롤이 얼마나 내려갔는지를 나타내는 속성(window.pageYOffset과 같다.)
	// console.log(Math.round(window.scrollY / window.innerHeight));
	const newSection = Math.round(window.scrollY / window.innerHeight);
	// 아래의 조건문은 스크롤이 움직일때 마다 지속적으로 실행되므로
	// currentSection과 newSection이 같지 않을 때만 실행되도록 한다.
	if(currentSection !== newSection){
		console.log('animation!!');
		gsap.to(
			camera.position,
			{
				duration: 1,
				x: houses[newSection].x,
				z: houses[newSection].z + 5,
			}
		);
		currentSection = newSection; // currentSection을 newSection으로 업데이트
	}
}

function setSize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
}

// 이벤트
window.addEventListener('scroll', setSection);
window.addEventListener('resize', setSize);

draw();
