#!/bin/bash

#######################################################################################
# ●コマンド説明
# 
# ●例
# $ bash ./install_jupyterlab-pyspark.bash -v 3.8.6
# $ bash ./install_jupyterlab-pyspark.bash -v 3.8 -s 2.4.7
########################################################################################

python_version="0"
pyspark_version="0"
jupyterlab_version="0"
# バージョンの正規表現
# 1次元目が自然数の場合："^[1-9][0-9]*(\.[0-9]+)*$"
pattern_version="^[0-9]+(\.[0-9]+)*$"
# コマンドライン引数を取得
while [ $# -gt 0 ]; do
    case $1 in
        -v)
            shift
            if [[ ! $1 =~ ${pattern_version} ]]; then
                # バージョンがフォーマット通り出ない場合
                echo "Error: Invalid value in option '-v'."
                exit 1
            fi
            python_version=$1
            ;;
        -s)
            shift
            if [[ ! $1 =~ ${pattern_version} ]]; then
                echo "Error: Invalid value in option '-s'."
                exit 1
            fi
            pyspark_version=$1
            ;;
        -j)
            shift
            if [[ ! $1 =~ ${pattern_version} ]]; then
                echo "Error: Invalid value in option '-s'."
                exit 1
            fi
            jupyterlab_version=$1
            ;;
        *)
            ;;
    esac
    shift
done
if [ ${python_version} = "0" ]; then
    echo "Error: Option '-v' is necessary."
    exit 1
fi


# com_python_versionには，python_versionのうち先頭2つの数字のみからなるバージョンを抽出した値を格納．
com_python_version=""
# -------------------------------------------------------------------------------------------
# 下記の方法でのpython_versionからの先頭2つの数字の抽出はダメポ
# "\(〜\)"で囲むところが抽出したいパターン？
# 1次元目が自然数の場合："\(^[1-9][0-9]*/(\.[0-9]+){,1}/\).*$"
# "\(^[0-9]+/(\.[0-9]+)?/\).*$"
# "\(^[0-9]+(\.[0-9]+)?\)"
# "\(^[0-9]+/(\.[0-9]+){,1}/\).*$"
# pattern_version_2d="\(^[0-9]+(\.[0-9]+)?\).*$"
# sedコマンドの区切り文字(デフォで"/")で，デフォでは正規表現のパターンに属する"/"と区別できなかったのと$#・$@・$!・$?とかが変数になりうるので使えないので，"%"にした(冒頭の"s<区切り文字>"で変更できる)．
# com_python_version=$(echo ${python_version} | sed -e "s%${pattern_version_2d}%\1%g")
# -------------------------------------------------------------------------------------------
# http://dqn.sakusakutto.jp/2013/06/bash_rematch_regexp.html
# python_versionの値正当性は引数解析で実施済みなのでOK．ifはBASH_REMATCHへの格納のため．
pattern_version_2d="^([0-9]+)(\.[0-9]+)?(\.[0-9]+)*$"
if [[ ${python_version} =~ ${pattern_version_2d} ]]; then
    com_python_version="${BASH_REMATCH[1]}${BASH_REMATCH[2]}"
fi
# -------------------------------------------------------------------------------------------
# echo ${python_version}
# echo ${python_version:0:3} # この書き方では，もし二桁のバージョン値が来たときに対応できない．
# echo ${com_python_version}


# Pythonモジュールのコマンド引数に表記するバージョンの文字列を格納
com_pyspark_version=""
if [ ${pyspark_version} != "0" ]; then
    com_pyspark_version="==${pyspark_version}"
fi
# echo ${com_pyspark_version}
com_jupyterlab_version=""
if [ ${jupyterlab_version} != "0" ]; then
    com_jupyterlab_version="==${jupyterlab_version}"
fi
# echo ${com_jupyter_version}


# pipの更新
python${com_python_version} -m pip install -U pip
# 依存モジュールをインストール
python${com_python_version} -m pip install pypandoc
# pysparkとjupyterlabのインストール
python${com_python_version} -m pip install pyspark${com_pyspark_version} jupyterlab${com_jupyterlab_version} jupytext

# JupyterLabの設定
echo 'c.NotebookApp.contents_manager_class = "jupytext.TextFileContentsManager"' >> ~/.jupyter/jupyter_notebook_config.py
echo 'c.ContentsManager.default_jupytext_formats = "ipynb,py"' >> ~/.jupyter/jupyter_notebook_config.py