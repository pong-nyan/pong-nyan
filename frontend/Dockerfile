FROM node:18.16.1

WORKDIR /usr/src/app

COPY *.json .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]