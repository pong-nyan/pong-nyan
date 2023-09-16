# frontend/Dockerfile
FROM node:18.16.1

WORKDIR /usr/src/app

COPY package*.json ./
COPY next.config.js ./
COPY tsconfig.json ./

RUN npm install
#RUN npm cache clean --force

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "eval" ]
