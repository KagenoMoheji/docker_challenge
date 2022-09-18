import os
from .base import *
# secretsファイルからは，一括importはせずに，個別importをするように心がける
from .local_secrets import (
    SECRET_KEY,
    DATABASES
)


# SECURITY WARNING: don't run with debug turned on in production!
## base.pyでTrueにしてあるが，念の為上書きの形で設定．
DEBUG = True


# Path of static files
## base.pyに追加
STATIC_ROOT = BASE_DIR / 'static_root' # os.path.join(BASE_DIR, 'static_root')


# Path of media files
## base.pyに追加
MEDIA_ROOT = BASE_DIR / 'media_root' # os.path.join(BASE_DIR, 'media_root')


#==================================================================
# secretsファイルからimportした変数で，baseファイルの値を上書き・追加
#------------------------------------------------------------------
## base.pyを上書き
SECRET_KEY = SECRET_KEY
## base.pyを上書き
DATABASES = DATABASES

