FROM node:13.12.0-alpine AS build
WORKDIR /usr/src/app

# install client dependencies
COPY ./client/package*json ./client/

ENV REACT_APP_GRAPHQL_URI=https://codedueler.jorgebarreto.dev/graphql
ENV REACT_APP_GRAPHQL_WS_URI=wss://codedueler.jorgebarreto.dev/graphql

WORKDIR /usr/src/app/client
RUN npm install

COPY ./client .
RUN npm run build

FROM node:13.12.0-alpine

# copy client files
WORKDIR /usr/src/app/client
COPY --from=build /usr/src/app/client/build ./build/

WORKDIR /usr/src/app/server

# install server dependencies
COPY ./server/package*json ./
RUN npm install

# copy app
COPY ./server .
CMD ["npm", "start"]
