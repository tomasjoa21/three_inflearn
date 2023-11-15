import * as THREE from 'three'

// ---- 주제 : 빛 설정

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
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // console.log(window.devicePixelRatio);
    // 디스플레이의 해상도에 따라 렌더링 해상도를 조정합니다.
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    // renderer.setClearColor(0x00ff00);
    // renderer.setClearColor('#00ff00');
    // renderer.setClearColor(0x00ff00, 0.5);
    // renderer.setClearAlpha(0.5);
    // renderer.domElement.style.background = '#000000';
    // renderer.domElement.style.margin = '0';
    // renderer.domElement.style.padding = '0';


    // 장면(Scene) 만들기
    const scene = new THREE.Scene();
    // 장면에 배경색을 설정할 수 있습니다. 그렇게 되면 renderer의 배경색은 무시됩니다. 투명도는 지원하지 않습니다.
    // scene.background = new THREE.Color(0x0000ff); //또는 '0x0000ff'

    // 원근 카메라(Perspective Camera) 만들기(시야각, 종횡비, 가까운 면, 먼 면)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 2;
    camera.position.y = 2;
    camera.position.z = 5;
    scene.add(camera);

    //light 라이트 추가 : 인수(색상, 강도)
    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.x = 2;
    light.position.z = 5;
    scene.add(light);

    // Mesh 만들기
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    /*
    MeshBasicMaterial : 빛에 반응하지 않는 재질
    const material = new THREE.MeshBasicMaterial({ 
        // color: 0x00ff00 
        color: '#ff0000'
    });
    */
    // MeshStandardMaterial : 빛에 반응하는 재질
    const material = new THREE.MeshStandardMaterial({ 
        // color: 0x00ff00 
        color: '#ff0000'
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 렌더링
    renderer.render(scene, camera);

    function setSize() {
        //카메라
        camera.aspect = window.innerWidth / window.innerHeight;
        // updateProjectionMatrix() 메서드는 카메라의 속성이 변경되었음을 three.js에 알려줍니다.
        camera.updateProjectionMatrix();
        // 렌더러
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }

    // 이벤트
    window.addEventListener('resize', setSize);
}
