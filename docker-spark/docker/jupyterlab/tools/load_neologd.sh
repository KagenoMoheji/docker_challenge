# Neologdをカレントディレクトリにインストールする
# gitのインストールが必要


git clone --depth 1 https://github.com/neologd/mecab-ipadic-neologd.git
cd mecab-ipadic-neologd
./bin/install-mecab-ipadic-neologd -n( -a)
???/*.csv > neologd.csv