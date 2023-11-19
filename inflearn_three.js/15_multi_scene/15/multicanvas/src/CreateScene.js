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

        this.meshes = [];
    }

    set(func){
        func();
    }

    render(){
        const renderer = this.renderer;
        // 스크롤시 실시간으로 요소의 크기와 위치정보를 가져와야 한다.
        const rect = this.elem.getBoundingClientRect();
        // 좌우 스크롤후 화면에서 사라지면 더이상 랜더링 할 필요가 없다.
        if(
            rect.top > renderer.domElement.clientHeight ||
            rect.bottom < 0 || 
            rect.left > renderer.domElement.clientWidth ||
            rect.right < 0
        ){
            return;
        }

        // 화면사이즈가 변경되면 각 화면 모델의 비율도 변경되게 하기 위해 각 화면의 비율을 계산한다.
        this.camera.aspect = rect.width / rect.height;
        // 비율을 다시 계산했으므로 updateProjectionMatrix() 메서드를 호출하여 변경된 비율을 적용한다.
        this.camera.updateProjectionMatrix();

        // canvasBottom: 캔버스의 하단에서 요소의 하단까지의 거리
        const canvasBottom = renderer.domElement.clientHeight - rect.bottom;
        // setScissor(left, bottom, width, height) 함수는 뷰포트 내에서 영역을 지정하여 클리핑(잘라내기)하는 기능을 제공하는 함수입니다. 이 함수를 사용하면 특정 영역 내의 요소만을 렌더링할 수 있습니다.
        // bottom: 캔버스의 하단에서 요소의 하단까지의 거리
        // width: 요소의 너비
        // height: 요소의 높이
        renderer.setScissor(rect.left, canvasBottom, rect.width, rect.height);
        // setViewport(left, bottom, width, height) 함수는 뷰포트의 크기와 위치를 설정하는 기능을 제공하는 함수입니다. 이 함수를 사용하여 뷰포트를 조정하면 원하는 영역에 대해 렌더링할 수 있습니다.
        // left: 뷰포트의 왼쪽에서 요소의 왼쪽까지의 거리
        // bottom: 뷰포트의 하단에서 요소의 하단까지의 거리
        // width: 요소의 너비
        // height: 요소의 높이
        renderer.setViewport(rect.left, canvasBottom, rect.width, rect.height);
        // setScissorTest(boolean) 메서드는 캔버스의 위에서의 설정을 적용할지 여부를 설정한다. 이 함수는 셋트로 항상 사용한다.
        renderer.setScissorTest(true);

        renderer.render(this.scene, this.camera);
    }
}