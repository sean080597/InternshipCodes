FROM node:14.21-alpine as strapie-stage

LABEL maintainer="Cuong Luu <cuong.luusean@gmail.com>"

ENV NODE_ENV=production

WORKDIR /app

COPY . .

EXPOSE 1337

RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "./entrypoint.sh" ]
