### Handlebars 로 서버사이드 페이지 작성하기

```bash
npm init -y
```

```bash
npm i express nodemon express-handlebars multer
```

add server.js

```bash
touch server.js
```

add mongodb

```bash
npm i mongoose
```

### 배포

#### Docker 만들기

1. Add Dockerfile
2. Docker Build

```bash
# "dockerId/projectname"
docker build -t weboni83/node-app ./
```

3. Docker hub upload
   3.1 login

```bash
docker login
username: weboni83
password:


```

3.2 upload

```bash
docker push weboni83/node-app:1.0.0

```

4. Docker hub download and run

```bash
docker run -d -p 3000:3000 weboni83/node-app:1.0.0
```

#### Docker Compose 만들기(몽고DB 같이 배포하기 위해서...)

1. docker-compose.yml 파일 추가하기

```yml
version: "3"
services:
  app:
    container_name: docker-node-mongo
    restart: always
    build: .
    ports:
      - "3000:3000"
    links:
      - mongo
  mongo:
    container_name: mongo
    image: mongo
    ports:
      - "27017:27017"
```

2. .dockerignore 파일 추가하기

```
node_modules
```

3. docker compose 실행

```bash
#실행
docker compose up -d
#종료
docker compose down
```

### babel 설치하고 배포용으로 build 하기

1. babel 설치

```bash
#npm i -D @babel/core @babel/cli
#or
npm install --save-dev @babel/core @babel/node @babel/preset-env @babel/cli

```

2. babel.config.json 추가

```
{
  "presets": ["@babel/preset-env"]
}

```

3. package.json 에 build command 추가하기

```json
"script":{
    "build": "babel src -d build",
    "start": "nodemon server.js --exec babel-node"
}

```

#### view, css, fonts 등 복사되지 않는 파일은 cpx package를 설치해서 복사하도록 설정하기

```bash
npm i -D cpx
```

```json
"script":{
    "build": "babel src -d build && cpx \"./src/views/**/*\" ./build/views --clean && cpx \"./src/public/**/*\" ./build/public --clean",
    "start": "npm run build && nodemon build/server.js
}
```

#### dockerfile nginx 실행

```dockerfile

# FROM nginx
# EXPOSE 3000
# 로컬에 있는 default.conf 파일을 도커 /etc/nginx/conf.d/defalut.conf로 복사
# COPY ./defalut.conf /etc/nginx/conf.d/default.conf
# 위에서 생성한 build 파일을 /usr/share/nginx/html로 복사
# COPY --from=builder /usr/src/app/build  /usr/share/nginx/html

```
