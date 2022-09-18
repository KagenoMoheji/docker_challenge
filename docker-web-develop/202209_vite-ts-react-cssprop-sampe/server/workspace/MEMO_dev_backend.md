```
├ server/workspace/
    ├ (/)home/ [ここから下をサーバと一緒の構造にしたい]
        ├ www/
            ├ app/
                ├ sample-app/
                    ├ Pipfile
                    ├ .venv/ [サーバのユーザ変数に`PIPENV_VENV_IN_PROJECT=1`の登録必要]
                    ├ main/
                        ├ [この中にDjangoやFlaskといったバックエンドコードを書き，リリース資材とする]
                    ├ test/
                ├ [Webアプリ追加したらここでアプリ名追加していけばOK]
```