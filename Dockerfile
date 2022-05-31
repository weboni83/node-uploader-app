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

# Build Command
# docker build -t weboni83/node-app ./

# Docker Run
# docker run -it -p 3000:3000 weboni83/node-app