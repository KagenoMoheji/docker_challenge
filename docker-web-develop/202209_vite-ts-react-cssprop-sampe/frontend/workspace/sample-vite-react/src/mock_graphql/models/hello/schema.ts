// WARNING: apollo-serverとmswのそれぞれのgraphqlへの変換があるので，ここでgqlとして宣言せず単なる文字列として宣言する．
export const helloSchema = `
# SELECTの関数の定義はtype Query
## extend忘れないこと
extend type Query {
  hello(name: String!): String
}
`;
