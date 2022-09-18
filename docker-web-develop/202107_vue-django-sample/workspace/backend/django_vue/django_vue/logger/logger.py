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

