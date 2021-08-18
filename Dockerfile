FROM node:12-alpine

WORKDIR /load_balancer

COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 1000

CMD [ "npm", "start" ]