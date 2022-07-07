FROM node:17.5.0 as builder
# Create a Virtual directory inside the docker image
WORKDIR /app
ARG APP_ENV
# ARG APP_NAME
# COPY package.json ./
# RUN npm i
RUN npm cache clean --force
COPY . .
RUN  echo $APP_ENV && npm install --force && npm run build -- --c $APP_ENV --aot

FROM public.ecr.aws/u8p9s2f7/docker-nginx-alpine-brotli
RUN rm -rf /usr/share/nginx/html/*
# Compress
RUN echo $'gzip on; \n\
gzip_proxied any; \n\
gzip_types text/plain text/xml text/css application/x-javascript; \n\
gzip_vary on; \n\
gzip_disable "MSIE [1-6]\.(?!.*SV1)";' > /etc/nginx/conf.d/gzip.conf
# Config for SAP app
RUN echo $'server { \n\
   listen       80; \n\
   server_name  localhost; \n\
   location / { \n\
       root  /usr/share/nginx/html; \n\
       index  index.html index.htm; \n\
       try_files $uri $uri/ /index.html; \n\
       proxy_set_header X-Real-IP $remote_addr; \n\
       proxy_set_header X-Forwarded-For $http_x_forwarded_for; \n\
   } \n\
   error_page   500 502 503 504  /50x.html; \n\
   location = /50x.html { \n\
       root   /usr/share/nginx/html; \n\
   } \n\
}' > /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/
COPY --from=builder /app/dist/advertising-server /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
