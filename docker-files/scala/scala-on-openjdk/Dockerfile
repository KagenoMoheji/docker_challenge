FROM openjdk:11
# RUN java -version

RUN apt-get update && \
    apt-get install scala -y
ARG SCALA_HOME=/usr/bin/scala
ENV SCALA_HOME ${SCALA_HOME}
ENV PATH ${SCALA_HOME}/bin:$PATH
RUN scala -version

RUN apt-get update && \
    apt-get install apt-transport-https
RUN apt-get update && \
    echo "deb https://dl.bintray.com/sbt/debian /" | tee -a /etc/apt/sources.list.d/sbt.list
RUN curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x2EE0EA64E40A89B84B2DF73499E82A75642AC823" | apt-key add

RUN apt-get update && \
    apt-get install sbt

# ENV APP_HOME /app/
# WORKDIR ${APP_HOME}
# COPY . ${APP_HOME}
