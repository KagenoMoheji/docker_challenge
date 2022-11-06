/*
ある型定義から特定のキーを除外した型を定義する．
- Usage
  - type UserCreate = Without<User, "id">
  - type UserDelete = Without<Without<User, "name">, "email">
  - type UserDelete = Without<User, "name" | "email">
    - 複数消すならこう書く
- Refs
  - https://stackoverflow.com/a/50918777/15842506
  - https://stackoverflow.com/a/48216010/15842506
*/
export type Without<T, K> = Pick<T, Exclude<keyof T, K>>;
