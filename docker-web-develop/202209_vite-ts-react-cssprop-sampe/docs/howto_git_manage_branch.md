# Gitによるブランチ管理術
### 開発ディレクトリの初期構築
1. `main`ブランチから`develop`ブランチを切る
1. `develop`ブランチから`all/feature_init_repo`ブランチを切ってレポジトリの初期状態を構築する
    - フロントエンド・バックエンドのディレクトリをどうするか，とか
1. `all/feature_init_repo`ブランチが問題ない場合，`develop`ブランチにマージ


### 個人作業等のブランチの作成～プルリク
1. 新規ブランチを切る前に，現在のブランチの変更のcommit・push漏れがないか確認
    ```
    # 現在のブランチの確認
    git branch
    # 現在のブランチのcommit・push漏れを確認
    git status
    ```
1. 下記コマンドで最新の`develop`ブランチから`feature_{作業概要}`ブランチを切る
    ```
    git checkout develop
    git fetch
    git merge origin/develop
    git checkout -b feature_{作業概要}
    ```
    - pullを使うなら下記になる
        ```
        git checkout develop
        git pull origin develop
        git checkout -b feature_{作業概要}
        ```
        - ただ`git fetch`を単独で使ったほうが，ブランチ情報を全体的に更新できるんでは？という先入観がある．
    - 場合によっては`frontend/feature_{作業概要}`・`backend/feature_{作業概要}`の命名規則があるかも
1. `feature_{作業概要}`ブランチで作業する
1. 作業が終わったら，マージ先へのプルリクを下記手順で進める
    1. `feature_{作業概要}`ブランチの全コミットをpushしておく
    1. 下記コマンドを実行してマージ先のブランチからマージ検証用の`merge2{マージ先のブランチ名}/{マージ元のブランチ名}`ブランチを切る
        ```
        git checkout {マージ先のブランチ名}
        git checkout -b merge2{マージ先のブランチ名}/{マージ元のブランチ名}
        ```
    1. 下記コマンドを実行して最新のマージ先のブランチを`merge2{マージ先のブランチ名}/{マージ元のブランチ名}`ブランチにマージ
        ```
        git fetch
        git merge origin/{マージ先のブランチ名}
        ```
        - pullを使うなら下記になる
            ```
            git pull origin {マージ先のブランチ名}
            ```
    1. 下記コマンドを実行して作業した`feature_{作業概要}`ブランチ(`origin/feature_{作業概要}`でも良い)を`merge2{マージ先のブランチ名}/{マージ元のブランチ名}`ブランチにマージ
        ```
        git fetch
        git merge feature_{作業概要}
        ```
        - pullを使うなら下記になる
            ```
            git pull origin feature_{作業概要}
            ```
        - コンフリクトがあれば解消する
    1. コンフリクトを解消した`merge2{マージ先のブランチ名}/{マージ元のブランチ名}`ブランチをpushし，マージ先のブランチへのプルリクを作成する


# 本レポジトリでのブランチ命名規則
- `main`
    - 本番(環境へ)のリリースを済ませたコードを配置するブランチ
    - 設定値もできるだけ本番のものにする
    - 基本的に`develop`ブランチからのマージしか受け付けない
- `develop`
    - 開発の中心ブランチ
    - 常に最新化する
- `frontend/feature_{作業概要}`
    - フロントエンド開発に関する作業ブランチ
    - `develop`ブランチから切り，`develop`ブランチにマージする
- `backend/feature_{作業概要}`
    - バックエンド開発に関する作業ブランチ
    - `develop`ブランチから切り，`develop`ブランチにマージする
- `merge2{マージ先ブランチ名}/{マージ元ブランチ名}`
    - マージされるブランチ
    - プルリクで使う
- `merge2main/{バージョン}`
    - `develop`ブランチを`main`ブランチにマージする時に使う
    - バージョンの付け方
        - `1.0.0`からスタート
        - 大きい変更をした場合は`+1.0.0`
        - 小さい変更をした場合は`+0.1.0`
        - 緊急修正(hotfix)した場合は`+0.0.1`
        - Refs
            - https://web-dev.hatenablog.com/entry/etc/semantic-versioning
            - https://future-architect.github.io/articles/20220426a/
- `note{記録日: yyyyMMdd}_{記録名}`
    - 記録用ブランチ
    - バックアップ的な
- `{frontend|backend}/hotfix_{修正概要}`
    - あまり使いたくない
    - `main`ブランチの中で緊急度の高い修正があった場合に`main`ブランチから切って修正対応
    - 修正対応が終わった後に`main`ブランチと`develop`ブランチにマージする

