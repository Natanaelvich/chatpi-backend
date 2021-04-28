FROM node:12

WORKDIR /usr/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3335

CMD [ "npm","run","dev" ]
