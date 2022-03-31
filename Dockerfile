FROM node:14-alpine

WORKDIR /usr
COPY package*.json ./
RUN npm install --only=production
COPY ./src ./
COPY ./.env ./
CMD npm start