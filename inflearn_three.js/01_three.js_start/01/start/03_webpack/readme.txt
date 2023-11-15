깃허브 webpack자료실
https://github.com/jmyoow/webpack-js-html


1. 패키지 설치
터미널에 아래 점선 사이의 내용을 붙여 넣고 엔터를 누르세요.
----------
# npm i -D @babel/cli @babel/core @babel/preset-env babel-loader clean-webpack-plugin copy-webpack-plugin core-js cross-env html-webpack-plugin source-map-loader terser-webpack-plugin webpack webpack-cli webpack-dev-server
----------
threejs설치
# npm i three
----------

2. 개발용 서버 구동
터미널에 아래 점선 사이의 내용을 붙여 넣고 엔터를 누르세요.
----------
# npm start
----------
package.json에서 아래와 같이 미리 정의 되어 있어야 한다.
"scripts": {
    ....,
    "start": "webpack serve --progress"
},

3. 빌드(배포용 파일 생성)
터미널에 아래 점선 사이의 내용을 붙여 넣고 엔터를 누르세요.
----------
# npm run build
----------
package.json에서 아래와 같이 미리 정의 되어 있어야 한다.
"scripts": {
    "build": "cross-env NODE_ENV=production webpack --progress",
    .....
},
-----------
npm run build 를 실행하면 루트 위치에 배포버전의 파일들이 들어있는 dist라는 폴더가 생성된다.
이 폴더만 서버에 설치하면 three.js로 개발한 내용들이 그대로 구현된다.


(!)
npm start 또는 npm run build 실행 시 에러가 난다면 Node.js를 LTS 버전(장기 지원 버전)으로 설치 후 다시 시도해 보세요.
터미널에 아래 점선 사이의 내용을 붙여 넣고 엔터를 누르면 설치할 수 있어요.
----------
n lts
----------

(!)
ERROR in unable to locate '경로...'
위와 같은 에러가 발생한다면, webpack.config.js의 CopyWebpackPlugin에 설정된 파일이 있는지 확인해주세요.
CSS나 이미지 폴더 등이 필요하지 않다면 webpack.config.js에서 CopyWebpackPlugin 부분 전체를 주석 처리 해주세요.
