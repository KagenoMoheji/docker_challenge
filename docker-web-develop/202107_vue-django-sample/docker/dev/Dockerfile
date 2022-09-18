########################################################################################
# ホストのディレクトリパスについて，docker-compose.ymlからの相対パスであることに注意！
########################################################################################
FROM ubuntu:latest

ARG SHARED_WORKSPACE_CONTAINER
ARG SHARED_WORKSPACE_HOST
ARG DOCKER_TOOLS_ROOT="/opt/docker_tools"


########################################################################################
# Python環境構築
#---------------------------------------------------------------------------------------
ARG PYTHON_VERSION
ENV PYTHON_ROOT="/opt/python"
# Pythonインストール先のディレクトリに移動しておく
WORKDIR ${PYTHON_ROOT}
# PythonのDocker環境構築補助ツールをコンテナに持っていく
## ${PYTHON_ROOT}にinstall_requirements.bash(とuser_requirements.txt)をコピー
COPY ./docker/dev/python/tools ${DOCKER_TOOLS_ROOT}/python

# makeでのビルドによるPythonインストールではPathが通っていないのであらかじめ登録する．
ENV PYTHON_HOME ${PYTHON_ROOT}/Python-${PYTHON_VERSION}
# 2通りのPATH登録をする．1つ目は2つ目が動かないときの保険．2つ目はPythonのCLI用にpython.exeを有効にする．
ENV PATH ${PYTHON_HOME}/bin:$PATH
ENV PATH ${PYTHON_HOME}:$PATH
RUN apt-get update \
    # makeでのビルドによるPythonインストール
    && apt-get install -y \
        # 普段から入れた方がいいと思う奴ら
        wget \
        vim \
        curl \
        # サイト(https://doitu.info/blog/5c45e5ec8dbc7a001af33ce8)を参照
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
    # "user_requirements.txt"にあるPythonモジュール群をインストール
    ## ちなみに${PYTHON_VERSION}のうち先頭2つのバージョン値を抽出することをDockerfileでできないからbashで抽出処理を実装してる
    && bash ${DOCKER_TOOLS_ROOT}/python/install_requirements.bash -v ${PYTHON_VERSION} -r ${DOCKER_TOOLS_ROOT}/python/user_requirements.txt

# この下に適宜補助ツール(mecabビルドとか)を使ったDockerビルドを記述する．



########################################################################################
# NodeJS環境構築
#---------------------------------------------------------------------------------------
ARG NODE_VERSION
# NodeJSのインストール先にあらかじめ移動しておく
WORKDIR /opt/nodejs
# NodeJSインストールに必要な資材をコンテナに持ってくる
COPY ./docker/dev/nodejs/tools ${DOCKER_TOOLS_ROOT}/nodejs
# NodeJSのbinを"/opt/nodejs/"下に配置させるので，環境変数に登録してコマンド有効になるようにしておく．
ENV PATH /opt/nodejs/bin:$PATH
RUN apt-get update \
    # && apt-get install -y \
        # Pythonの方でインストール済み
        # vim \
        # wget \
        # curl \
    # NodeJSインストール
    # 方法(1)：3つの数字からなるバージョンにも対応しているシェル．nodejs.orgからダウンロードしてる．
    && bash ${DOCKER_TOOLS_ROOT}/nodejs/install_node_from_nodeorg.bash -v ${NODE_VERSION}
    # 方法(2)：1つの数字からなるバージョンにしか対応できないシェル．nodesourceのセットアップを使用している．
    # && bash /opt/docker/tools/install_node_from_nodesource.bash -v ${NODE_VERSION}
# RUN node --version && npm --version && ls -la




########################################################################################
# 最後の処理
#---------------------------------------------------------------------------------------
# 最後の最後に開発ディレクトリを指定しておいて，そこに入れるようにしとく
WORKDIR ${SHARED_WORKSPACE_CONTAINER}
# 下記はdocker-compose.ymlで指定するので不要説
# COPY ./${SHARED_WORKSPACE_HOST} ${SHARED_WORKSPACE_CONTAINER}

# サーバサイドlocalhostのポート番号．docker-compose.ymlで指定するので不要説
# EXPOSE 8123