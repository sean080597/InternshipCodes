FROM nginx:1.19-alpine as nginx-stage

LABEL maintainer="Cuong Luu <cuong.luusean@gmail.com>"

COPY ./entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
