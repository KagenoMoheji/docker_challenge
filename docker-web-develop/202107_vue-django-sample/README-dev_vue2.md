# 開発者メモ
## ディレクトリ構成
```
├ Project
    ├ .gitignore
    ├ .env
    ├ docker-compose.yml
    ├ docker/
        ├ dev/
            ├ Dockefile
            ├ nodejs/
            ├ python/
        ├ server/
            ├ nginx/
        ├ db/
            ├ mysql/
                ├ data/
        ├ phpmyadmin/
    ├ workspace [あるいはプロジェクト・アプリ名]
        ├ frontend/
            ├ package.json
            ├ src/
                ├ main/
                ├ mytest/
        ├ backend/
            ├ src/
                ├ main/
                ├ mytest/
```


## 環境構築
### 1. devコンテナのビルド・起動
```
$ docker-compose up -d
$ docker exec -it django_vue bash
```
### 2. バックエンド(Django)の構築
1. `pipenv`で仮想環境を立ち上げて依存モジュールをインストール
    1. もしPipfileがすでに用意されている場合は下記コマンドを実行でOK．  
    無いなら2.から新規作成．
        ```
        $ cd /opt/workspace/backend
        $ pipenv install
        ```
    2. 仮想環境立ち上げ
        ```
        $ pipenv --python <Pythonバージョン>
        ```
        - Pythonバージョンについて，基本的にdockerビルドに用いる`.env`の`PYTHON_VERSION`則る
    3. 依存モジュールインストール
        ```
        $ pipenv install django djangorestframework djangorestframework-jwt django-cors-headers django-filter pandas numpy
        ```
    4. 必要なら`requirements.txt`の書き出しもしておくといいかも(Pipfileで十分ならやらなくて良い)
        ```
        $ pipenv lock -r > requirements.txt
        ```
    5. `Pipfile`に下記のショートカットコマンドを追加  
    ※後続の手順でめっちゃ使ってるので登録しとくべし．生コマンド使いたいなら頑張って照合して．
        ```
        [scripts]
        list = "python -m pip list"
        version = "python -V"
        django_prj = "django-admin startproject"
        django_app = "python manage.py startapp"
        migrate = "python manage.py migrate"
        launch_local = "python {PRJNAME}/manage.py runserver 0.0.0.0:8123"
        # 下記は動かしたこと無い
        launch_prod = "python ./{PRJNAME}/manage.py runserver 0.0.0.0:8123 --settings {PRJNAME}.settings.prod"
        ```
        - Djangoのimportの仕方的に`python -m`の書き方は厳しそう．
        - `launch_local`のホスト名とIPアドレスは，dockerのフォワーディングに則る．
2. 初期プロジェクトディレクトリ作成
    ```
    $ cd /opt/workspace/backend
    $ pipenv run django_prj {PRJNAME}
    ```
    - 下記ディレクトリができるはず
        ```
        ├ {PRJNAME}/
            ├ manage.py
            ├ (db.sqlite3)
            ├ {PRJNAME}/
                ├ __init__.py
                ├ asgi.py
                ├ settings.py
                ├ urls.py
                ├ wsgi.py
        ```
    - 下記コマンドでお試し起動してみれる
        ```
        $ pipenv launch_local
        ```
3. 開発・本番用の設定棲み分け
    1. `{PRJNAME}/{PRJNAME}/settings.py`に対し，下記ディレクトリになるように移動させ，`local.py`と`prod.py`を作成．
        ```
        ├ {PRJNAME}/
            ├ __init__.py
            ├ asgi.py
            ├ settings/
                ├ base.py [旧settings.pyを改名]
                ├ base.py.bk [base.pyの初期状態の確認用．無くても良い．]
                ├ local.py
                ├ prod.py
            ├ settings.py.bk [旧setting.py．消して良い．]
            ├ urls.py
            ├ wsgi.py
        ```
        - **シークレット情報に関するセキュリティの観点から，`settings.py.bk`で下記を書き換えておくべき**
            ```
            # SECURITY WARNING: keep the secret key used in production secret!
            SECRET_KEY = '??????????????????????????????????????????????????????????'
            ```
    2. 共通用`{PRJNAME}/{PRJNAME}/settings/base.py`に対し，初期状態(settings.pyのコピー)から下記の変更をする．  
    ほかの項目については，基本的に後述の`local.py`・`prod.py`における個別設定で上書きする形にするので消さずに残して良い．
        ```
        ## 追加
        PRJNAME = '{PRJNAME}'


        ## manager.pyのあるディレクトリを指す
        ## settings.pyがsettingsディレクトリになって1層下がったので変更．
        BASE_DIR = Path(__file__).resolve().parent.parent.parent
        
        
        ## 変更
        LANGUAGE_CODE = 'ja'
        ## 変更
        TIME_ZONE = 'Asia/Tokyo'
        ```
        - 初期状態は`{PRJNAME}/{PRJNAME}/settings/base.py.bk`を参照．
        - 後述の開発用`local.py`と本番用`prod.py`の両方で全く同じ独自の設定値を適用する項目を`base.py`で管理し，`local.py`・`prod.py`にimportする形で読み込ませる．
            - `local.py`・`prod.py`に個別に設定する項目は，`base.py`から削除して良いし，もしくは上書きする形で管理しても良い．
            - 異なる設定値になるものというと，後述するがデバッグモード・DB情報・ファイル配置場所・シークレット情報の読み込みとかだろうか．
        - ここでの変更箇所の説明
            - 旧`settings.py`が更に1つ下のディレクトリに移動しているので，`BASE_DIR`を変更する．
                ```
                # BASE_DIR = Path(__file__).resolve().parent.parent
                # 上を下にする
                BASE_DIR = Path(__file__).resolve().parent.parent.parent
                ```
                ```
                # BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                # 上を下にする
                BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
                ```
            - 冒頭の方に`PJRNAME`を追加
                - ロギングのディレクトリとかで**結構使うのでぜひ設定してほしい**
            - `LANGUAGE_CODE`と`TIME_ZONE`を変更して日本仕様にする
    3. 開発用の用意
        - `{PRJNAME}/{PRJNAME}/settings/local.py`
            ```
            import os
            from .base import *
            # secretsファイルからは，一括importはせずに，個別importをするように心がける
            from .local_secrets import (
                SECRET_KEY,
                DATABASES
            )

            ## base.pyでTrueにしてあるが，念の為上書きの形で設定．
            DEBUG = True


            #==================================================================
            # secretsファイルからimportした変数で，baseファイルの値を上書き・追加
            #------------------------------------------------------------------
            ## base.pyを上書き
            SECRET_KEY = SECRET_KEY
            ## base.pyを上書き
            DATABASES = DATABASES
            ```
            - シークレット情報をまとめるsecretsファイルである`local_secrets.py`は[シークレット情報管理体制の用意](#separate_secrets)にて作成．
        - `{PRJNAME}/manage.py`で下記を変更
            ```
            # os.environ.setdefault('DJANGO_SETTINGS_MODULE', '{PRJNAME}.settings')
            # 上を下にする
            os.environ.setdefault('DJANGO_SETTINGS_MODULE', '{PRJNAME}.settings.local')
            ```
    4. 本番用の用意
        - `{PRJNAME}/{PRJNAME}/settings/prod.py`の例
            ```
            import os
            from .base import *


            ## base.pyを上書き
            DEBUG = False


            ## base.pyを上書き
            SECRET_KEY = os.environ['{}_DJANGO_SECRET_KEY'.format(PRJNAME.upper())]


            ## base.pyを上書き
            DATABASES = {
                'default': {
                    'ENGINE': os.environ['{}_DB_ENGINE'.format(PRJNAME.upper())],
                    'NAME': os.environ['{}_DB_NAME'.format(PRJNAME.upper())],
                }
            }
            ```
            - シークレット情報であるものは基本的に環境変数に登録し，そこから`os.environ[]`で読み込むようにする．
        - `{PRJNAME}/{PRJNAME}/wsgi.py`で下記を変更
            ```
            # os.environ.setdefault('DJANGO_SETTINGS_MODULE', '{PRJNAME}.settings')
            # 上を下にする
            os.environ.setdefault('DJANGO_SETTINGS_MODULE', '{PRJNAME}.settings.prod')
            ```
    - 他の設定変数として`ALLOWED_HOSTS`・`INSTALLED_APPS`・`MIDDLEWARE`・`CORS_ORIGIN_WHITELIST`あたりは(CORS対策とかもあって)重要なので理解したほうが良さげ
        - 基本的に[4.1で使うので，そちら参照．](#add_settings_django_restapi)
    - 参考
        - [[Django] プロジェクト構成のベストプラクティスを探る - ２．設定ファイルを本番用と開発用に分割する](https://qiita.com/okoppe8/items/e60d35f55188c0ab9ecc)
        - [Django環境の切り替えメモ](https://ikura-lab.hatenablog.com/entry/2019/06/16/142339)
        - [Djangoの設定ファイルを開発用と本番用に分割する](https://medium.com/@kjmczk/django-multiple-settings-2a4c15c7c7b0)
        - [Django入門 (settings.py)](https://www.tohoho-web.com/django/settings.html)
        - [Djangoの設定ファイルを編集する](https://medium.com/@kjmczk/django-settings-c29eb629223)
        - [設定変更](https://tutorial.djangogirls.org/ja/django_start_project/#%E8%A8%AD%E5%AE%9A%E5%A4%89%E6%9B%B4)
        - [【Django】静的ファイル関連の設定について(css,js)](https://qiita.com/Suchmos7/items/eb61727a3f65883028a6)
        - [Django REST Framework (DRF）のインストール・設定とCORS対策をする／python・django](https://arakan-pgm-ai.hatenablog.com/entry/2019/06/17/000000)
            - [Django REST Framework (DRF）のAPIView・api_viewを使ったWebApiプロキシ／python・django](https://arakan-pgm-ai.hatenablog.com/entry/2019/06/19/000000)
            - [Django REST Framework でheadersやparamsを使う「Web-APIプロキシ」を作る](https://arakan-pgm-ai.hatenablog.com/entry/2019/09/06/000000)
        - [脱・とりあえず動く[CORS編]](https://qiita.com/karintou/items/52ee1f7c5fa641980188)
4. <a id="separate_secrets">シークレット情報管理体制の用意</a>
    1. `{PRJNAME}/{PRJNAME}/settings/local_secrets.py`を作成
    2. `{PRJNAME}/{PRJNAME}/settings/local.py`から下記コードを`{PRJNAME}/{PRJNAME}/settings/local_secrets.py`に移動
        ```
        import os
        from .base import *

        SECRET_KEY = 'django-???????????????????????????'


        DATABASES = {
            'default': {
                'ENGINE': '',
                'NAME': BASE_DIR / '',
            }
        }
        ```
        - その他，DB情報やAPIキーなど，Githubにpushされたくない・本番環境では環境変数に登録した方が安全な変数は全て移動させておく．
    3. `{PRJNAME}/{PRJNAME}/settings/local.py`に`{PRJNAME}/{PRJNAME}/settings/local_secrets.py`からインポートする下記コードを追記
        ```
        from .local_secrets import *
        ```
        - 一応，`{PRJNAME}/{PRJNAME}/settings/local.py`作成時にすでに書いてある．
    4. `.gitignore`に下記を追加
        ```
        *secrets.py
        ```
    5. `{PRJNAME}/{PRJNAME}/settings/local_secrets.py`を同じ場所に`local_secrets.py.txt`等の名前でコピーし，中身のシークレット情報を消すなどする
        - git pushしていいのは，`local_secrets.py`ではなく`local_secrets.py.txt`のみであることを意識する
    6. 本番環境でのシークレット情報の読み込みにおいては，`{PRJNAME}/{PRJNAME}/settings/prod.py`で下記のように`os.environ[]`で環境変数から読み込む形に書き換える．
        ```
        ## base.pyを上書き
        SECRET_KEY = os.environ['{}_DJANGO_SECRET_KEY'.format(PRJNAME.upper())]


        ## base.pyを上書き
        DATABASES = {
            'default': {
                'ENGINE': os.environ['{}_DB_ENGINE'.format(PRJNAME.upper())],
                'NAME': os.environ['{}_DB_NAME'.format(PRJNAME.upper())],
            }
        }
        ```
        - 一応，`{PRJNAME}/{PRJNAME}/settings/prod.py`作成時にすでに書いてある．
    - 参考
        - [Djangoで秘密鍵やAPIキーなど”隠したい情報”を分けて管理する](https://hodalog.com/hiding-djangos-secret-key/)
5. ロギングの用意
    1. `{PRJNAME}/{PRJNAME}/logger/logger.py`を作成し，下記を実装
        ```
        import os
        from logging import getLogger
        from logging.config import dictConfig
        from .local_conf import CONF_LOGGING_LOCAL
        from .prod_conf import CONF_LOGGING_PROD

        def get_logging_conf(PRJNAME, BASE_DIR, DEBUG = True):
            '''
            - Args
                - PRJNAME:str: 
                - BASE_DIR:str: Djangoのプロジェクト作成時に生成される"settings.py"にある"BASE_DIR"で指定し，manage.pyと同じディレクトリにするのも良し．
                - DEBUG:bool: 
            '''
            conf_logger = None
            if DEBUG:
                conf_logger = CONF_LOGGING_LOCAL(PRJNAME, BASE_DIR)
            else:
                conf_logger = CONF_LOGGING_PROD(PRJNAME, BASE_DIR)
            
            # ここでログ出力先のディレクトリ生成
            for file_handler in conf_logger["handlers"]:
                if "filename" not in conf_logger["handlers"][file_handler]:
                    continue
                os.makedirs("/".join(conf_logger["handlers"][file_handler]["filename"].split("/")[:-1]) + "/", exist_ok = True)

            return conf_logger


        def get_logger(appname):
            '''
            自前実装のコード上でloggingオブジェクトでログ出力を実装したい場合，各モジュールの冒頭でこの関数を用いてloggingオブジェクトを取得して使用する．
            関数の引数にこの関数を渡して下位レイヤのコードに渡すことも可能．
            '''
            return getLogger(appname)
        ```
    2. 開発・本番環境用のロギング設定ファイルを用意
        - 開発: `{PRJNAME}/{PRJNAME}/logger/local_conf.py`
            ```
            import os

            def CONF_LOGGING_LOCAL(PRJNAME, BASE_DIR):
                return {
                    "version": 1,
                    "disable_existing_loggers": False,
                    "formatters": {
                        "default": {
                            # 変更不可
                            "format": "%(asctime)s.%(msecs)03d@%(filename)s:%(levelname)s: %(message)s",
                            "datefmt": "%Y-%m-%d %H:%M:%S"
                        },
                        # 適宜追加して切り替えてOK
                    },
                    "handlers": {
                        "consoleHandler": {
                            "class": "logging.StreamHandler",
                            "stream": "ext://sys.stdout",
                            "formatter": "default",
                            # 以下，適宜変更必要
                            "level": "DEBUG"
                        },
                        "fileHandler": { # (*1)ファイル出力不要ならコメントアウト
                            "class": "logging.FileHandler",
                            "formatter": "default",
                            # 以下，適宜変更必要
                            "level": "DEBUG",
                            "filename": os.path.join(
                                BASE_DIR,
                                "logs/{prjname}/app.log".format(prjname = PRJNAME))
                        },
                        # 適宜追加して切り替えてOK
                    },
                    "loggers": {
                        "": {
                            "level": "DEBUG",
                            "handlers": [
                                "consoleHandler",
                                "fileHandler" # (*1)ファイル出力不要ならコメントアウト
                            ],
                            "propagate": False
                        },
                        "django": {
                            "level": "DEBUG",
                            "handlers": [
                                "consoleHandler",
                                "fileHandler" # (*1)ファイル出力不要ならコメントアウト
                            ],
                            "propagate": False
                        },
                        # 適宜追加してOK
                    },
                }
            ```
            - 開発ではファイル出力に加えコンソール画面出力も設定可能
        - 本番: `{PRJNAME}/{PRJNAME}/logger/prod_conf.py`
            ```
            def CONF_LOGGING_PROD(PRJNAME, BASE_DIR):
                return {
                    "version": 1,
                    "disable_existing_loggers": False,
                    "formatters": {
                        "default": {
                            # 変更不可
                            "format": "%(asctime)s.%(msecs)03d@%(filename)s:%(levelname)s: %(message)s",
                            "datefmt": "%Y-%m-%d %H:%M:%S"
                        },
                        # 適宜追加して切り替えてOK
                    },
                    "handlers": {
                        "fileHandler": {
                            "class": "logging.FileHandler",
                            "formatter": "default",
                            # 以下，適宜変更必要
                            "level": "INFO",
                            "filename": os.path.join(
                                BASE_DIR,
                                "logs/{prjname}/app.log".format(prjname = PRJNAME))
                        },
                        # 適宜追加して切り替えてOK
                    },
                    "loggers": {
                        "": {
                            "level": "INFO",
                            "handlers": ["fileHandler"],
                            "propagate": False
                        },
                        "django": {
                            "level": "INFO",
                            "handlers": ["fileHandler"],
                            "propagate": False
                        },
                        # 適宜追加してOK
                    },
                }
            ```
            - 本番ではファイル出力のみ有効にする
        3. 設定`LOGGING`を設定ファイルに記述するが，下記の書き方で開発・本番で共通するので，`{PRJNAME}/{PRJNAME}/settings/base.py`に書いちゃって良いかも．
            ```
            from ..logger.logger import get_logging_conf
            
            ## 追加
            LOGGING = get_logging_conf(PRJNAME, BASE_DIR, DEBUG = DEBUG)
            ```
            - `PRJNAME`・`BASE_DIR`・`DEBUG`はこれまでに`settings`に記述した変数を使う
        4. `.gitignore`に下記を追加してpushされないようにする
            ```
            **/logs/**/*.log
            ```
    - 参考
        - [【Django】ログ出力機能について簡単にまとめる](https://qiita.com/thim/items/4fe17c427e6f917248f4)
        - [[Django] プロジェクト構成のベストプラクティスを探る - ４．ログ設定をシンプルにする](https://qiita.com/okoppe8/items/b56499fc04e6c2193b9d)
        - [【Python】我流logging使用方法 ~Databricks版を添えて~](https://www.shadowmoheji.gq/article.php?link=d34)
6. アプリディレクトリの作成
    1. 初期ディレクトリの作成
        ```
        $ mkdir -p /opt/workspace/backend/{PRJNAME}/apps/{APPNAME}
        $ cd /opt/workspace/backend/{PRJNAME}
        $ pipenv run django_app {APPNAME} ./apps/{APPNAME}
        ```
        - 下記ディレクトリができるはず
            ```
            ├ {PRJNAME}/
                ├ manage.py
                ├ {PRJNAME}/
                    ├ ...
                ├ apps/ [ここを作った]
                    ├ {APPNAME}/
                        ├ migrations/
                        ├ __init__.py
                        ├ admin.py
                        ├ apps.py
                        ├ models.py
                        ├ tests.py
                        ├ views.py
            ```
    2. `APPNAME`の関連ソース(静的ファイル・テンプレート等)のディレクトリを作成
        ```
        $ mkdir -p /opt/workspace/backend/{PRJNAME}/templates/{APPNAME}
        $ mkdir -p /opt/workspace/backend/{PRJNAME}/static/{APPNAME}
        $ mkdir -p /opt/workspace/backend/{PRJNAME}/media/{APPNAME}
        ```
        - 下記ディレクトリになるはず
            ```
            ├ {PRJNAME}/
                ├ manage.py
                ├ {PRJNAME}/
                    ├ ...
                ├ apps/
                    ├ {APPNAME}/
                        ├ ...
                ├ templates/ [ここを作った]
                    ├ {APPNAME}/
                ├ static/ [ここを作った]
                    ├ {APPNAME}/
                ├ media/ [ここを作った]
                    ├ {APPNAME}/
            ```
    3. 共通・開発・本番の設定ファイルへの関連ソースの反映
        - 共通：`{PRJNAME}/{PRJNAME}/settings/base.py`
            ```
            INSTALLED_APPS = [
                'django.contrib.admin',
                'django.contrib.auth',
                'django.contrib.contenttypes',
                'django.contrib.sessions',
                'django.contrib.messages',
                'django.contrib.staticfiles',
                ## 追加
                'apps.{APPNAME}', # 'apps.{APPNAME}.apps.{Appname}Config',
            ]


            TEMPLATES = [
                {
                    'BACKEND': 'django.template.backends.django.DjangoTemplates',
                    'DIRS': [
                        ## 追加
                        BASE_DIR / "templates", # os.path.join(BASE_DIR, 'templates')
                    ],
                    'APP_DIRS': True,
                    'OPTIONS': {
                        'context_processors': [
                            'django.template.context_processors.debug',
                            'django.template.context_processors.request',
                            'django.contrib.auth.context_processors.auth',
                            'django.contrib.messages.context_processors.messages',
                        ],
                    },
                },
            ]


            STATIC_URL = '/static/'
            ## 追加
            STATICFILES_DIRS = [
                BASE_DIR / 'static' # os.path.join(BASE_DIR, 'static')
            ]


            ## 追加
            MEDIA_URL = '/media/'
            ```
        - 開発：`{PRJNAME}/{PRJNAME}/settings/local.py`
            ```
            # Path of static files
            ## base.pyに追加
            STATIC_ROOT = BASE_DIR / 'static_root' # os.path.join(BASE_DIR, 'static_root')


            # Path of media files
            ## base.pyに追加
            MEDIA_ROOT = BASE_DIR / 'media_root' # os.path.join(BASE_DIR, 'media_root')
            ```
        - 商用：`{PRJNAME}/{PRJNAME}/settings/prod.py`
            ```
            # Path of static files
            ## base.pyに追加
            STATIC_ROOT = '/var/www/{prjname}/static'.format(prjname = PRJNAME)


            # Path of media files
            ## base.pyに追加
            MEDIA_ROOT = '/var/www/{prjname}/media'.format(prjname = PRJNAME)
            ```
    4. もし，`$ pipenv run migrate`してエラー`django.core.exceptions.ImproperlyConfigured: Cannot import '{APPNAME}'. Check ~`が出てしまったら，`{PRJNAME}/apps/{APPNAME}/apps.py`にて，下記のように変数`name`にディレクトリ名を含めるように修正する必要あり．
        ```
        from django.apps import AppConfig


        class {Appname}Config(AppConfig):
            default_auto_field = 'django.db.models.BigAutoField'
            ## 下記変更(ディレクトリ"apps."を追加)
            name = 'apps.{APPNAME}'
        ```
    5. アプリディレクトリにおいて更にディレクトリ分割をする
        1. Views(Controller相当であり，セッションから得るデータをModelへ渡したりModelから得るデータを画面やフロントエンドに渡し，ページ遷移させるフェーズ)のディレクトリ分割
            1. 下記のように変更する
                - 変更前(アプリディレクトリの初期構成)
                    ```
                    ├ {PRJNAME}/
                        ├ manage.py
                        ├ apps/
                            ├ {APPNAME}/
                                ├ views.py [ここを…]
                                ├ ...
                    ```
                - 変更後
                    ```
                    ├ {PRJNAME}/
                        ├ manage.py
                        ├ apps/
                            ├ {APPNAME}/
                                ├ views/ [こうする]
                                    ├ user.py [例えば(1人分の)ユーザ情報に関するControllerの場合こう名付ける？]
                                ├ ...
                    ```
            2. コードとしては`{PRJNAME}/apps/{APPNAME}/views/user.py`では下記になるだろうか(超簡易的だけどイメージサンプルだけ)．
                ```
                from django.shortcuts import render
                from django.core import serializers
                from django.http import HttpResponse
                from ..models.user import User

                def get_user(req, user_id):
                    print(req.GET)
                    # Get an user from DB with user_id here...
                    # user = User.objects.create(user_id = user_id, name = "user{}".format(user_id))
                    user = User(user_id = user_id, name = "user{}".format(user_id))
                    return HttpResponse(
                        serializers.serialize("json", [user]),
                        content_type = "application/json")
                ```
        2. Models(Entity&Service相当であり，DBやAPI等データの定義や格納・保持(ORM使用してる？)するフェーズ)のディレクトリ分割
            1. 下記のように変更する
                - 変更前(アプリディレクトリの初期構成)
                    ```
                    ├ {PRJNAME}/
                        ├ manage.py
                        ├ apps/
                            ├ {APPNAME}/
                                ├ models.py [ここを…]
                                ├ ...
                    ```
                - 変更後
                    ```
                    ├ {PRJNAME}/
                        ├ manage.py
                        ├ apps/
                            ├ {APPNAME}/
                                ├ models/ [こうする]
                                    ├ user.py [例えばユーザ情報を格納するModelの場合こう名付ける？]
                                ├ ...
                    ```
            2. コードとしては`{PRJNAME}/apps/{APPNAME}/models/user.py`では下記になるだろうか(未使用だけどイメージサンプルだけ)．
                ```
                from django.db import models

                class User(models.Model):
                    user_id = models.IntegerField(max_length = 5)
                    name = models.CharField(max_length = 100)
                ```
        3. URLs(Router相当であり，入力としてのURLパスから処理分岐するフェーズ)のディレクトリ分割
            1. 下記のように変更する
                - 変更前(アプリディレクトリの初期構成)
                    ```
                    ├ {PRJNAME}/
                        ├ manage.py
                        ├ {PRJNAME}/
                            ├ urls.py
                        ├ apps/
                            ├ {APPNAME}/
                                ├ ... [初期構成にurls.pyが無いので…]
                    ```
                - 変更後
                    ```
                    ├ {PRJNAME}/
                        ├ manage.py
                        ├ {PRJNAME}/
                            ├ urls.py
                        ├ apps/
                            ├ {APPNAME}/
                                ├ urls.py [こうする]
                                ├ ...
                    ```
            2. コードとしては下記2つのファイルにおいて，下記のように連携する感じになるだろうか．
                - `{PRJNAME}/apps/{APPNAME}/urls.py`
                    ```
                    from django.urls import path
                    from .views.user import get_user

                    urlpatterns = [
                        path("user/<int:user_id>", get_user)
                    ]
                    ```
                - `{PRJNAME}/{PRJNAME}/urls.py`
                    ```
                    from django.contrib import admin
                    from django.urls import (
                        path,
                        # 追加
                        include
                    )

                    urlpatterns = [
                        path('admin/', admin.site.urls),
                        path("sample/", include("apps.sample.urls"))
                    ]
                    ```
    - 参考
        - [startapp with manage.py to create app in another directory](https://stackoverflow.com/questions/33243661/startapp-with-manage-py-to-create-app-in-another-directory/33243738#33243738)
        - [【Python】Django おすすめのディレクトリ構成【django 3.2対応】(Best practice for Django project directory structure)](https://plus-info-tech.com/django-pj-directory-structure)
        - [Django Project Structure Best Practice 2019](https://studygyaan.com/django/best-practice-to-structure-django-project-directories-and-files)
        - 採用しなかったがこういうディレクトリ構造もある
            - [Django ベスト・プラクティス](https://qiita.com/F_clef/items/687e79691d3aa961cbd7)
            - [Django 作業ディレクトリ構造のベストプラクティス](https://www.delftstack.com/ja/howto/django/django-project-structure/)
        - [Djangoで、アプリ用ディレクトリを作成し、INSTALLED_APPSにAppConfigのサブクラスを設定してみた](https://thinkami.hatenablog.com/entry/2018/05/28/074909#%E8%A8%AD%E5%AE%9A%E6%96%B9%E6%B3%95)
        - [分ける](https://qiita.com/F_clef/items/687e79691d3aa961cbd7#%E5%88%86%E3%81%91%E3%82%8B)
        - [はじめてのDjango (3) 簡単なview関数とurlルーティング，および，urlからのパラメータ取得とtemplate](https://qiita.com/j54854/items/201ecbe55017fd2a7996)
        - [ジャンゴ(django)のモデル(Models)をJSONタイプでレスポンス(Response)する](https://dev-yakuza.posstree.com/django/response-model-to-json/)
        - [[Django] Modelのテスト](https://dev-yakuza.posstree.com/django/test/models/)
            - [Djangoのmodelのcreate()の使い方【Python】](https://yu-nix.com/blog/2020/11/27/django-create/)
            - `models.Model.objects.create()`はテーブル投入までやってしまう
        - [djangoのmodelsをテストする](https://blog.mtb-production.info/entry/2019/07/10/090000#django%E3%81%AEmodels%E3%82%92%E3%83%86%E3%82%B9%E3%83%88%E3%81%99%E3%82%8B)
            - DBなしでModelsのオブジェクトを作るコードが有る
        - 直接関係ないけどRestAPIで使うSerializerについて
            - [[Django REST Framework] Serializer の 使い方 をまとめてみた](https://note.crohaco.net/2018/django-rest-framework-serializer/)
            - [How do you serialize a model instance in Django?](https://stackoverflow.com/a/3289057/15842506)
        - [DjangoでGETリクエストのクエリパラメータを取得](https://qiita.com/RyoMa_0923/items/8b13fefc5b284677dfe1)
- Djangoでまだわからないこと
    - 管理者画面
    - ログイン・認証
    - DB接続
        - SQLそのものを実行する方法もあるようだが？
    - クラス指向でのView(Controller)実装
        - なんかget/postメソッドとか持ってた
    - RestAPI，SSR(HTMLレンダリング)
        - Serializer
    - テンプレートエンジン
    - migrateコマンド
        - [Django入門その後に(6)〜migrateって何〜](https://farewell-work.hatenablog.com/entry/2017/05/07/160813)



### 3. フロントエンド(Vue)の構築
- とりまメモ
    - backendとfrontendの位置づけについて，下記2つがあるが，どちらが良いかわからんので，ひとまず1.で進める．
        1. 完全分離
            ```
            backend/
                ├ {PRJNAME}/
                    ├ manage.py
                    ├ {PRJNAME}/
                        ├ ...
                    ├ apps/
                    ├ templates/
                    ├ static/
                    ├ media/
            ├ frontend/
                ├ ... [ここにfrontendを配置]
            ```
        2. frontend埋め込み型
            ```
            (backend){PRJNAME}/
                ├ manage.py
                ├ {PRJNAME}/
                    ├ ...
                ├ apps/
                ├ templates/
                ├ static/
                ├ media/
                ├ vue/
                    ├ ... [ここにfrontendを配置]
            ```
1. 開発ディレクトリの作成．
    ```
    $ mkdir -p /opt/workspace/frontend
    $ cd /opt/workspace/frontend
    $ npm init
    package name: (frontend)
    version: (1.0.0)
    description:
    entry point: (index.js)
    test command:
    git repository:
    keywords:
    author:
    license: (ISC)
    ```
    - 特に何も入力せずにEnter
2. VueCLIインストール
    ```
    $ npm install --save-dev @vue/cli
    $ npx vue --version
    ```
    - 参考
        - [vue-cliをグルーバルにインストールせずにプロジェクト作成する](https://gist.github.com/skysan87/5e323834552501f7cee475b26d56a4ce)
3. プロジェクトディレクトリの作成
    ```
    $ cd /opt/workspace/frontend/
    $ npx vue create {PRJNAME}
    ```
    - 試しに開発サーバ起動してみる
        ```
        $ cd /opt/workspace/frontend/{PRJNAME}
        $ npm run serve -- --host 0.0.0.0 --port 8122
        ```
        - ホスト名とポート番号は，Dockerのフォワーディングに則る
        - 参考
            - [How to change port number in vue-cli project](https://stackoverflow.com/a/51343026/15842506)
    - `Manually select features`を選択して下記設定をしてPJを作成した
        - Vue Version: `2.x`
        - linter/formatter: `ESLint + Prettier`
        - additional lint features: `Lint on save`
        - prefer placing config: `In dedicated config files`
        - save this as a preset: `y`
        - preset name: ひとまず`vue2_sample`
    - 参考
        - [Vue CLI の変更点・使い方(vue-cliから@vue/cliにアップデート)](https://qiita.com/Junpei_Takagi/items/603d44f7885bd6519de2)
4. 依存ライブラリのインストール
    ```
    $ cd /opt/workspace/frontend/{PRJNAME}
    $ npm install --no-optional --save-dev axios vue-session vuex vue-router
    ```
5. 静的解析・ビルドの設定
    1. 依存ライブラリのインストール
        ```
        $ cd /opt/workspace/frontend/{PRJNAME}
        $ npm install --no-optional --save-dev prettier eslint-plugin-vue eslint-plugin-prettier webpack-bundle-analyzer @vue/eslint-config-prettier
        ```
        - 開発途中で`webpack`をアンインストールしてしまった場合は，`package-lock.json`と`node_modules/`を消して`npm install`し直す必要あり．
        - 参考
            - [Vue CLIのデフォルト設定からESLintのベストプラクティスを検討する](https://future-architect.github.io/articles/20210616a/)
    2. PJ作成時の設定により自動生成済みの`{PRJNAME}/.eslintrc.js`に対し下記を記述
        ```
        module.exports = {
            root: true,
            env: {
                node: true,
                // 以下，追加
                // browser: true, // いるかな？
                // commonjs: true, // いるかな？
                "es2020": true, // いるかな？
            },
            extends: [
                "plugin:vue/essential",
                "eslint:recommended",
                "@vue/prettier",
                // 以下，追加
                "plugin:prettier/recommended",
                "prettier",
            ],
            parserOptions: {
                parser: "babel-eslint",
                ecmaVersion: 2020, // いるかな？
            },
            rules: {
                "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
                "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
                // 以下，追加
                "no-empty-character-class": "error",
                "no-eval": ["error"],
                "no-trailing-spaces": ["error"],
                "no-unsafe-finally": "error",
                "no-whitespace-before-property": "error",
                "spaced-comment": ["error", "always"],
                "brace-style": ["warn", "1tbs"], // if-else等の改行記法
                "indent": ["error", 4, {"SwitchCase": 1}], // switch文のインデントの取り方もここで指定
                "quotes": ["error", "double", {"avoidEscape": true}],
                "semi": ["error", "always"],
                "prettier/prettier": "error",
            },
        };
        ```
    3. `{PRJNAME}/.prettierrc.js`を作成して下記を記述
        ```
        module.exports = {
            tabWidth: 4,
            tabs: true,
            singleQuote: false,
            semi: true,
        };
        ```
    4. `{PRJNAME}/vue.config.js`を作成して下記を記述
        ```
        const path = require("path");
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

        module.exports = {
            configureWebpack: {
                resolve: {
                    alias: {
                        // importのルートパスを指定
                        // "~"でも良いが，静的(画像)ファイルのパス指定におけるプレフィクスの"~"とかぶってわかりにくそう．
                        // "#"だと，静的ファイルの読み込みのパス指定ができなかった
                        "@": path.resolve(__dirname, "src")
                    }
                },
                plugins: [
                    new BundleAnalyzerPlugin({
                        // "$ npm run analyze"の設定
                        analyzerMode: "static",
                        reportFilename: "stats/app.html",
                        statsFilename: "stats/stats.json",
                        generateStatsFile: true,
                        openAnalyzer: false,
                        defaultSizes: "gzip",
                        statsOptions: null,
                        logLevel: "info"
                    })
                ]
            }
        }
        ```
        - webpackとほぼ同じ設定はこちらで行う．
            - importのalias周り
                - CSS・静的ファイルに対しても有効
            - ~~styleloader周り~~(やんない方が良さげ．なんか互換性ないとかのエラーでまくる)
            - WebpackBundleAnalyzer周り
        - 参考
            - [全vueファイルで共通のCSSを読み込みたい](https://www.maytry.net/start-pwa-by-vue-cli-3/#vuecss)
    5. 上記設定で`$ npm run serve`すると，下記エラーが出ると思うので，動くまで適宜修正
        - `App.vue`で`no-multiple-template-root`
        - セミコロン忘れ
        - インデント幅を2から4に
        - シングルクォーテーションをダブルクォーテーションに
        - あるいは，`{PRJNAME}/package.json`に下記を追加して`$ npm run onefix {修正対象のファイル}`でサクサクやってOK．
            ```
            {
                "scripts": {
                    "onefix": "eslint --fix", // これを追加
                }
            }
            ```
    6. ホットリロードがデフォルトでオフになってると思うので，`{PRJNAME}/vue.config.js`に下記を追加して有効にする
        ```
        module.exports = {
            configureWebpack: {
                devServer: { // これを追加
                    watchOptions: {
                        poll: true
                    }
                },
                ...
            }
        };
        ```
        - 参考
            - [【メモ】Vue CLI でホットリロードが効かない](https://qiita.com/ntm718/items/6023b0063f78d53192a1)
    7. 装飾系(css/scss/sass)の静的解析の設定
        1. ライブラリのインストール
            ```
            $ cd /opt/workspace/frontend/{PRJNAME}
            $ npm install --no-optional --save-dev stylelint stylelint-scss stylelint-config-recommended stylelint-config-recommended-scss stylelint-webpack-plugin sass-loader node-sass style-loader
            ```
            - `sass-loader@10`と`node-sass`はSCSSを使えるための後付けインストール．
                - Vue3では`sass-loader@10`じゃないとエラー出たが，Vue2では問題ないらしい？いや，`webpack@4`がそのバージョンじゃないといけないのかな？
            - `style-loader`はたぶん使われてないけど念の為．
        2. `{PRJNAME}/vue.config.js`に下記を追加
            ```
            const StylelintPlugin = require("stylelint-webpack-plugin"); // ここを追加
            
            module.exports = {
                configureWebpack: {
                    plugins: [
                        new StylelintPlugin({ // ここを追加
                            // https://webpack.js.org/plugins/stylelint-webpack-plugin/
                            configFile: "./.stylelintrc.js",
                            files: "src/**/*.{css,scss,vue}",
                            fix: false
                        }),
                    ]
                }
            };
            ```
        3. `{PRJNAME}/.stylelintrc.js`を作成して下記のように記述
            ```
            module.exports = {
                extends: [
                    "stylelint-config-recommended-scss"
                ],
                plugins: [
                    "stylelint-scss"
                ],
                rules: {
                    "no-duplicate-selectors": [
                        true,
                        {disallowInList: true}
                    ]
                }
            };
            ```
        4. `{PRJNAME}/package.json`にてショートカットコマンドを追加
            ```
            {
                "scripts": {
                    "lint@scss": "stylelint src/**/*.{vue,css,scss}", // これを追加
                    "fix@style": "stylelint --fix", // これを追加
                }
            }
            ```
            - `npm run serve`でもWebpackのPluginにより動いてくれるはず
        5. SCSSを使いたい場合は，`<style lang="scss"></style>`のようにlangオプションを付ければ良い．
        - 参考
            - [.vueファイルの中にscssを書きたくてsass-loaderいれたが、すごくerrorが出る件](https://zenn.dev/466548/articles/9b3c73346751e3)
6. 開発ディレクトリの分割・整理
    - 今回はAtomicDesignでの開発手法に則ってみる
    1. `{PRJNAME}/src/`にて下記ディレクトリを作成
        ```
        $ mkdir -p /opt/workspace/frontend/{PRJNAME}/src/components/atoms
        $ mkdir -p /opt/workspace/frontend/{PRJNAME}/src/components/molecules
        $ mkdir -p /opt/workspace/frontend/{PRJNAME}/src/components/organisms
        $ mkdir -p /opt/workspace/frontend/{PRJNAME}/src/components/templates
        $ mkdir -p /opt/workspace/frontend/{PRJNAME}/src/components/pages
        $ mkdir -p /opt/workspace/frontend/{PRJNAME}/src/routes
        $ mkdir -p /opt/workspace/frontend/{PRJNAME}/src/stores
        $ mkdir -p /opt/workspace/frontend/{PRJNAME}/src/plugins
        $ mkdir -p /opt/workspace/frontend/{PRJNAME}/src/mockserver
        ```
        - 下記になるはず
            ```
            ├ {PRJNAME}/
                ├ ...
                ├ src/
                    ├ assets/
                    ├ components/
                        ├ atoms/
                        ├ molecles/
                        ├ organisms/
                        ├ templates/
                        ├ pages/
                    ├ routes/
                    ├ stores/
                    ├ plugins/
                    ├ mockserver/
                    ├ App.vue
                    ├ main.js
            ```
        - `plugins/`は，vuetifyやelementuiなど追加プラグインの設定取り込み・exportするコードをまとめる場所．
    2. `{PRJNAME}/src/components/pages/`にてbackendで作成したAPPNAMEに対応するディレクトリを作成
        ```
        $ mkdir -p /opt/workspace/frontend/{PRJNAME}/src/components/pages/{APPNAME}
        ```
        - もしかすると，ディレクトリを作らずに下記のようにVueファイル単体で済ませたほうが良いのかも．
            ```
            $ touch /opt/workspace/frontend/{PRJNAME}/src/components/pages/{APPNAME}.vue
            ```
7. ElementUIの導入
    - Vuetifyよりシンプルそうだったので，スピード求める場合はこちらが良さそう
    1. インストール
        ```
        $ cd /opt/workspace/frontend/{PRJNAME}
        $ npm install --no-optional --save-dev element-ui style-loader
        ```
        - ~~`--save`側にインストールする必要があるらしい~~
        - style-loaderが依存かは確定していないが，とりあえず…
    2. コードへの導入
        - `{PRJNAME}/src/plugins/elementui.js`
            ```
            import Vue from "vue";
            import ElementUI from "element-ui";
            import locale from "element-ui/lib/locale/lang/ja";
            import "element-ui/lib/theme-chalk/index.css";

            Vue.use(ElementUI, { locale });
            ```
        - `{PRJNAME}/src/main.js`
            ```
            import Vue from "vue";
            import App from "@/App.vue";
            import RootRouter from "@/routes/Root";
            import "@plugins/elementui";
            /*
            以下，CSSのglobalインポート．
            */
            import "@/styles/base.css";

            Vue.config.productionTip = false;

            new Vue({
                router: RootRouter,
                render: (h) => h(App),
            }).$mount("#app");
            ```
        - `element-ui/lib/locale/lang/ja`を使うことで，日本語仕様になるらしい
        - `ja.js`と`index.css`について，公式に従えばいいが，一般記事だと古くてPathが違っていたりする．
    - 参考
        - [Installation](https://element.eleme.io/#/en-US/component/installation)
        - [Vue.jsで高品質なUIライブラリElementを使ってみる](https://www.webopixel.net/javascript/1229.html)
        - [Element UI で Vue Router のナビゲーション設定方法](https://www.webopixel.net/javascript/1472.html)
8. TailWindCSSの導入
    - 今回はやらないけど，最終的なCSSフレームワークとしてはこれに落ち着きたいかも



### 4. アプリ開発(Django RestAPI + Vue)
#### バックエンド(Django)
1. 管理者画面にアクセスしてみる
    - TODO
        - アプリディレクトリ決まったら，先にVue環境構築の方行っていいかも．
        - PostgreSQLのコンテナ作る必要あるかな～
2. <a id="add_settings_django_restapi">開発(`{PRJNAME}/{PRJNAME}/settings/local.py`)・本番(`{PRJNAME}/{PRJNAME}/settings/prod.py`)の設定ファイルで，RestAPIとしての各種設定を追加する．</a>
    - 開発：`{PRJNAME}/{PRJNAME}/settings/local.py`
        ```
        
        ```
    - 商用：`{PRJNAME}/{PRJNAME}/settings/prod.py`
        ```
        
        ```



#### フロントエンド(Vue)
- 下記のやり方でbackendと紐付けかな
    1. VueのAtomicDesignを下記のように，DjangoのAPPNAMEに合わせて配置
        ```
        ├ components/
            ├ atoms/
                ├ buttons/ [btn_NAME.vueでも良い]
                ├ labels/ [lbl_NAME.vueでも良い]
                ├ forms/ [form_NAME.vueでも良い]
            ├ molecules/
            ├ organisms/
            ├ templates/
            ├ pages/
                ├ ({APPNAME}/){APPNAME}.vue
        ├ router/
        ├ stores/
        ```
        - 個人的にAtomicDesignは下記解釈
            - atoms: 最小単位パーツ．ボタン・ラベル・ロゴ・フォーム・表・リンクなど．
            - molecles: atomsの組み合わせ．1つの機能の見た目を構築する．
            - organisms: atomsとmoleclesの組み合わせ．複数の機能を備えた枠組み．ヘッダー・サイドバー・フッター・記事一覧・記事カードなど．
            - templates: organismsの組み合わせ．1ページ分構成する．
            - pages: URL(Router)に紐付けられる．templatesを持ってきて，JS部分にAPI取得や状態管理を流し込んだもの．
        - また，最初からatomsを作るのでは難しいはずなので，一度organismあたり作って，分解して共通するものが無いか探すスタイルの開発が良さげ．  
        ちょっとの違いがあるならそれで独立させて新規作成する？
    2. backendの`{PRJNAME}/templates/{APPNAME}/xxx.html`はfrontendの`components/pages/({APPNAME}/){APPNAME}.vue`を読み込んでレンダリングするようにする
    - Djangoとの組み合わせ参考
        - [DjangoとVue.jsで作るWEBアプリ（その2: 認証機能編）](https://nmomos.com/tips/2019/07/18/django-vuejs-2/)
1. 
    - メモ
        - サンプルではmain.jsとApp.vueがあるけど，これをpagesごとに用意することで，djangoの各アプリのjsの指定がしやすくなるのでは？