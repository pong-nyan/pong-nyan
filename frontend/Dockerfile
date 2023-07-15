FROM node:18.16.1

COPY *.json .

COPY next*[.ts|.js] .

COPY ./src ./src

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]