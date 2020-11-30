FROM node:10.23-alpine

WORKDIR /mcc-server
ADD package.json ./package.json
ADD yarn.lock ./yarn.lock
RUN yarn install

ADD . /mcc-server
RUN yarn build

CMD  ["yarn", "start"]
