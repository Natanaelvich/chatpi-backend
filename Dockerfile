FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .


EXPOSE 3334

CMD ["npm","start"]

ENTRYPOINT [ "./init.sh" ]
