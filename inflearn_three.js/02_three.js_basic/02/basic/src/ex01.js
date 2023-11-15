import * as THREE from 'three'

// ---- 주제 : 기본 장면

export default function example() {
    // 동적으로 캔버스 조립하기
    // const renderer = new THREE.WebGLRenderer();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement);

    const canvas = document.querySelector('#three-canvas');
    // const renderer = new THREE.WebGLRenderer({ canvas: canvas }); //아래와 같은 의미
    const renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.background = '#000000';
    // renderer.domElement.style.margin = '0';
    // renderer.domElement.style.padding = '0';


    // 장면(Scene) 만들기
    const scene = new THREE.Scene();

    // 원근 카메라(Perspective Camera) 만들기(시야각, 종횡비, 가까운 면, 먼 면)
    // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // camera.position.x = 1;
    // camera.position.y = 2;
    // camera.position.z = 5;
    // scene.add(camera);

    // 직교 카메라(Orthographic Camera) 만들기(좌, 우, 상, 하, 가까운 면, 먼 면)
    // const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    const camera = new THREE.OrthographicCamera(-(window.innerWidth / window.innerHeight),window.innerWidth / window.innerHeight,1,-1,0.1,1000);
    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5;
    camera.lookAt(0, 0, 0);
    camera.zoom = 0.5;
    camera.updateProjectionMatrix();
    scene.add(camera);

    // Mesh 만들기
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ 
        // color: 0x00ff00 
        color: '#ff0000'
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 렌더링
    renderer.render(scene, camera);
}
