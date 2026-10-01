# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

## KdB データの更新

[kdb-crawler の `dist/kdb.min.json`](https://github.com/s7tya/kdb-crawler/blob/master/dist/kdb.min.json) を取得し、`src/resources/kdb2026.json` に保存します。

ローカルでは次のコマンドで更新できます。インポート処理自体には追加の依存パッケージは不要です。

```sh
npm run import:kdb
```

GitHub Actions の `Import KdB` が毎日日本時間 1:30 に実行され、差分がある場合だけビルドを確認してコミット・push します。
Actions タブの `Run workflow` から手動実行することもできます。
定期実行を有効にするには、このワークフローをデフォルトブランチに反映してください。ブランチ保護を設定している場合は、Actions による push を許可する必要があります。

取得に失敗した場合、JSON が空の場合、またはアプリが使う項目の形式が不正な場合は更新を中止し、既存のデータを保持します。
取得元は最新データを配信するため、年度が変わる際は保存先と `src/models/course.ts` のインポート先を合わせて見直してください。

インポート処理のテストは `npm run test:import-kdb` で実行できます。

## License

This project includes source files from the [kdb-crawler](https://github.com/s7tya/kdb-crawler).

The following files are included:

- `src/resources/kdb2026.json`
