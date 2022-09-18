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
                    "logs/{prjname}/django.log".format(prjname = PRJNAME))
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