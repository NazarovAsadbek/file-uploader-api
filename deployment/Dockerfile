FROM node:16.15.0

RUN mkdir -p /var/www/dockerize-nuxt/selfie-file-uploader-node-app
WORKDIR /var/www/dockerize-nuxt/selfie-file-uploader-node-app

COPY crm-file-service/package*.json ./
RUN yarn

COPY crm-file-service/. .

EXPOSE 3045

CMD [ "yarn", "start" ]
