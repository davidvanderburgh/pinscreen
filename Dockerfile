FROM alpine:latest

ADD . .

RUN apk add --update nodejs npm
RUN apk add --update npm
RUN set -eux & apk add --no-cache yarn
RUN npm install next react react-dom --legacy-peer-deps

RUN yarn build

CMD ["yarn", "start"]