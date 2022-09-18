# TypeScript
npm install --no-optional --save-dev typescript
# TypeScriptコンパイル関連
npm install --no-optional --save-dev \
    eslint \
    @typescript-eslint/eslint-plugin \
    @typescript-eslint/parser \
    prettier \
    eslint-config-prettier \
    eslint-plugin-prettier
# TypeScript型関連
npm install --no-optional --save-dev \
    @types/node
# TypeScript x Webpack関連
npm install --no-optional --save-dev \
    webpack \
    webpack-cli \
    webpack-merge \
    ts-loader \
    eslint-loader \
    webpack-bundle-analyzer
# テスト関連
npm install --no-optional --save-dev \
    mocha \
    chai \
    ts-node \
    tsconfig-paths \
    @types/mocha \
    @types/chai


# React
npm install --no-optional \
    react \
    react-dom
npm install --no-optional --save-dev \
    @types/react \
    @types/react-dom \
    html-webpack-plugin \ # index.htmlもコンパイルに含めるため
    eslint-plugin-react # コンパイル時になんかエラー出たため
# Redux
npm install --no-optional \
    react-redux \
    redux
npm install --no-optional --save-dev \
    @types/react-redux

# CSS/SCSS
npm install --no-optional --save-dev \
    style-loader \
    css-loader \
    sass-loader \
    node-sass \
    stylelint \
    stylelint-scss \
    stylelint-config-recommended \
    stylelint-config-recommended-scss \
    stylelint-webpack-plugin