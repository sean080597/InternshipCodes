# BASE_IMAGE_NAME - Specify image name to pull. Default value: xyz-java
# BASE_IMAGE_TAG - Specify image tag to pull. Default value: openjdk-jre8-apm
# BASE_IMAGE_REPO - Specify docker repository URL to pull. Default value: 172.16.29.12/mob_shared/
ARG BASE_IMAGE_NAME=xyz-java
ARG BASE_IMAGE_TAG=temurin-jdk-21
ARG BASE_IMAGE_REPO=172.16.29.12/mob_shared/
FROM ${BASE_IMAGE_REPO}${BASE_IMAGE_NAME}:${BASE_IMAGE_TAG}

# RELEASE_VERSION - Application release version number
# BUILD_IMAGE_NAME - The name of the docker build. Default value: xyz-cardcore-ws-card-mangement
# BUILD_IMAGE_TAG - The tag of the docker build. Default value: ${RELEASE_VERSION}
ARG RELEASE_VERSION
ARG BUILD_IMAGE_NAME=xyz-cardcore-ws-card-mangement
ARG BUILD_IMAGE_TAG=${RELEASE_VERSION}

# Just for reference. Don't send email to this guy ^_^
LABEL maintainer="cuong.luusean@gmail.com"
LABEL name="${BUILD_IMAGE_NAME}"
LABEL tag="${BUILD_IMAGE_TAG}"
LABEL description="XYZ CardCore WS Card Management"

ENV APP_NAME=${BUILD_IMAGE_NAME}
ENV APP_VERSION=${RELEASE_VERSION}

COPY target/xyz.cardcore.ws.card.management-${RELEASE_VERSION}.jar /jar/xyz.cardcore.ws.card.management.jar

RUN echo ${RELEASE_VERSION} > /jar/VERSION.txt

CMD java \
	-Dserver.http.port=8080 \
	-Dserver.https.port=8443 \
	-Dredis.ip=172.16.29.28 \
	-Dredis.port=6379 \
	-Dspring.profiles.active=DEV \
	-Xms256m \
	-Xmx512m \
	-Dorg.jboss.logging.provider=slf4j \
	-Djava.security.egd=file:/dev/./urandom \
	-jar \
    /jar/xyz.cardcore.ws.card.management.jar
