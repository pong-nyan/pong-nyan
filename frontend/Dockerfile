# frontend/Dockerfile
FROM node:18.16.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
#RUN npm cache clean --force

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "dev" ]
