FROM node:14.15-alpine as frontend-stage

LABEL maintainer="Cuong Luu <cuong.luusean@gmail.com>"

WORKDIR /var/www/html/frontend

COPY . .

EXPOSE 3000

RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "./entrypoint.sh" ]

# CMD yarn build && yarn start
# CMD [ "yarn", "dev" ]
