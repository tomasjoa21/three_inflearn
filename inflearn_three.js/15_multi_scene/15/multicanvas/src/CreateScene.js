import {
    Scene,
    PerspectiveCamera,
    Color
} from 'three';

export class CreateScene {
    constructor(info) {
        this.renderer = info.renderer;
        this.elem = document.querySelector(info.placeholder);
        // getBoundingClientRect() 메서드는 요소의 크기와 뷰포트에 대한 상대적인 위치를 반환합니다.
        //bottom,height,width,left,right,top,x,y
        const rect = this.elem.getBoundingClientRect();
        // console.log(rect);
        // 배경색 기본값: 흰색
        const bgColor = info.bgColor || 'white';
        // 카메라 시야각 기본값: 75
        const fov = info.fov || 75;
        // 카메라 화면 비율은 요소의 가로세로 비율과 같게 설정 
        const aspect = rect.width / rect.height;
        // 카메라의 가까운 면 기본값: 0.1
        const near = info.near || 0.1;
        // 카메라의 먼 면 기본값: 1000
        const far = info.far || 1000;
        // 카메라의 위치
        const cameraPosition = info.cameraPosition || { x: 0, y: 0, z: 3 };

        // Scene
        this.scene = new Scene();
        this.scene.background = new Color(bgColor);

        // Camera
        this.camera = new PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.x = cameraPosition.x;
        this.camera.position.y = cameraPosition.y;
        this.camera.position.z = cameraPosition.z;

        this.scene.add(this.camera);
    }
}