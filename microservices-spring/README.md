# Spring Boot Microservices

This repository contains the latest source code of the spring-boot-microservices tutorial

You can watch the tutorial on Youtube here - https://www.youtube.com/watch?v=mPPhcU7oWDU&t=20634s

## How to run the application using Docker

1. Run `mvn clean package -DskipTests` to build the applications and create the docker image locally.
2. Run `docker-compose up -d` to start the applications.

## How to run the application without Docker

1. Keycloak:
- Run `docker run -p 8181:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin -v %cd%/data/keycloak:/opt/keycloak/data/h2 quay.io/keycloak/keycloak:21.1.1 start-dev` to start.
2. MongoDB Docker:
- Run `docker run -it -p 27017:27017 -v %cd%/data/db:/data/db mongo:4.4` to start.
3. Kafka & Zookeeper:
- Run `docker-compose up` to start.
4. Zipkin:
- Enable `spring.zipkin.enabled=true` to be able to use Zipkin.
- Run `docker run -p 9411:9411 openzipkin/zipkin` to start Zipkin Docker.
5. Start MySQL DB: `shopii-order`, `shopii-inventory` by Xampp or something else.
6. Run `mvn clean install -DskipTests` by going inside each folder to build the applications.
7. After that run `mvn spring-boot:run` by going inside each folder to start the applications.
