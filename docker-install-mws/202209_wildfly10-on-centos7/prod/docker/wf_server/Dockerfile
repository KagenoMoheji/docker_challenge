ARG OS_VERSION

FROM centos:${OS_VERSION}

# WARNING: ARGの代入にはイコールが必要
ARG APPNAME
ARG DOCKER_TOOLS_HOST
ARG SHARED_WORKSPACE_HOST
ARG OS_VERSION
ARG HTTP_PROXY
ARG JAVA_INSTALLER_FNAME
ARG JAVA_INSTALLER_DIR_CONTAINER
ARG JAVA_INSTALLER_DIR_HOST
ARG WF_INSTALLER_FNAME
ARG WF_INSTALLER_DIR_CONTAINER
ARG WF_INSTALLER_DIR_HOST
ARG WF_APP_DIR_CONTAINER
ARG WF_MNG_USER
ARG WF_MNG_PASSOWRD
ARG PSQL_INSTALLER_FNAME
ARG PSQL_INSTALLER_DIR_CONTAINER
ARG PSQL_INSTALLER_DIR_HOST
ARG PSQL_SETUP_SQL_FNAME
ARG PSQL_SETUP_SQL_DIR_CONTAINER
ARG PSQL_SETUP_SQL_DIR_HOST
ARG PSQL_SETUP_DATA_DIR_CONTAINER
ARG PSQL_SETUP_DATA_DIR_HOST
ARG PSQL_APP_DIR_CONTAINER
ARG PSQL_DB_NAME
ARG PSQL_DB_USER
ARG PSQL_DB_PASSWORD
ARG PSQL_PORT
ARG PSQL_TZ

ENV HTTP_PROXY ${HTTP_PROXY}
ENV HTTPS_PROXY ${HTTP_PROXY}
# ENV http_proxy ${HTTP_PROXY} # こっちの小文字のhttp_proxyを登録すると，407エラーが出る
# ENV https_proxy ${HTTP_PROXY}
ENV JAVA_HOME "/opt/java"
ENV WF_HOME ${WF_APP_DIR_CONTAINER}
ENV POSTGRES_HOME ${PSQL_APP_DIR_CONTAINER}
# https://www.postgresql.org/docs/9.4/libpq-envars.html
ENV PGDATA ${POSTGRES_HOME}/data
ENV PGTZ ${PSQL_TZ}
ENV PATH ${JAVA_HOME}/bin:${POSTGRES_HOME}/bin:${PATH}
# WARNING: ENTRYPOINTで変数使うにはARGではなくENVで宣言する必要あり
ENV DOCKER_TOOLS_ROOT "/opt/docker_tools"
ENV PSQL_SETUP_SQL_DIR ${PSQL_SETUP_SQL_DIR_CONTAINER}

# WARNING: ファイル指定の場合はCOPY先の最後に"/"付けないとダメ．逆にディレクトリ同期の場合は最後の"/"は付けない．
COPY ./${DOCKER_TOOLS_HOST} ${DOCKER_TOOLS_ROOT}
COPY ./${JAVA_INSTALLER_DIR_HOST}/${JAVA_INSTALLER_FNAME} ${JAVA_INSTALLER_DIR_CONTAINER}/
COPY ./${WF_INSTALLER_DIR_HOST}/${WF_INSTALLER_FNAME} ${WF_INSTALLER_DIR_CONTAINER}/
COPY ./${PSQL_INSTALLER_DIR_HOST}/${PSQL_INSTALLER_FNAME} ${PSQL_INSTALLER_DIR_CONTAINER}/
COPY ./${PSQL_SETUP_SQL_DIR_HOST}/${PSQL_SETUP_SQL_FNAME} ${PSQL_SETUP_SQL_DIR}/
COPY ./${PSQL_SETUP_DATA_DIR_HOST} ${PSQL_SETUP_DATA_DIR_CONTAINER}

RUN \
    # yumで必要なパッケージを事前インストール
    ## 本番環境をオフライン環境構築する際は，このyumインストールに工夫が必要
    ## yum使って「Could not retrieve mirrorlist http://mirrorlist.centos.org/?release=7&arch=x86_64&repo=os&infra=container error was 14: curl#6 - "Could not resolve host: mirrorlist.centos.org; Unknown error"」と怒られるのでその対応
    sed -i "s/^#baseurl=http\/\/mirror.centos.org\/centos\/\$releasever\/os\/\$basearch/baseurl=http\/\/mirror.centos.org\/centos\/\$releasever\/os\/\$basearch/g" /etc/yum.repos.d/CentOS-Base.repo \
    # && cat /etc/yum.repos.d/CentOS-Base.repo | grep baseurl \
    && yum update -y \
    && yum install -y \
        sudo \
        # curl \ # 入ってたので不要
        ## PostgreSQLインストールで必要
        gcc \
        readline-devel \
        zlib-devel \
        gettext \
        make \
        perl \
        bison \
        flex \
    # Javaのインストール
    ## 「jdk-8u241-linux-x64.tar.gz」のようなインストーラを使ったインストール
    && mkdir -p ${JAVA_HOME} \
    && tar -zxvf ${JAVA_INSTALLER_DIR_CONTAINER}/${JAVA_INSTALLER_FNAME} -C ${JAVA_INSTALLER_DIR_CONTAINER} \
    && export JAVA_DECOMPRESSED_DIR=($(find ${JAVA_INSTALLER_DIR_CONTAINER} -maxdepth 1 -type d | grep jdk)) \
    && echo ${JAVA_DECOMPRESSED_DIR[0]} > ${JAVA_INSTALLER_DIR_CONTAINER}/decompressed_dir_java.txt \
    && mv ${JAVA_DECOMPRESSED_DIR[0]}/* ${JAVA_HOME}/ \
    && rm -r ${JAVA_DECOMPRESSED_DIR[0]} \
    # Wildflyのインストール
    ## 「wildfly-10.1.0.Final.tar.gz」のようなインストーラを使ったインストール
    ## http://ossfan.net/setup/wildfly-01.html
    ## https://www.nextdoorwith.info/wp/se/infra/eap_wildfly/how-to-install-wildfly18-on-linux/
    ## https://qiita.com/KentOhwada_AlibabaCloudJapan/items/a57d23ee2496fc9287e8
    && tar -zxvf ${WF_INSTALLER_DIR_CONTAINER}/${WF_INSTALLER_FNAME} -C ${WF_INSTALLER_DIR_CONTAINER} \
    && export WF_DECOMPRESSED_DIR=($(find ${WF_INSTALLER_DIR_CONTAINER} -maxdepth 1 -type d | grep wildfly-)) \
    && echo ${WF_DECOMPRESSED_DIR[0]} > ${WF_INSTALLER_DIR_CONTAINER}/decompressed_dir_wildfly.txt \
    && mkdir -p ${WF_HOME} \
    && mv ${WF_DECOMPRESSED_DIR[0]}/* ${WF_HOME}/ \
    && rm -r ${WF_DECOMPRESSED_DIR[0]} \
    ## Wildflyのアプリディレクトリの変数をCMDへ共有することをファイル共有によって実現(ENV/export/ARGでの共有が無理そうだったので)
    && echo ${WF_HOME} > ${WF_INSTALLER_DIR_CONTAINER}/app_dir_wildfly.txt \
    ## Wildflyアプリディレクトリの所有ユーザ・グループを，suでのみログイン可なユーザとして作成
    && groupadd wildfly \
    && useradd -g wildfly wildfly \
    && chown -R wildfly:wildfly ${WF_HOME} \
    ## Wildflyのアプリユーザ(管理者)作成
    ## http://www.mastertheboss.com/jboss/jboss-script/wildfly-how-to-add-an-user/
    && ${WF_HOME}/bin/add-user.sh -u ${WF_MNG_USER} -p ${WF_MNG_PASSOWRD} \
    # PostgreSQLのインストール
    ## https://www.postgresql.jp/document/9.4/html/install-procedure.html
    ## https://go-journey.club/archives/11912
    ## https://www.ashisuto.co.jp/db_blog/article/20150918_pg_install_1.html
    ## https://www.ashisuto.co.jp/db_blog/article/20150918_pg_install_2.html
    ## https://hiroki-sawano.hatenablog.com/entry/populate-postgres-container
    ## PostgreSQL Serverインストール用ユーザ・グループを，suでのみログイン可なユーザとして作成
    && groupadd postgres \
    && useradd -g postgres postgres \
    ## インストール
    && cd ${PSQL_INSTALLER_DIR_CONTAINER} \
    && tar -zxvf ${PSQL_INSTALLER_DIR_CONTAINER}/${PSQL_INSTALLER_FNAME} -C ${PSQL_INSTALLER_DIR_CONTAINER} \
    && export PSQL_DECOMPRESSED_DIR=($(find ${PSQL_INSTALLER_DIR_CONTAINER} -maxdepth 1 -type d | grep postgres-)) \
    && echo ${PSQL_DECOMPRESSED_DIR[0]} > ${PSQL_INSTALLER_DIR_CONTAINER}/decompressed_dir_postgres.txt \
    && cd ${PSQL_DECOMPRESSED_DIR[0]} \
    ### configureの`--with-openssl`はlocalhostのみだから不要かな
    ### https://www.postgresql.jp/document/9.4/html/install-procedure.html
    && ./configure --enable-debug --prefix=${POSTGRES_HOME} --with-pgport=${PSQL_PORT} --enable-nls=UTF_JP \
    && make \
    && make install \
    ## DBクラスタを格納するディレクトリをPostgreSQLアプリディレクトリ内に作成
    && mkdir -p ${PGDATA} \
    && chown 700 ${PGDATA} \
    ## PostgreSQLアプリディレクトリの所有者・グループをpostgresにする
    && chown -R postgres:postgres ${POSTGRES_HOME} \
    # rm -r ${PSQL_DECOMPRESSED_DIR[0]} \ # これやるとmakeの遅延と衝突してエラーが出る
    ## DBクラスタ作成．初期のデータベースも作成されるらしい．
    && su postgres -c '${POSTGRES_HOME}/bin/initdb --encoding=UTF8 --no-locale -D ${PGDATA}' \
    && su postgres -c "${POSTGRES_HOME}/bin/pg_ctl start -w -D ${PGDATA}" \
    && su postgres -c "${POSTGRES_HOME}/bin/psql -f ${PSQL_SETUP_SQL_DIR}/setup.sql" \
    && su postgres -c "${POSTGRES_HOME}/bin/pg_ctl stop -w -D ${PGDATA}"
    ## TODO: 外部から接続できるよう設定
    ### https://stackoverflow.com/a/55071168

# コンテナ起動のたびにwildflyとPostgreSQLを起動
## https://qiita.com/backpaper0@github/items/8e7bded58765e85304ca#%E8%B5%B7%E5%8B%95
## https://stackoverflow.com/a/52817264

# TODO: Wildflyで使うDB・スキーマ・テーブル作成(IF EXISTS使う)
## initdb部分をsetup_pgsql.shに置き換える
## docker-compose restartでデータ追記されるか？ビルドしなおしでクリアされるか？
## ENTRYPOINTもしや不要？CMDじゃなくても上記成されるか？無理ならCMDでできるか？
## sqlでDROP IF EXISTしたらrestartでもクリアされるか？
# TODO: タイムゾーン設定
## psqlのタイムゾーン確認
## Linuxのタイムゾーン設定
### https://qiita.com/szly/items/dcc67c85689725795c26
### 会社でやってるやつどうしてるか見ておきたい
# WARNING: wildflyはrootで起動しないと，「`/var/log/wildfly/`を作る権限がない」と怒られる．
CMD ["sh", "-c", "su postgres -c '${POSTGRES_HOME}/bin/pg_ctl start -D ${PGDATA} &'; ${WF_HOME}/bin/standalone.sh -b=0.0.0.0 -bmanagement=0.0.0.0"]
# CMD ["sh", "-c", "su postgres -c '${POSTGRES_HOME}/bin/pg_ctl start -D ${PGDATA} &'; ${WF_HOME}/bin/standalone.sh -b=0.0.0.0 -bmanagement=0.0.0.0 &"] # 両方バックグラウンド実行するやつ．未検証

WORKDIR /app




# PostgreSQLの起動状況と実行ユーザの確認
## `ps aux | grep postgres`
# PostgreSQLサーバ内でpostgresユーザでパスワード無しに入る
## `psql -U postgres -p 5432`
# PostgreSQLを再起動
## ``
# wildflyの起動状況と実行ユーザの確認
## `ps -aux | grep java`
# Wildflyを再起動
## killと起動コマンドを使う方法
### 1. `ps aux | grep java`でプロセスIDを確認
### 2. `kill <プロセスID>`
### 3. `${WF_HOME}/bin/standalone.sh -b=0.0.0.0 -bmanagement=0.0.0.0 &`
## wildflyのcliを使う方法(機能しているか微妙)
### 1. `${WF_HOME}/bin/jboss_cli.sh`でcliに入る
### 2. ``
# Wildflyのデプロイ手順
## 0. (「 auto-deploy-exploded="true"」にして，warファイルのzip拡張子変更&解凍&回答したフォルダ名にwar拡張子追加して，warフォルダをdeploymentsフォルダに置いてデプロイする方法もある)
### https://stackoverflow.com/questions/49605979/how-to-do-wildfly-9-unzipped-deployement-of-war-file
## 1. Java(Maven)をビルドしてwarファイル作成
## 2. WildflyのWeb画面のDeploymentsページで前のデプロイ物をremove
## 3. `${WF_HOME}/standalone/deployments/`にある前のwarファイルとデプロイ物を削除
## 4. 新しいwarファイルを`${WF_HOME}/standalone/deployments/`に配置
## 5. (自動デプロイが効かない場合があるので)WildflyのWeb画面のDeploymentsページの「Add」ボタンから新しいwarファイルをアップロードして手動デプロイ
## 6. `${WF_HOME}/standalone/deployments/<ファイル名>.deployed`が出来ていたらデプロイ完了
### `${WF_HOME}/standalone/deployments/<ファイル名>.failed`が出来ていたらデプロイ失敗．そのファイルや`${WF_HOME}/standalone/logs/server.log`でエラー文確認

