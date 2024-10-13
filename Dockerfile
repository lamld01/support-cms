# install stage
FROM node:16-alpine as install-stage
WORKDIR /app
COPY ./package.json /app/
COPY ./package-lock.json /app/
COPY ./yarn.lock /app/
COPY ./tsconfig.json /app/tsconfig.json
COPY ./tsconfig.node.json /app/tsconfig.node.json
COPY ./tailwind.config.js /app/tailwind.config.js
RUN yarn install

# build stage
FROM install-stage as build-stage
WORKDIR /app
COPY ./src /app/src
COPY ./public /app/public
COPY ./types /app/types
RUN yarn build

# production stage
FROM nginx:1.17-alpine as production-stage
COPY --from=build-stage /dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
