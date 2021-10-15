FROM node:14.13-alpine3.10

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY public ./public
COPY src ./src

COPY ./.env .
RUN set -o allexport; source ./.env; set +o allexport;

EXPOSE 8080
USER node
CMD ["node", "./src/bin/www"]
