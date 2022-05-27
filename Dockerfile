FROM node:14
# Working Directory
WORKDIR /usr/src/app
# package.json Copy
COPY ./package*.json ./ 
# npm install
RUN npm install
# Local File Copy
COPY ./ ./ 
CMD ["npm","run", "start"]

# FROM nginx 

# EXPOSE 3001
# 로컬에 있는 default.conf 파일을 도커 /etc/nginx/conf.d/defalut.conf로 복사
# COPY ./defalut.conf /etc/nginx/conf.d/default.conf 
# 위에서 생성한 build 파일을 /usr/share/nginx/html로 복사
# COPY --from=builder /usr/src/app/build  /usr/share/nginx/html 

# Build Command
# docker build -t weboni83/node-app ./

# Docker Run
# docker run -it -p 3000:3000 weboni83/node-app