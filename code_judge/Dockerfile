FROM node:13.12.0-alpine
WORKDIR /usr/src/app

# install dependencies
COPY package*json ./
RUN npm install

# copy app
COPY . .
CMD npm start
