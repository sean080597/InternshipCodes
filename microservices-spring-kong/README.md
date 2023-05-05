# Spring Boot Microservices

This repository contains the latest source code of the spring-boot-microservices & Kong Konga.

You can follow the tutorial here
- https://dev.to/vousmeevoyez/setup-kong-konga-part-2-dan
- https://viblo.asia/p/huong-dan-su-dung-hoi-chi-tiet-kong-api-gateway-de-can-bang-tai-va-dieu-huong-requests-trong-he-thong-microservices-bJzKmwqOl9N

## How to run the application using Docker

1. Go to `mockapi.io` to create some API endpoint. Ex: users, products
2. Run `docker-compose up -d` to start the applications.

## How to configure Kong via Konga
1. Setup first login:
- `ERR`: Oh snap! Can't connect to ??? konga
- `Cause`: konga need to use ip address
- `Solution`: Use IP address or container name e.g. http://192.168.121.92:8001 or http://kong:8001

1. Create a `Upstream` with name `mock-server`
2. Edit the Upstream:
- Add target (e.g. 645379d3c18adbbdfe9e3eba.mockapi.io:80)
3. Create a `Service`:
	`Name`: product-service
	`Description`: CRUD product
	`Protocol`: http
	`Host`: mock-server
	`Port`: 80
	`Path`: /
4. Edit the Service:
- Add route:
	`Name`: products
	`Paths`: /products
	`Methods`: GET, POST, PUT, DELETE
	`Strip Path`: Yes/No
