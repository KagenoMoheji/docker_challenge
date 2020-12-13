#!/bin/bash

#######################################################
# [コマンド説明]
# ・ワーカーノードの数を指定してdocker-compose.ymlによるイメージビルドを行う．
# ・ただし，ワーカーノード数は下記の優先順位で読み込まれる．
# (1)launch_spark.shの第1引数「-w」の値．
# (2)"./.env"の"SPARK_WORKER_CNT"の値．
# (3)デフォルトの1．
# 
# [コマンド例]
# $ bash ./launch_spark.sh -w 4
# $ bash ./launch_spark.sh
# もしくは，
# $ chmod +x ./launch_spark.sh
# $ ./launch_spark.sh -w 4
# $ ./launch_spark.sh
# Dockerイメージの再ビルドしたい場合は「-b」オプションを使う．
# $ ./launch_spark.sh -w 1 -b
#######################################################

loaded_worker_cnt=false # ワーカーノード数を取得したか
worker_cnt=1
option_build=""

if ! ${loaded_worker_cnt}; then
    # ここでコマンド引数「-w」からの取得を試す
    while [ $# -gt 0 ]; do
        case $1 in
            -w)
                shift
                if [[ ! $1 =~ ^[1-9][0-9]*$ ]]; then
                    # 自然数(0より大きい整数)出ない場合
                    echo "Error: Invalid value in option '-w'."
                    exit 1
                fi
                worker_cnt=$1
                loaded_worker_cnt=true
                ;;
            -b)
                option_build="--build"
                ;;
            *)
                ;;
        esac
        shift
    done
fi

if ! ${loaded_worker_cnt}; then
    # ここで"./.env"の"SPARK_WORKER_CNT"からの取得を試す
    # 外部ファイルの環境変数を読み込む方法↓
    # https://gist.github.com/judy2k/7656bfe3b322d669ef75364a46327836#gistcomment-2693347
    SPARK_WORKER_CNT=$(grep SPARK_WORKER_CNT ./.env | cut -d '=' -f2)
    if [[ $SPARK_WORKER_CNT =~ ^[1-9][0-9]*$ ]]; then
        worker_cnt=$SPARK_WORKER_CNT
        loaded_worker_cnt=true
    fi
fi

if ! ${loaded_worker_cnt}; then
    # 念の為1の再代入
    worker_cnt=1
    echo "Worker-Count use default '1',"
fi
echo ${worker_cnt}

docker-compose up -d ${option_build} --scale spark-worker=${worker_cnt}
