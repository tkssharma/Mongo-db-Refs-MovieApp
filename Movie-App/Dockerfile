FROM ubuntu:xenial
MAINTAINER Alex Oberhauser, alex@cambridge-blockchain.com

ENV DEBIAN_FRONTEND noninteractive

RUN gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927

RUN echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list
RUN apt-get update
RUN apt-get install -y mongodb-org
RUN apt-get install -y redis-server

RUN apt-get install -qq -y python-software-properties curl
RUN curl -sL https://deb.nodesource.com/setup_7.x | /bin/bash -
RUN apt-get install -qq -y nodejs

COPY start/start_mongo /bin/start_mongo
COPY start/start_redis /bin/start_redis
COPY start/start /bin/start

COPY setup/mongo.sh /tmp/setup_mongo.sh
RUN /tmp/setup_mongo.sh; rm /tmp/setup_mongo.sh

# MongoDB Port
EXPOSE 27017

# Redis Port
EXPOSE 6379

ENTRYPOINT [ 'start' ]
