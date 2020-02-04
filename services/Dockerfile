FROM node:13.7.0-alpine3.11

WORKDIR /usr/app

COPY package.json .
RUN npm install --quiet

COPY . .