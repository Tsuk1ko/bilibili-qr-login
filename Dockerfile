FROM node:20-alpine as build

WORKDIR /app

COPY . .

RUN  yarn --frozen-lockfile \
  && yarn build


FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist .

RUN chmod -R 777 /app

CMD ["node", "index.js"]
