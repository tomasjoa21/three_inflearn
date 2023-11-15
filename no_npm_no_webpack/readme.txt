######################################################################
################ npm사용하지 않고, 모듈을 사용하는 방법 #######################
######################################################################
1. npm, webpack을 사용하지 않고 three.js를 사용하는 방법
src/index.html 을 아래와 같이 기술하자
<script src="main.js" type="module"></script> 
위와 같이 main.js를 인쿠르드하고 type을 module이라 지정한다.
---------------------------------------------------------
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
	<link rel="stylesheet" href="./main.css">
</head>
<body>
	<canvas id="three-canvas"></canvas>
	<script src="main.js" type="module"></script>
</body>
</html>
---------------------------------------------------------

2. threejs.org에서 three.js-master를 다운로드하자
필요한 것만 src폴더안에 복사하자 (1,2는 필요파일이고, 3은 필요에 따라 추가하는 파일)
1) three.js-master/build/three.min.js
2) three.js-master/build/three.module.min.js
3) three.js-master/examples/jsm/controls/OrbitControls.js


3. src/main.js파일에서 아래와 같이 기존의 모듈방식을 아래와 같이 수정하자
- 기존 모듈방식(수정하기전)
----------------------------------------------------------
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function example() {
    .........
    .........
}
----------------------------------------------------------

- 수정한 방식
----------------------------------------------------------
import * as THREE from './three.module.min.js';
import { OrbitControls } from './OrbitControls.js';
// export default function example(){ export default 함수는 필요없다.
    함수안에 있는 소스는 함수 밖으로 빼내어 서술하자
// }
----------------------------------------------------------

4. 필요에 따라 임포트 하는 src/OrbitControls.js안에 three를 임포트 서술 수정
(다른 모듈도 동일한 방법으로 수정하면 된다.)
 - 수정하기전
-----------------------------------------------------------
import {
    EventDispatcher,
    MOUSE,
    Quaternion,
    Spherical,
    TOUCH,
    Vector2,
    Vector3
} from 'three';
-----------------------------------------------------------
- 수정후
-----------------------------------------------------------
import {
    EventDispatcher,
    MOUSE,
    Quaternion,
    Spherical,
    TOUCH,
    Vector2,
    Vector3
} from './three.module.min.js';
-----------------------------------------------------------
