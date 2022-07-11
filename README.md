# Noom

Zoom Clone using NodeJS WebRTC and Websockets.


#
* Nodemon은 프로젝트를 살펴보고 변경사항이 있을때, 서버를 재시작해줌.
* 서버를 재시작할때 babel-node를 실행하면 NodeJS코드로 컴파일해줌.
  * "exec": "babel-node src/server.js"
* server.js 파일은 express를 import하고, 뷰 엔진을 설정하며, 뷰 디렉토리를 설정한다.
* /public 파일은 프론트에서 구동되는 코드 app.js // server.js로 구분한다.
* babel-node를 실행시키면 babel.config.json을 찾는다. 그리고 거기에 preset을 실행시킨다.