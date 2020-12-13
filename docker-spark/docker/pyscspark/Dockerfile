# ここにJupyter？



    # Mecabのインストール
    apt-get install -y make mecab libmecab-dev mecab-ipadic-utf8 && \
    # mecab -D && \ # mecabのインストール先の確認のため
    git clone https://github.com/neologd/mecab-ipadic-neologd.git && \
    cd mecab-ipadic-neologd && \
    bin/install-mecab-ipadic-neologd -n -y -p /var/lib/mecab/dic/mecab-ipadic-neologd && \
    rm -rf /tmp_nlp/mecab-ipadic-neologd && \
    # Pythonのインストール
    apt-get install python${PYTHON_VERSION} && \
    echo 'alias python3="/usr/bin/python${PYTHON_VERSION}"' >> /root/.bashrc && \
    source /root/.bashrc && \
    # ここで動かんかったらpython${PYTHON_VERSION}でコマンド動かす
    python3 -m pip install -U pip && \
    pip install pipenv && \
    echo 'export PIPENV_VENV_IN_PROJETC=true' >> /root/.bashrc && \
    source /root/.bashrc

# RUN /
#     # 以下，開発ディレクトリ${APP_HOME}にてPython仮想環境構築(手動の方が良いかも)
#     pipenv --python=${PYTHON_VERSION} && \
#     pipenv install hjson pyspark mecab-python3 janome # あるいは「pipenv install」