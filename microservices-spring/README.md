# Spring Boot Microservices

This repository contains the latest source code of the spring-boot-microservices tutorial

You can watch the tutorial on Youtube here - https://www.youtube.com/watch?v=mPPhcU7oWDU&t=20634s

## How to run the application using Docker

1. Run `mvn clean package -DskipTests` to build the applications and create the docker image locally.
2. Run `docker-compose up -d` to start the applications.

## How to run the application without Docker

1. Run `docker run -it -p 27017:27017 -v %cd%/data/db:/data/db mongo:4.4` to start mongoDB Docker.
2. Start MySQL DB: `shopii-order`, `shopii-inventory` by Xampp or something else.
2. Run `mvn clean verify -DskipTests` by going inside each folder to build the applications.
3. After that run `mvn spring-boot:run` by going inside each folder to start the applications.
