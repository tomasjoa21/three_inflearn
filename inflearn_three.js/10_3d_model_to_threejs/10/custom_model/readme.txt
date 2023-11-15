1. 패키지 설치
터미널에 아래 점선 사이의 내용을 붙여 넣고 엔터를 누르세요.
----------
npm i -D @babel/cli @babel/core @babel/preset-env babel-loader clean-webpack-plugin copy-webpack-plugin core-js cross-env html-webpack-plugin source-map-loader terser-webpack-plugin webpack webpack-cli webpack-dev-server
----------
npm i three
----------

2. 개발용 서버 구동
터미널에 아래 점선 사이의 내용을 붙여 넣고 엔터를 누르세요.
----------
npm start
----------

3. 빌드(배포용 파일 생성)
터미널에 아래 점선 사이의 내용을 붙여 넣고 엔터를 누르세요.
----------
npm run build
----------

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



src > models 라는 폴더 안에 3D모델을 저장하기 때문에 
webpack.config.js에 src/models의 경로를 아래와 같이 설정해 놓아야 한다.
-------------------------------------------------------------
    CopyWebpackPlugin: 그대로 복사할 파일들을 설정하는 플러그인
    아래 patterns에 설정한 파일/폴더는 빌드 시 dist 폴더에 자동으로 생성됩니다.
    patterns에 설정한 경로에 해당 파일이 없으면 에러가 발생합니다.
    사용하는 파일이나 폴더 이름이 다르다면 변경해주세요.
    그대로 사용할 파일들이 없다면 CopyWebpackPlugin을 통째로 주석 처리 해주세요.
-------------------------------------------------------------
.....
        new CopyWebpackPlugin({
			patterns: [
				......
				{ from: "./src/models", to: "./models" },
				......
			],
		})
.....