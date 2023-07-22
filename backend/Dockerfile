FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

EXPOSE 4242

CMD [ "npm", "run", "dev", "echo","🚀 server is running 🚀"]