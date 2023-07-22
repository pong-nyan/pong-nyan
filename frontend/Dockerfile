FROM node:18.16.1

WORKDIR /usr/src/app

COPY *.json .

RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "dev" ]