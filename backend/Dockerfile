FROM node:18-alpine

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

EXPOSE 4242

CMD [ "npm", "run", "dev", "echo","🚀 server is running 🚀"]