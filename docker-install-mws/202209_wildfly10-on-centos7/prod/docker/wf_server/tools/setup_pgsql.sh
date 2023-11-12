#!/bin/bash

# REFS: https://hiroki-sawano.hatenablog.com/entry/populate-postgres-container
# WARNING: Dockerfileからrootユーザで実行される前提で実装する
# WARNING: Dockerfileと共有できる変数はENVで定義した変数のみ

psql_setup_sql_dir=""
# コマンドライン引数を取得
while [ $# -gt 0 ]; do
    case $1 in
        -ps)
            shift
            psql_setup_sql_dir="$1"
            ;;
        *)
            ;;
    esac
    shift
done

if [ -z "$(ls -A ${PGDATA})" ]; then
    su postgres -c "${POSTGRES_HOME}/bin/initdb --encoding=UTF8 --no-locale -D ${PGDATA}"
    su postgres -c "${POSTGRES_HOME}/bin/pg_ctl start -w -D ${PGDATA}"
    su postgres -c "${POSTGRES_HOME}/bin/psql -f ${psql_setup_sql_dir}/setup.sql"
    su postgres -c "${POSTGRES_HOME}/bin/pg_ctl stop -w -D ${PGDATA}"
fi

exec "$@"
