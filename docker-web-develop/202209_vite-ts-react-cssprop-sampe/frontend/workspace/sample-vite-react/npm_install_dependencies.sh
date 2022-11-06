# Viteアプリディレクトリの初期作成時にインストールされなかった追加の依存ライブラリのインストールを記載していく


# TypeScript関連
npm install --save-dev \
    # typescript \ # Viteアプリ立ち上げ時にデフォで入れられてたはず
    # https://minerva.mamansoft.net/Notes/%F0%9F%93%9DVite%E3%81%A7tsconfig.paths%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%81%8C%E6%9C%89%E5%8A%B9%E3%81%AB%E3%81%AA%E3%82%89%E3%81%AA%E3%81%84
    @types/node \
    ts-node \
    # @types/react \ # Viteアプリ立ち上げ時にデフォで入れられてたはず
    # @types/react-dom \ # Viteアプリ立ち上げ時にデフォで入れられてたはず
    @types/jest \
    # `@types/react-router-dom`入れるとtscコマンドでバグるらしい．react-router-domに付随してるので不要になってる．
    # https://zenn.dev/warugaki/scraps/ef03b3cc5a9f81
    # @types/react-router-dom \
    # @types/react-redux \
    @types/styled-components \
    @types/lodash \
    @types/uuid

# 静的解析関連
npm install --save-dev \
    eslint \
    eslint-plugin-react-hooks \
    prettier \
    eslint-config-prettier
    # @typescript-eslint/eslint-plugin \ # eslintの初期設定作成時に入れられるはず
    # eslint-config-standard-with-typescript \ # eslintの初期設定作成時に入れられるはず
    # eslint-plugin-import \ # eslintの初期設定作成時に入れられるはず
    # eslint-plugin-n \ # eslintの初期設定作成時に入れられるはず
    # eslint-plugin-promise \ # eslintの初期設定作成時に入れられるはず
    # eslint-plugin-react \ # eslintの初期設定作成時に入れられるはず

# Vite関連
npm install --save-dev \
    # vite \ # Viteアプリ立ち上げ時にデフォで入れられてたはず
    # @vitejs/plugin-react \ # Viteアプリ立ち上げ時にデフォで入れられてたはず
    rollup-plugin-visualizer \
    terser \
    vite-plugin-checker \
    vite-plugin-babel-macros \
    babel-plugin-styled-components

# テスト関連
npm install --save-dev \
    jest \
    ts-jest \
    jest-environment-jsdom \
    @testing-library/react \
    @testing-library/jest-dom \
    @testing-library/user-event
    # @testing-library/react-hooks

# React関連
npm install \
    # react \ # Viteアプリ立ち上げ時にデフォで入れられてたはず
    # react-dom \ # Viteアプリ立ち上げ時にデフォで入れられてたはず
    react-router-dom \
    react-markdown \
    # react-redux \
    react-icons
    # @babel/core \ # Storybookが自動で入れる
    # @storybook/addon-actions \ # Storybookが自動で入れる
    # @storybook/addon-essentials \ # Storybookが自動で入れる
    # @storybook/addon-interactions \ # Storybookが自動で入れる
    # @storybook/addon-links \ # Storybookが自動で入れる
    # @storybook/builder-vite \ # Storybookが自動で入れる
    # @storybook/react \ # Storybookが自動で入れる
    # @storybook/testing-library \ # Storybookが自動で入れる
    # babel-loader \ # Storybookが自動で入れる
    # storybook-dark-mode \ # Storybook入れないならいらない
    # @storybook/addon-postcss \ # Storybook入れないならいらない

# 装飾関連
npm install \
    styled-components
npm install --save-dev \
    sass \
    stylelint \
    @stylelint/postcss-css-in-js \
    stylelint-config-prettier \
    stylelint-config-standard \
    stylelint-config-standard-scss \
    tailwindcss \
    postcss \
    autoprefixer

# その他
npm install \
    axios \
    lodash \
    uuid
npm install --save-dev \
    npm-check-updates
## Apollo
npm install \
    @apollo/client
npm install --save-dev \
    apollo-server \
    graphql \
    msw

