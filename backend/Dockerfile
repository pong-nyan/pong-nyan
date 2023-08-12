# backend/Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install
#RUN npm cache clean --force

EXPOSE 4242

ENTRYPOINT [ "npm", "run", "dev"]
