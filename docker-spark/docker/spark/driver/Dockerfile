########################################################################################
# ホストのディレクトリパスについて，docker-compose.ymlからの相対パスであることに注意！
########################################################################################
FROM ubuntu:latest

# docker-compose.ymlから.envの変数受け取り
ARG JAVA_VERSION
ARG SPARK_VERSION
ARG HADOOP_VERSION
ARG PYTHON_VERSION

# ---------------------------------------------------------------------------
# gitのインストールでtzdataがインストールされて止まってしまう対策．
# https://qiita.com/yagince/items/deba267f789604643bab
# ENV DEBIAN_FRONTEND=noninteractive
# ---------------------------------------------------------------------------

RUN \
    # 必要なパッケージのインストール
    apt-get update \
    && apt-get install -y \
        wget \
    #     vim \
    #     git \
    # Javaのインストール
    && apt-get install openjdk-${JAVA_VERSION}-jdk -y
ENV JAVA_HOME /usr/lib/jvm/java-${JAVA_VERSION}-openjdk-amd64
ENV PATH ${JAVA_HOME}/bin:$PATH

RUN \
    # Javaの環境変数が登録されているか確認
    # printenv && \
    # Sparkのインストール
    # https://ftp.cc.uoc.gr/mirrors/apache/spark/
    wget -q https://ftp.cc.uoc.gr/mirrors/apache/spark/spark-${SPARK_VERSION}/spark-${SPARK_VERSION}-bin-hadoop${HADOOP_VERSION}.tgz \
    && tar xzf spark-${SPARK_VERSION}-bin-hadoop${HADOOP_VERSION}.tgz \
    && rm spark-${SPARK_VERSION}-bin-hadoop${HADOOP_VERSION}.tgz \
    && mv spark-${SPARK_VERSION}-bin-hadoop${HADOOP_VERSION} /spark

# EXPOSE 8080
    

