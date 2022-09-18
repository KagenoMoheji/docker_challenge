import os
from .base import *


# SECURITY WARNING: don't run with debug turned on in production!
## base.pyを上書き
DEBUG = False


# Path of static files
## base.pyに追加
STATIC_ROOT = '/var/www/{prjname}/static'.format(prjname = PRJNAME)


# Path of media files
## base.pyに追加
MEDIA_ROOT = '/var/www/{prjname}/media'.format(prjname = PRJNAME)


# SECURITY WARNING: keep the secret key used in production secret!
## base.pyを上書き
SECRET_KEY = os.environ['{}_DJANGO_SECRET_KEY'.format(PRJNAME.upper())]


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases
## base.pyを上書き
DATABASES = {
    'default': {
        'ENGINE': os.environ['{}_DB_ENGINE'.format(PRJNAME.upper())],
        'NAME': os.environ['{}_DB_NAME'.format(PRJNAME.upper())],
    }
}

