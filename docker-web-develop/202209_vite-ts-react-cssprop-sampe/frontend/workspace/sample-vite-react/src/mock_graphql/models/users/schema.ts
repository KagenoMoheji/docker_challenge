// WARNING: apollo-serverとmswのそれぞれのgraphqlへの変換があるので，ここでgqlとして宣言せず単なる文字列として宣言する．
export const usersSchema = `
type User {
  id: ID!
  name: String!
  email: String!
  years: Int!
  isDeleted: Boolean!
}

input UserInput {
  id: ID!
  name: String!
  email: String!
  years: Int!
  isDeleted: Boolean!
}

# 引数に渡すデータ構造はinput
input UserCreateInput {
  # idは関数内で自動発行するので含めない
  name: String!
  email: String!
  years: Int!
  isDeleted: Boolean! = false
}

# SELECTの関数の定義はtype Query
## extend忘れないこと
extend type Query {
  users:[User]
  user(id: ID!): User
}

# INSERT/UPDATE/DELETEの関数の定義はtype Mutation
## extend忘れないこと
extend type Mutation {
  createUser(user: UserCreateInput): User
  updateUser(user: UserInput): User
  deleteUser(id: ID!): User
}
`;
