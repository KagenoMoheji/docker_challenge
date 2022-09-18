// 「Type '{ children: Element[]; className: string; css: FlattenSimpleInterpolation; }' is not assignable to type 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.Property 'css' does not exist on type 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.」という，Reactコンポーネントのタグにおいて属性「css」がstyled-componentの型ではないエラーを解消するため．
// https://qiita.com/jonakp/items/cab93fbe28aeb922597d
// 上記リンクを参考にしたが，`tsconfig.json["compilerOptions.typesRoot"]`を設定せずとも機能した．
// Viteを使っている場合，下記のプラグイン追加の対応も必要
// https://github.com/styled-components/babel-plugin-styled-components/issues/350
import {} from "styled-components/cssprop";
