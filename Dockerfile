FROM node:14.19.0-alpine as base

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install


FROM node:14.19.0-alpine as builder

WORKDIR /app
COPY . .
COPY --from=base /app/node_modules ./node_modules
RUN yarn build


# nginx state for serving content
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /app/build .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]