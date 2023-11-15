import { cm1, cm2 } from './common';
import * as THREE from 'three';
import * as CANNON from 'cannon-es'; // 물리엔진
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { PreventDragClick } from './PreventDragClick';
import { Floor } from './Floor';
import { Pillar } from './Pillar';
import { Bar } from './Bar';
import { SideLight } from './SideLight';
import { Glass } from './Glass';
import { Player } from './Player';

// ----- 주제: The Bridge 게임 만들기
/*
3D모델과 사운드롤 인쿠르드해야 하므로
webpack.config.js에서 src/models, src/sounds 폴더의 경로설정을 해야 한다.
*/
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

// cm1.scene을 외부모듈로 분리했기 때문에 위에서 import하고 아래와 같이 사용할 수 있다.
// 또는 위에서 cm1으로 import했기 때문에 cm1.scene을 그대로 사용할 수 있다.
// const scene = new THREE.Scene();
// const scene = cm1.scene;
cm1.scene.background = new THREE.Color(cm2.backgroundColor);

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
const camera2 = camera.clone();
camera.position.x = -4;
camera.position.y = 19;
camera.position.z = 14;

camera2.position.y = 0; // 카메라2는 바닥에 떨어진 플레이어 관점에서 보여줄 카메라이므로 바닥위치인 y값을 0으로 설정한다.
camera2.lookAt(0, 1, 0); // 카메라2는 바닥에서 위를 보도록 해야 하므로 y값을 1로 설정한다.
cm1.scene.add(camera, camera2);

// Light
const ambientLight = new THREE.AmbientLight(cm2.lightColor, 1);
cm1.scene.add(ambientLight);

const spotLightDistance = 50;
const spotLight1 = new THREE.SpotLight(cm2.lightColor, 1);
spotLight1.castShadow = true;
spotLight1.shadow.mapSize.width = 2048;
spotLight1.shadow.mapSize.height = 2048;
const spotLight2 = spotLight1.clone();
const spotLight3 = spotLight1.clone();
const spotLight4 = spotLight1.clone();
spotLight1.position.set(-spotLightDistance, spotLightDistance, spotLightDistance);
spotLight2.position.set(spotLightDistance, spotLightDistance, spotLightDistance);
spotLight3.position.set(-spotLightDistance, spotLightDistance, -spotLightDistance);
spotLight4.position.set(spotLightDistance, spotLightDistance, -spotLightDistance);
cm1.scene.add(spotLight1, spotLight2, spotLight3, spotLight4);

// const spotLightHelper1 = new THREE.SpotLightHelper(spotLight1);
// const spotLightHelper2 = new THREE.SpotLightHelper(spotLight2);
// const spotLightHelper3 = new THREE.SpotLightHelper(spotLight3);
// const spotLightHelper4 = new THREE.SpotLightHelper(spotLight4);
// cm1.scene.add(spotLightHelper1);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 물리엔진
//0, -9.82, 0 (지구에서의 중력가속도)이므로 y값을 -10으로 설정한다.
cm1.world.gravity.set(0, -10, 0); 

// 물리엔진의 두 재질을 만들고 두 재질의 마찰력과 반발력을 설정한다.
const defaultContactMaterial = new CANNON.ContactMaterial(
	cm1.defaultMaterial,
	cm1.defaultMaterial,
	{
		friction: 0.3, // 마찰력
		restitution: 0.2 // 반발력
	}
);
// 유리와 기본 재질의 마찰력과 반발력을 설정한다.
const glassDefaultContactMaterial = new CANNON.ContactMaterial(
	cm1.glassMaterial,
	cm1.defaultMaterial,
	{
		friction: 1, // 마찰력
		restitution: 0 // 반발력
	}
);
// 플레이어와 유리 재질의 마찰력과 반발력을 설정한다.
const playerGlassContactMaterial = new CANNON.ContactMaterial(
	cm1.playerMaterial,
	cm1.glassMaterial,
	{
		friction: 1, // 마찰력
		restitution: 0 // 반발력
	}
);
// world.defaultContactMaterial은 물리엔진의 기본 재질이다.
cm1.world.defaultContactMaterial = defaultContactMaterial;
// 물리엔진의 기본 재질과 유리 재질의 마찰력과 반발력을 설정한 성질을 추가한다.
cm1.world.addContactMaterial(glassDefaultContactMaterial);
// 물리엔진의 기본 재질과 플레이어 재질의 마찰력과 반발력을 설정한 성질을 추가한다.
cm1.world.addContactMaterial(playerGlassContactMaterial);

// 물체 만들기
const glassUnitSize = 1.2;
const numberOfGlass = 10; // 유리판의 개수
const objects = []; // 물리엔진에 추가할 물체들을 담을 배열

// 바닥
const floor = new Floor({
	name: 'floor',
});

// 기둥
const pillar1 = new Pillar({
	name: 'pillar',
	x: 0,
	y: 5.5,
	z: -glassUnitSize * 12 - glassUnitSize/2,
});
const pillar2 = new Pillar({
	name: 'pillar',
	x: 0,
	y: 5.5,
	z: glassUnitSize * 12 + glassUnitSize/2,
});
objects.push(pillar1, pillar2); // 물리엔진에 추가할 물체들을 담는다.

// 바
const bar1 = new Bar({ name: 'bar',x: -1.6,y: 10.3,z: 0 });
const bar2 = new Bar({ name: 'bar',x: -0.4,y: 10.3,z: 0 });
const bar3 = new Bar({ name: 'bar',x: 0.4,y: 10.3,z: 0 });
const bar4 = new Bar({ name: 'bar',x: 1.6,y: 10.3,z: 0 });


const sideLights = [];
// 사이드 라이트(바에 부착된 작은 구체) bar.mesh에 추가
for(let i = 0; i < 49; i++){
	sideLights.push(new SideLight({ 
		name: 'sideLight', 
		container: bar1.mesh, 
		z: i * 0.5 - glassUnitSize * 10
	}));
}
for(let i = 0; i < 49; i++){
	sideLights.push(new SideLight({ 
		name: 'sideLight', 
		container: bar4.mesh, 
		z: i * 0.5 - glassUnitSize * 10
	}));
}

// 유리판
let glassTypeNumber = 0;
let glassTypes = [];
const glassZ = [];
for (let i = 0; i < numberOfGlass; i++) {
	glassZ.push(-(i * glassUnitSize * 2 - glassUnitSize * 9));
}
for (let i = 0; i < numberOfGlass; i++) {
	// Math.raondom()은 0~1 사이의 난수를 반환한다.
	// Math.round(Math.random())는 소수점 이하를 반올림한다
	// 0.5 이하면 0, 0.5 초과면 1을 반환한다.
	glassTypeNumber = Math.round(Math.random());
	switch(glassTypeNumber){
		case 0:
			glassTypes = ['normal', 'strong'];
			break;
		case 1:
			glassTypes = ['strong', 'normal'];
			break;
	}

	const glass1 = new Glass({
		step: i + 1,
		name: `glass-${glassTypes[0]}`,
		x: -1,
		y: 10.5,
		z: glassZ[i],
		type: glassTypes[0],
		cannonMaterial: cm1.glassMaterial
	});
	const glass2 = new Glass({
		step: i + 1,
		name: `glass-${glassTypes[1]}`,
		x: 1,
		y: 10.5,
		z: glassZ[i],
		type: glassTypes[1],
		cannonMaterial: cm1.glassMaterial
	});

	objects.push(glass1, glass2); // 물리엔진에 추가할 물체들을 담는다.
}

// 플레이어 Player
const player = new Player({
	name: 'player',
	x: 0,
	y: 10.9,
	z: 13,
	rotationY: Math.PI,
	cannonMaterial: cm1.playerMaterial,
	mass: 30
});
objects.push(player); // 물리엔진에 추가할 물체들을 담는다.

// Raycaster를 이용한 클릭처리
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
// let intersectObject;
// let intersectObjectName;
function checkIntersects(){
	raycaster.setFromCamera(mouse, camera);

	const intersects = raycaster.intersectObjects(cm1.scene.children);
	for (const item of intersects) {
		// intersectObject = item.object;
		// intersectObjectName = item.object.name;
		// console.log(item.object.step);
		checkClickedObject(item.object);
		break; // 가장 가까운 물체정보 하나만 가져오면 되므로 반복문을 빠져나온다.
	}
}

let fail = false;
let jumping = false;
let onReplay = false;
function checkClickedObject(mesh) {
	// console.log(mesh.indexOf('glass')); 
	// 해당하면 0이상 왜냐하면 인덱스번호 이므로, 해당하지 않으면 -1
	if(mesh.name.indexOf('glass') >= 0){
		// 유리판을 클릭했을 때
		// 점프중이거나 실패하면 클릭처리를 못하게 한다.
		if(jumping || fail) return; 

		if(mesh.step - 1 === cm2.step){
			player.actions[2].stop(); // jump 애니메이션을 중지한다.
			player.actions[2].play(); // jump 애니메이션을 실행한다.
			jumping = true;
			cm2.step++;
			console.log(cm2.step);

			switch(mesh.type){
				case 'normal':
					console.log('normal');
					const timerId = setTimeout(() => {
						fail = true;
						player.actions[0].stop(); // default 애니메이션을 중지한다.
						player.actions[1].play(); // fall 애니메이션을 실행한다.
						sideLights.forEach(item => {
							item.turnOff();
						});
						// 플레이어가 떨어지고 난 후 2000후 camera2로 전환한다.
						const timerId2 = setTimeout(() => {
							onReplay = true;
							// camera2관점에서 떨어지는 플레이어를 포착할 수 있도록 떨어지는 시점에서 플레이어를 적당한 높이에 다시 위치시켜준다.
							player.cannonBody.position.y = 9;

							// camera2관점으로 잠시 있다가 다시 원래대로 camera 돌아온다.
							const timerId3 = setTimeout(() => {
								onReplay = false;
							},3000);
						}, 2000);
					}, 700);
					break;
				case 'strong':
					console.log('strong');
					break;
			}

			const timerId = setTimeout(() => {
				jumping = false;
			}, 1000);

			gsap.to(
				player.cannonBody.position,
				{
					duration: 1,
					x: mesh.position.x,
					z: glassZ[cm2.step - 1]
				}
			);
			gsap.to(
				player.cannonBody.position,
				{
					duration: 0.4,
					y: 12
				}
			);

			//클리어
			if(cm2.step === numberOfGlass && mesh.type === 'strong'){
				const timerId = setTimeout(() => {
					player.actions[2].stop(); // jump 애니메이션을 중지한다.
					player.actions[2].play(); // success 애니메이션을 실행한다.
	
					gsap.to(
						player.cannonBody.position,
						{
							duration: 1,
							x: 0,
							z: -14
						}
					);
					gsap.to(
						player.cannonBody.position,
						{
							duration: 0.4,
							y: 12
						}
					);
				}, 1500);
			}
		}
	}
}

// 그리기
const clock = new THREE.Clock();

function draw() {
	const delta = clock.getDelta();

	if(cm1.mixer) cm1.mixer.update(delta);

	cm1.world.step(1 / 60, delta, 3); // 물리엔진을 업데이트한다.인수는 (시간, 델타, 반복횟수)
	objects.forEach(item => {
		if(item.cannonBody){
			// player의 경우 회전값을 적용하지 않아야 점프한 후에 넘어지지 않는다.
			if(item.modelMesh){
				if(item.name === 'player'){
					if(item.modelMesh){
						item.modelMesh.position.copy(item.cannonBody.position);
						if(fail) item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
					}
					item.modelMesh.position.y += 0.15;
				} else {
					item.mesh.position.copy(item.cannonBody.position);
					item.mesh.quaternion.copy(item.cannonBody.quaternion);
					
					if(item.modelMesh){
						item.modelMesh.position.copy(item.cannonBody.position);
						item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
					}
				}

			}
		}
	});

	controls.update();

	if(!onReplay){
		renderer.render(cm1.scene, camera);
	} else {
		renderer.render(cm1.scene, camera2);
		// camera2가 떨어지는 플레이어를 포착할 수 있도록 떨어지는 위치를 따라다니게 한다.
		camera2.position.x = player.cannonBody.position.x;
		camera2.position.z = player.cannonBody.position.z;
	}
	renderer.setAnimationLoop(draw);
}

function setSize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.render(cm1.scene, camera);
}

// 이벤트
const preventDragClick = new PreventDragClick(canvas);
window.addEventListener('resize', setSize);
canvas.addEventListener('click', e => {
	if(preventDragClick.mouseMoved) return;
	mouse.x = e.clientX / canvas.clientWidth * 2 - 1;
	mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1);
	checkIntersects();
});

draw();
