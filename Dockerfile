FROM node:16.15.0

RUN mkdir -p /var/www/selfie-file-uploader
WORKDIR /var/www/selfie-file-uploader

COPY package*.json ./
RUN yarn

COPY . .

EXPOSE 3045

CMD [ "yarn", "start" ]
