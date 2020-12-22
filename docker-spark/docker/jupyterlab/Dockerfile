########################################################################################
# ホストのディレクトリパスについて，docker-compose.ymlからの相対パスであることに注意！
########################################################################################
FROM ubuntu:latest

ARG SPARK_VERSION
ARG JAVA_VERSION
ARG PYTHON_VERSION
ARG SCALA_VERTION
ARG USE_GPU
ARG SHARED_WORKSPACE_CONTAINER
ARG SHARED_WORKSPACE_HOST
ARG PYTHON_ROOT="/opt/python"
ARG TOOLS_ROOT="/opt/tools"

# PySparkでも必要なのでJavaをインストール．
RUN apt-get update \
    # 必要なパッケージのインストール
    && apt-get install -y \
        wget \
        vim \
    # Javaのインストール
    && apt-get install openjdk-${JAVA_VERSION}-jdk -y
ENV JAVA_HOME /usr/lib/jvm/java-${JAVA_VERSION}-openjdk-amd64
ENV PATH ${JAVA_HOME}/bin:$PATH

# Pythonインストール先のディレクトリに移動しておく
WORKDIR ${PYTHON_ROOT}
# ${PYTHON_ROOT}にinstall_jupyterlab-pyspark.bashをコピー
COPY ./docker/jupyterlab/dependencies/install_jupyterlab-pyspark.bash ${PYTHON_ROOT}
# makeでのビルドによるPythonインストールではPathが通っていないのであらかじめ登録する．
ENV PATH $PATH:${PYTHON_ROOT}/Python-${PYTHON_VERSION}/bin
RUN \
    # makeでのビルドによるPythonインストール
    apt-get install -y \
        # サイト(https://doitu.info/blog/5c45e5ec8dbc7a001af33ce8)を参照
        curl \
        build-essential \
        zlib1g-dev \
        libffi-dev \
        # 以下別サイト(https://qiita.com/yniji/items/8e392103a6f2a4152606)を参考にして追加
        libreadline-dev \
        libncursesw5-dev \
        libssl-dev \
        libsqlite3-dev \
        libgdbm-dev \
        libbz2-dev \
        liblzma-dev \
        uuid-dev \
        libdb-dev \
    # https://www.python.org/ftp/python/
    && wget https://www.python.org/ftp/python/${PYTHON_VERSION}/Python-${PYTHON_VERSION}.tar.xz \
    && tar xf Python-${PYTHON_VERSION}.tar.xz \
    && rm Python-${PYTHON_VERSION}.tar.xz \
    && cd Python-${PYTHON_VERSION} \
    && ./configure --prefix=${PYTHON_ROOT}/Python-${PYTHON_VERSION} --with-ensurepip=install --enable-optimizations \
    && make 2>&1 | tee make.log \
    && make altinstall \
    # 自作ツールでJupyterlabの依存モジュールをインストール(${PYTHON_VERSION}のうち先頭2つのバージョン値を抽出することをDockerfileでできないから)
    # -j ${JUPYTERLAB_VERSION}
    && bash ./../install_jupyterlab-pyspark.bash -v ${PYTHON_VERSION} -s ${SPARK_VERSION}





# RUN \
#     # Scalaのインストール



# ユーザ次第で使う補助ツールをコンテナに持っていく
COPY ./docker/jupyterlab/tools ${TOOLS_ROOT}
WORKDIR ${SHARED_WORKSPACE_CONTAINER}
# COPY ./${SHARED_WORKSPACE_HOST} ${SHARED_WORKSPACE_CONTAINER}


# EXPOSE 8000



# Mecabのインストール
# apt-get install -y make mecab libmecab-dev mecab-ipadic-utf8 && \
# # mecab -D && \ # mecabのインストール先の確認のため
# git clone https://github.com/neologd/mecab-ipadic-neologd.git && \
# cd mecab-ipadic-neologd && \
# bin/install-mecab-ipadic-neologd -n -y -p /var/lib/mecab/dic/mecab-ipadic-neologd && \
# rm -rf /tmp_nlp/mecab-ipadic-neologd
