# Spring Boot Migration Demo

Follow this guideline to set up the backend project on your local machine.

## 1. Install MySQL

At the root folder, run MySQL in a Docker container with the following configuration:

- MySQL Version: 5.7.42
- Database Name: springboot-reactive
- Username: root
- Password: root
- Root Password: root
- Port: 3306

```bash
docker run -d -it -v %cd%/data:/var/lib/mysql -e MYSQL_DATABASE=springboot-reactive -e MYSQL_USER=root -e MYSQL_PASSWORD=root -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 mysql:8.2.0 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
```

## 2. Install RabbitMQ

Pull the image:

```bash
docker pull rabbitmq:3.10-management
```

- Username (default): guest
- Password (default): guest
- Port: 5672 for the RabbitMQ
- Port: 15672 for the RabbitMQ management website

Run the image:

```bash
docker run -d -it -p 15672:15672 -p 5672:5672 rabbitmq:3.10-management
```
