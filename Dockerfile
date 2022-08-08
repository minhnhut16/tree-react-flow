FROM node:14.19.0-alpine as base

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install
COPY . .
CMD ["yarn", "start"]