# Spark環境構築
- 目標
    - [x] DockerでSpark構築
    - [ ] SparkをPythonまたはScalaで実行(JupyterLab使用)
    - [ ] SparkをGPUで動かす
    - [ ] スケジュール実行できるようにする


### 環境
```
├ try/
    ├ README.md
    ├ docker-compose.yml
    ├ .env
    ├ launch_spark.sh
    ├ docker/
        ├ spark/
            ├ driver/
                ├ Dockerfile
            ├ worker/
                ├ Dockerfile
        ├ jupyterlab/ [JupyterLabでPythonとScalaの両方の言語を実装できるようにしてDatabricks風にする．]
            ├ Dockerfile
            ├ dependencies/
                ├ [まだディレクトリの位置が確定ではないが，wheelとかを置いて初期読込させる場所のつもり]
    ├ src/
        ├ jupyterlab_try/
        ├ jupyterlab_try_gpu/
```

### 環境構築
- 始める前に
    - コマンドのうち，`$`から始まるものはホストでコマンドを実行しているものです．  
    コンテナのターミナルで実行するコマンドは`#`から始まります．
1. `.env`で設定値を設定する．
    - Spark関係
        - `SPARK_VERSION`
            - Sparkのバージョン．
        - `JAVA_VERSION`
            - Javaのバージョン．
            - [Apache Spark Documentation](https://spark.apache.org/documentation.html)の各バージョンのOverviewにて下記のような文言があるはず．  
            使用するバージョンのSparkが対応しているJavaバージョンを指定するべし．
                ```
                Spark runs on Java 8, Python 2.7+/3.4+ and R 3.5+. For the Scala API, Spark 2.4.7 uses Scala 2.12. You will need to use a compatible Scala version (2.12.x).
                ```
        - `SPARK_WORKER_PORT_END`
            - ワーカーノードに割り当てるポート番号の範囲(8081〜)の終端．
        - `SPARK_WORKER_CNT`
            - ワーカーノードの数．
            - [注意！]`SPARK_WORKER_PORT_END`で指定したポート番号の範囲の個数が上限．
                - 例えば`SPARK_WORKER_PORT_END=8089`とした場合は，8081〜8089の9つまで指定できる．
            - [注意！]`SPARK_WORKER_CORES`と`SPARK_WORKER_MEMORY`は**各ノードに**割り当てられるので注意．
                - 2つ以上のワーカーノードに全メモリサイズだけ割り当ててSparkコンテナを作ろうとすると，(多分その理由で)PCフリーズする．
        - `SPARK_WORKER_CORES`
            - ワーカーノードに割り当てられるCPUのコア数．
            - ワーカーノードが生成できるExecutorの数？(たぶん違う)
        - `SPARK_WORKER_MEMORY`
            - ワーカーノードがExecutorに割り当てられるメモリの総数．
            - [注意！]前述しているが，`SPARK_WORKER_CNT x SPARK_WORKER_MEMORY`だけメモリが確保されるので，Sparkコンテナ作成時にPCフリーズする危険あり．注意して設定すること．
        - `SHARED_WORKSPACE_HOST`
            - Sparkノードの共有ディレクトリであり，マウントするホスト側のPath．
            - `docker-compose.yml`からの相対パスであり，`./`の次に続くディレクトリを書く．
        - `SHARED_WORKSPACE_CONTAINER`
            - Sparkノードの共有ディレクトリであり，マウントするコンテナ側のPath．
            - `/`から始まるディレクトリを書く．
        - `HADOOP_VERSION`
            - Hadoopのバージョン．
            - 下記の2通りで使用するバージョンのSparkが対応しているHadoopのバージョンを確認できる．
                - [Download Apache Spark](https://spark.apache.org/downloads.html)で使用するSparkバージョンを指定した上での「Choose a package type」に表示されるHadoopバージョン．
                - [Sparkのインストール元](https://ftp.cc.uoc.gr/mirrors/apache/spark/)にある使用するSparkバージョンのインストールパッケージ名にあるHadoopバージョン．
    - Python・ScalaのJupyterLab関係
        - `PYTHON_VERSION`
            - PySparkで使用するPythonバージョン．
            - [Index of /ftp/python/](https://www.python.org/ftp/python/)から適宜指定．
        - `SCALA_VERSION`
            - JupyterLabにおけるScalaのバージョン．SparkでのScalaのバージョンに合わせるべし．
            - [Apache Spark Documentation](https://spark.apache.org/documentation.html)の各バージョンのOverviewにて下記のような文言があるはず．  
            使用するバージョンのSparkが対応しているJavaバージョンを指定するべし．
                ```
                For the Scala API, Spark 2.4.7 uses Scala 2.12. You will need to use a compatible Scala version (2.12.x).
                ```
                - [ALL AVAILABLE VERSIONS](https://www.scala-lang.org/download/all.html)でScalaバージョンを確認．
    - その他
        - ~~`USE_GPU`~~
            - GPUを使用するか．ComingSoon．
2. Spark&JupyterLabのイメージビルド＆コンテナ起動の方法は2つある．
    - ワーカーノードを`launch_spark.sh`の引数で指定する．
        1. `docker-compose.yml`があるディレクトリに移動．
        2. ワーカーノードの数を指定して，下記コマンドを実行．
            ```
            $ bash ./launch_spark.sh -w <ワーカーノードの数>
            ```
    - ワーカーノードを`.env`で指定する．
        1. `docker-compose,yml`で用いられる`.env`に，環境変数`SPARK_WORKER_CNT`でワーカーノードの数を設定．
        2. `docker-compose.yml`があるディレクトリで下記コマンドを実行．
            ```
            $ bash ./launch_spark.sh
            ```
            - この方法は，下記コマンドと同じことをしている．
                ```
                $ docker-compose up -d --scale spark-worker=<ワーカーノードの数>
                ```
3. SparkとJupyterLabを試す．
    - Spark
        - ドライバー・ワーカーノードの状態の確認は2つある．
            - `docker-compose ps`で確認する．
                - 例
                    - ワーカーノードの数が1つの時
                        ```
                        $ docker-compose ps
                        
                        CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                                            NAMES
                        55afbdb8bf19        spark-worker        "/spark/bin/spark-cl…"   2 hours ago         Up 23 minutes       0.0.0.0:8081->8081/tcp                           try_spark-worker_1
                        40a4b20100ab        spark-driver        "/spark/bin/spark-cl…"   2 hours ago         Up 23 minutes       0.0.0.0:4040->4040/tcp, 0.0.0.0:8080->8080/tcp   try_spark-driver_1
                        ```
                    - ワーカーノードの数が2つの時
                        ```
                        $ docker-compose ps

                        CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                                            NAMES
                        a35908be5bca        spark-worker        "/spark/bin/spark-cl…"   2 seconds ago       Up 1 second         0.0.0.0:8082->8081/tcp                           try_spark-worker_2
                        55afbdb8bf19        spark-worker        "/spark/bin/spark-cl…"   2 hours ago         Up 23 minutes       0.0.0.0:8081->8081/tcp                           try_spark-worker_1
                        40a4b20100ab        spark-driver        "/spark/bin/spark-cl…"   2 hours ago         Up 23 minutes       0.0.0.0:4040->4040/tcp, 0.0.0.0:8080->8080/tcp   try_spark-driver_1
                        ```
            - [http://localhost:8080/](http://localhost:8080/)で確認する．
                - 「Workers」・「Running Applications」・「Running Executors」など詳細に確認できる．
        - Sparkを試す
            1. 下記コマンドを実行してScalaを起動する．
                ```
                $ docker-compose exec spark-driver /spark/bin/spark-shell --master spark://localhost:7077

                20/12/13 14:39:33 WARN NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
                Using Spark's default log4j profile: org/apache/spark/log4j-defaults.properties
                Setting default log level to "WARN".
                To adjust logging level use sc.setLogLevel(newLevel). For SparkR, use setLogLevel(newLevel).
                Spark context Web UI available at http://40a4b20100ab:4040
                Spark context available as 'sc' (master = spark://localhost:7077, app id = app-20201213143937-0001).
                Spark session available as 'spark'.
                Welcome to
                    ____              __
                    / __/__  ___ _____/ /__
                    _\ \/ _ \/ _ `/ __/  '_/
                /___/ .__/\_,_/_/ /_/\_\   version 2.4.7
                    /_/
                        
                Using Scala version 2.11.12 (OpenJDK 64-Bit Server VM, Java 1.8.0_275)
                Type in expressions to have them evaluated.
                Type :help for more information.

                scala>
                ```
            2. [http://localhost:4040/](http://localhost:4040/)でSpark Jobの状態確認画面を開く．
                - [注意！]1.のコマンドをじっこうした結果に「http://40a4b20100ab(適当なID文字列):4040」と書かれているがこれでは起動できないので注意．
            3. 下記コードを実行して，実行結果や2.の状態を確認する．
                ```
                scala> val ds = Seq(1, 2, 3).toDS()
                ds: org.apache.spark.sql.Dataset[Int] = [value: int]

                scala> ds.show()
                +-----+
                |value|
                +-----+
                |    1|
                |    2|
                |    3|
                +-----+

                scala> ds.map(_ * 2).show()
                +-----+                                                                         
                |value|
                +-----+
                |    2|
                |    4|
                |    6|
                +-----+
                ```
    - JupyterLab(PySpark)
        1. (Sparkノードと一緒にDockerイメージビルド・コンテナ起動して)下記コマンドでコンテナに入る．
            ```
            $ docker exec -it jupyterlab bash
            ```
        2. 必要なモジュールを下記コマンドのいずれかでインストールしておく．
            ```
            $ docker exec jupyterlab python<PYTHON_VERSION:X.Y> -m pip install -r /opt/workspace/conf/dependencies/user_requirements.txt
            ```
            ```
            # python<PYTHON_VERSION:X.Y> -m pip install -r /opt/workspace/conf/dependencies/user_requirements.txt
            ```
            ```
            $ docker exec jupyterlab python<PYTHON_VERSION:X.Y> -m pip install <モジュール名>
            ```
            ```
            # python<PYTHON_VERSION:X.Y> -m pip install <モジュール名>
            ```
            - `PYTHON_VERSION:X.Y`は，`PYTHON_VERSION`を構成するバージョン値のうち先頭2つのバージョン値からなる`X.Y`を使うことを示す．
        3. 下記コマンドでJupyterLabを起動．
            ```
            jupyter lab --ip=0.0.0.0 --port=8000 --no-browser --allow-root --NotebookApp.token=
            ```
        - 下記コードを試し打ち
            ```
            from pyspark.sql import SparkSession

            spark = SparkSession\
                        .builder\
                        .appName("pyspark-jupyterlab)\
                        # マスターノードはdocker-compose.ymlで定義したservice名を使う．
                        .master("spark://spark-driver:7077")\
                        # .enableHiveSupport()
                        # .config() # spark.executor.memoryとか…
                        .getOrCreate()
            # pyspark-dataframe．pandas-dataframe=pddfと区別．
            psdf = spark.sql()
            ```
            ```
            import pandas as pd
            from pyspark.sql import SparkSession
            class SparkIO:
                def __init__(self, ???):
                    self._spark = SparkSession\
                                    .builder\
                                    .appName("pyspark-jupyterlab)\
                                    # マスターノードはdocker-compose.ymlで定義したservice名を使う．
                                    .master("spark://spark-driver:7077")\
                                    # .enableHiveSupport()
                                    # .config() # spark.executor.memoryとか…
                                    .getOrCreate()
                
                def pddf2spdf(pddf: pandas.DataFrame, schema: pyspark.sql.types.StructType):
                    return self._spark.createDataFrame(pddf, schema = schema)
                
                def spdf2pddf(spdf: pyspark.sql.DataFrame):
                    return spdf.toPandas()
            ```
    - JupyterLab(ScalaSpark)
5. Sparkコンテナを消す
    - `docker-compose.yml`があるディレクトリで下記コマンドを実行．
        ```
        $ docker-compose down
        ```
    - `docker-compose.yml`や`Dockerfile`の変更を反映させる場合はDockerイメージの再ビルドが必要．
        ```
        $ docker-compose down
        $ docker-compose rmi spark-driver spark-worker jupyterlab
        $ bash ./launch_spark.sh -w <ワーカーノードの数>
        ```
        - 一応`launch_spark.sh`に`-b`オプションを実装してあるが，上記の方が確実と思われ．
        - 特定のserviceのみの再ビルドをしたい場合は下記．
            ```
            $ docker rmi <service名>
            $ docker-compose up -d <service名>
            ```
- 機能拡張
    - [ ] MeCabをインストール
        ```
        # sh /opt/tools/load_mecab.sh
        ```
        - もしコンテナに`/opt/tools/load_mecab.sh`が無い場合，下記を実行してコンテナに持っていってから上記を実行．
            ```
            $ docker exec jupyterlab mkdir -p /opt/tools/
            $ docker cp ./docker/jupyterlab/tools/load_mecab.sh jupyterlab:/opt/tools/
            ```
    - [ ] 辞書"NEologd"を導入
        ```
        # sh /opt/tools/load_neologd.sh
        ```
        - もしコンテナに`/opt/tools/load_neologd.sh`が無い場合，下記を実行してコンテナに持っていってから上記を実行．
            ```
            $ docker exec jupyterlab mkdir -p /opt/tools/
            $ docker cp ./docker/jupyterlab/tools/load_neologd.sh jupyterlab:/opt/tools/
            ```
- もしこうなったら
    - リソース割当ミスなどでジョブが終わらない
        - [http://localhost:8080/](http://localhost:8080/)の「Running Applications」から「kill」する．
    - PySparkを実行したら`TypeError: an integer is required (got type bytes)`と言われた．
        - Python3.8に対応していない可能性あり．3.7にダウングレードすべし．

### 雑メモ
- チューニング(n=SPARK_WORKER_CNT, c=SPARK_WORKER_CORES, m=SPARK_WORKER_MEMORY)
    - (n=1, c=1, m=4048m)と処理時間を比較して…  
    ※比較コードは前述の`ds.map(_ * 2).show()`．  
    ※比較箇所は[http://localhost:4040/](http://localhost:4040/)のEventTimelineの長さ
        - (n=1, c=1, m=8096m)
            - 変わらない気がする．
        - (n=2, c=1, m=4048m)
            - 1つごとのジョブは速くなった気がするが，ジョブが直列なので総合時間としては変わらない気がする．
        - (n=1, c=2, m=4048m)
            - 速くなった気がする．
        - (n=1, c=4, m=4048m)
            - (n=1, c=2, m=4048m)より遅くなった気がする．
    - 上記によると，コア数のチューニングが主になるだろうか．
- Jupyterlabだけでなく`jupytext`もインストールして設定しておくと，Notebookに同期して`.py`を生成してくれる．
    - [Jupyter notebook を管理しやすくする Jupytext を使ってみた](https://qiita.com/cfiken/items/8455383f32ee19dfbba3)

### 参照
- 構築
    - [Docker でお試し Spark クラスタを構築する](https://qiita.com/hoto17296/items/12366c9f9965ce28a780)
    - [Apache Spark Cluster on Docker (ft. a JupyterLab Interface)](https://towardsdatascience.com/apache-spark-cluster-on-docker-ft-a-juyterlab-interface-418383c95445)
        - [andre-marcos-perez/docker-compose.yml](https://gist.github.com/andre-marcos-perez/21ca0226fa20f57f238374b710b49c72)
        - [andre-marcos-perez/jupyterlab.Dockerfile](https://gist.github.com/andre-marcos-perez/4b55bf7278c50961d1be7fcce70073c7#file-jupyterlab-dockerfile)
    - [Dockerでapache Sparkのローカル学習環境を用意する](https://www.letitride.jp/entry/2020/08/13/120216)
    - [Apache Spark を Jupyter Notebook で試す (on ローカル Docker](https://qiita.com/mangano-ito/items/dac5582a331d40a484ad#%E8%A9%A6%E3%81%99)
    - [Docker SwarmでApache Sparkクラスタを構築してみる](https://blog.namiking.net/post/2016/01/docker-swarm-spark/)
    - Python on Docker(Pythonバージョン指定)が思ったよりハードだった件
        - 下記の障壁にぶつかった…
            - `$ apt-get install -y pythonX.X`して`$ pythonX.X -m pip 〜`をしようとしたら`/usr/bin/pythonX.X: No module named pip`と怒られてしまう．
            - `$ apt-get install -y python3-pip`を使って`pip3`が使える方法もあるが，最新バージョンガチャは嫌だ(旧バージョンしか使えないモジュールあったりするので)．Pythonバージョン指定してインストールしたい．
            - JupyterLabでScalaが使えるようにするため，Python仮想環境(pipenv等)は避けておきたい．  
            なので`$ pipenv --python X.X`の方法は使えない．
        - 行けそうな対応方法
            - get-pip.pyを使ってpipを入れる方法
                - https://github.com/rewolfiluac/develop-env-docker/blob/main/Dockerfile
                - https://qiita.com/sabaku20XX/items/67eb69f006adbbf9c525
            - Pythonをビルドしてインストールする方法
                - [UbuntuでPythonをソースからインストール](https://qiita.com/yniji/items/8e392103a6f2a4152606)
                - [既存のPython環境を壊すことなく、自分でビルドしてインストールする（altinstall）](https://doitu.info/blog/5c45e5ec8dbc7a001af33ce8)
- 設定値
    - [Spark Standalone Mode](https://spark.apache.org/docs/latest/spark-standalone.html)
        - ワーカーノードに割り当てられるCPUコア数とメモリサイズは，コマンドの引数または，それぞれの環境変数への設定により適用されるらしい．
            - 今回はDockerfileでの環境変数はインストールに必要なものだけにし，起動に必要な変数はコマンド引数で渡す形式にする．
- Sparkについて知りたいなら
    - [学んで動かす！Sparkのキホン](https://www.scsk.jp/lib/product/oss/pdf/Spark.pdf)
    - [Apache Sparkの概要](https://qiita.com/whata/items/8915182cbd3759eebe6d)
- チューニング
    - [Spark SQLによるビッグデータ集計をチューニングするために分散処理の基礎から駈けぬける速習ガイド](https://qiita.com/piyo7/items/b2b26ca5a91b813562d4)
    - [Sparkの性能向上のためのパラメータチューニングとバッチ処理向けの推奨構成](https://thinkit.co.jp/article/11281)
    - [Spark 並列化チューニングの一例](https://techblog.gmo-ap.jp/2018/12/03/spark-%E4%B8%A6%E5%88%97%E5%8C%96%E3%83%81%E3%83%A5%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%B0%E3%81%AE%E4%B8%80%E4%BE%8B/)
    - [[Spark道場]メモリとCPU数の設定を最適化する](https://techblog.gmo-ap.jp/2018/09/06/spark%E9%81%93%E5%A0%B4%E3%83%A1%E3%83%A2%E3%83%AA%E3%81%A8cpu%E6%95%B0%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%82%92%E6%9C%80%E9%81%A9%E5%8C%96%E3%81%99%E3%82%8B/)
    - [Apache SparkとTalend：パフォーマンスと調整](https://www.talend.com/jp/blog/2018/04/12/apache-spark-performance-and-tuning-blog/)
    - [sparkパラメータ最適化チューニング](https://ariseanalytics.com/activities/report/20201030-2/)
- スタンドアロンSparkコード実装
    - [Spark SQL, DataFrames and Datasets Guide](https://spark.apache.org/docs/2.3.0/sql-programming-guide.html)
    - [Jupyter NotebookでのpySparkコードサンプル](https://qiita.com/kazurof/items/0e8e46771cd845b7edbb)
    - [JupyterでScala](https://qiita.com/poad1010/items/a67fc9032562b9d73ba5)
- その他Sparkのあれこれ
    - [Spark 初心者の頃に勘違いしていた５つのこと](https://qiita.com/blueskyarea/items/2e1b6317f8f10f6d3cbb)