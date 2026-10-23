FROM node:24-alpine AS build

ARG TRUST_ORIGIN

WORKDIR /app

COPY . .

RUN  yarn --frozen-lockfile \
  && TRUST_ORIGIN=$TRUST_ORIGIN yarn build


FROM node:24-alpine

ARG TRUST_ORIGIN
ENV TRUST_ORIGIN=$TRUST_ORIGIN

WORKDIR /app

COPY --from=build /app/dist .

RUN chmod -R 777 /app

CMD ["node", "index.js"]
