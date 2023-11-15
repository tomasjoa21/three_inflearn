export class PreventDragClick {
    constructor(elem) {
        // 클릭의 목적이 아닌 마우스의 움직임을 감지해서 클릭의 예외처리를 할 때 사용
        this.mouseMoved; // 마우스를 드래그 했는지 확인하는 변수 true/false
        let clickStartX;
        let clickStartY;
        let clickStartTime; // 마우스다운부터 마우스업까지의 시간
        elem.addEventListener('mousedown', e => {
            clickStartX = e.clientX;
            clickStartY = e.clientY;
            clickStartTime = Date.now();
        });
        elem.addEventListener('mouseup', e => {
            const xGap = Math.abs(e.clientX - clickStartX);
            const yGap = Math.abs(e.clientY - clickStartY);
            const timeGap = Date.now() - clickStartTime;
            // console.log(xGap, yGap);
            // 처음 마우스다운시의 x or y좌표와 마우스업시의 x or y좌표의 차이가 5px이하일 경우 클릭으로 간주
            // 마우스다운부터 마우스업까지의 시간이 500ms이하일 경우 클릭으로 간주
            if(xGap > 5 || yGap > 5 || timeGap > 500){
                this.mouseMoved = true;
            }else{
                this.mouseMoved = false;
            }
        });
    }
}


