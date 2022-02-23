---
# @see https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-blog#markdown-front-matter
# Metadata (Recommended) ------------------------------------
title: "ツイートの埋め込みに対応した"
date: "2022-02-23"
tags:
  - "Twitter"
  - "widget"
  - "Docusaurus"
  - "remark"
# draft: true  # if true, the article is `WIP` and therefore should not be published yet
# Allows to customize the blog post url (/<routeBasePath>/<slug>)
# slug: ''   # default is current file path
authors: Kiai  # @see authors.yml
# -----------------------------------------------------------
# Additional ------------------------------------------------
# hide_table_of_contents:   # if true, rightside ToC will be invisible
# toc_min_heading_level: 2  # The minimum heading level shown in the ToC
# toc_max_heading_level: 3  # The max heading level shown in the ToC
# for SEO
keywords:
  - "Twitter"
  - "widget"
  - "Docusaurus"
  - "remark"
# description: '<Desc>'
# for `og:image` and `twitter:image` (.png or .jpg, NOT .svg)
image: https://custom-og-image-generator.vercel.app/api/%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%81%AE%E5%9F%8B%E3%82%81%E8%BE%BC%E3%81%BF%E3%81%AB%E5%AF%BE%E5%BF%9C%E3%81%97%E3%81%9F%F0%9F%92%AA%F0%9F%98%A4%F0%9F%A4%B3.png?theme=light&timestamp=2022%2F02%2F23&copyright=%23againstc+%2F+Kubokawa+Takara&logo=https%3A%2F%2Fimg.icons8.com%2Fcolor%2F480%2F000000%2Ftwitter-circled--v1.png&avater=https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F763543133724352513%2Fr6RlBYDo_400x400.jpg&author=Kiai&aka=%40Ningensei848&site=%23againstc&tags=Twitter&tags=widget&tags=Docusaurus&tags=remark
---

# ツイートの埋め込みに対応した

![幸せを運ぶといわれる、青い鳥．Twitter（ツイッター）のアイコンにも使われている](https://1.bp.blogspot.com/-nMTqgygyczs/VqtZItHn2_I/AAAAAAAA3ZY/5ZfrZPuZzbY/s450/bird_aoitori_bluebird.png)

<!--truncate-->

Docusaurus v2 では，Twitter card のための `twitter:image` タグサポートこそあるものの，ソーシャルメディアとの連携はほとんど実装されていない．

まぁ，これを作っているチームが Facebook もとい Meta 社の人々なので，競合他社を積極的に利するだけの行為はあまり積極的ではないのかもしれない．が，どうにか Docusaurus の組み込み API をフル活用して，ツイートの埋め込みに成功したのでここに記録を残す．

https://twitter.com/hashimoto_lo/status/340640143058825216

https://twitter.com/JoeBiden/status/1351897267666608129

## 仕組み（三行まとめ）

- remark plugin で **URL のみが含まれる一行**を `blockquote` に変換
- [秘伝のタレ](https://platform.twitter.com/widgets.js)を読み込む処理[^1]を `<head>` に挿入しておく
- [`src/theme/Root.tsx` を準備](https://docusaurus.io/docs/advanced/swizzling#wrapper-your-site-with-root)して，ページが変わるたびフックとして Widget 関数実行

[^1]: こちらに詳細が書いてある　 → 　[Set up Twitter for Websites | Docs | Twitter Developer Platform](https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites)

## 詳細

### `remark-embedder` プラグインで URL を blockquote へ変換

[`@remark-embedder/core`](https://github.com/remark-embedder/core) と [`@remark-embedder/transformer-oembed`](https://github.com/remark-embedder/transformer-oembed) を活用して，Markdown 内部の行内に「URL が一つだけ」「前後に空白やマークアップなく」存在しているとき，それを埋め込みに対応した要素に変換している．これはサーバサイドで処理されるので，SSG として表示されるときには単なる `blockquote` のタグが表示されるだけとなる（クライアント側の負担にはならない）．

具体的には，`docusaurus.config.js` の [`beforeDefaultRemarkPlugins`](https://docusaurus.io/docs/markdown-features/plugins#creating-new-rehyperemark-plugins) に必要な情報を入れてやれば良い．

<details>

<summary>beforeDefaultRemarkPlugins</summary>

```js title="docusaurus.config.js"
beforeDefaultRemarkPlugins: [
  [
    require('@remark-embedder/core'),
    {
      transformers: [
        [
          require('@remark-embedder/transformer-oembed'),
          // cf. https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/get-statuses-oembed
          { params: { maxwidth: 550, omit_script: true, align: 'center', lang: 'ja', dnt: true } }
        ]
      ],
      // cf. https://github.com/remark-embedder/core#handleerror-errorinfo-errorinfo--gottenhtml--promisegottenhtml
      // handleError: handleEmbedError
    }
  ]
]
```

</details>

### `injectHtmlTags()` で `<script>` を仕込む

次に，[`injectHtmlTags`](https://docusaurus.io/docs/api/plugin-methods/lifecycle-apis#injectHtmlTags) を実行する．これは `<head>` や `<body>` の前の方 / 後ろの方にタグを挿入するためのプラグイン実装だ．`<Head>` という組み込みコンポネントも一応存在しているが，そちらは毎回クライアント側で DOM を置き換える処理が発生しているし，ここに適用する必要があり（いちいち Swizzle してカスタマイズせねばならない），手間の割にリターンが僅少なので採用しなかった．

<details>
<summary>injectHtmlTags.ts</summary>

```ts title="src/components/Root.tsx"
import type { LoadContext } from '@docusaurus/types'
import type { PluginOptions } from '@docusaurus/plugin-content-pages'

// Set up Twitter for Websites | Docs | Twitter Developer Platform
// cf. https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites
const twttr = `
<script>
window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));
</script>
`
  .split('\n')
  .map((line) => line.trim())
  .join('')

// options は `docusaurus.config.js` にてオプション引数として指定する
const plugin = async (context: LoadContext, options: PluginOptions) => {
  return {
    name: 'docusaurus-plugin-inject-html-tags',
    injectHtmlTags() {
      return {
        headTags: [ twttr ]
      }
    }
  }
}

export default plugin
```

</details>

（※ `docusaurus.config.js` 内に `injectHtmlTags()` を定義することも可能だが，汚くなるし量が膨大になったり型によるサポートが受けられなかったりするため，別途 `.ts` ファイルとして作り，ビルドのたびに `swc` でトランスパイルさせることとした）

_inject_ という字面から分かる通り，`dangerouslySetInnerHTML` 経由で生文字列のスクリプトを注入していることにだけ気をつけたい．

これでサーバサイド，もとい SSG までの準備は整ったが，このままでは単に `<blockquote>` タグ（＋とツイート内容）が表示されるだけである．
これをよりリッチに表示してくれるのが `widget.js` だ．上述した `<script>` において `window` に紐付いた `twttr` オブジェクトがグローバルに存在しているため，各ページに遷移するごとに `widget.load()` してやれば，あとはスクリプトが `<blockquote>` を探して書き直してくれる．

### `<Root />` コンポネントの作成

<details>
<summary>Root.tsx</summary>

```ts title="src/components/Root.tsx"
import React from 'react'
import { useTweetEmbed } from '@site/src/libs'

// Default implementation, that you can customize
// @see cf. https://docusaurus.io/docs/advanced/swizzling#wrapper-your-site-with-root
const Root = ({ children }: { children: React.ChildNode }): JSX.Element => {
  // 埋め込みツイートをアクティベートする（単なる blockquote が tweet widget になる）
  useTweetEmbed()
  return <>{children}</>
}

export default Root
```

</details>

本来であれば，**/docs**, **/blogs** 両方の基幹ページコンポネントを Swizzle してきてゴニョゴニョするしかなかったところ，よく調べると `<Root />` というコンポネントを自分で作成して使うことができるらしい（CLI で `docusaurus swizzle` するのではなく，単にファイルを作成して設置するだけ）．

それさえわかれば後はかんたんで，ページ遷移するたびに `widget.load()` し直すだけですべてのページで埋め込み変換をやってくれるようになった．ページ遷移状態は [`useLocation()`](https://docusaurus.io/docs/advanced/routing#generating-and-accessing-routes) フックで取得し，`useEffect()` フックの第二引数に `pathname` を仕込むことで実現している．

<details>
<summary>useTweetEmbed()</summary>

```ts title="src/libs/twitter.ts"
import { useEffect } from 'react'
import { useLocation } from '@docusaurus/router'
import { default as useIsBrowser } from '@docusaurus/useIsBrowser'


declare global {
  interface Window {
    twttr: any
  }
}

// 非同期関数を定義
const loadWidgetAsync = () =>
  new Promise<void>((resolve, reject) => {
    if (!window.twttr) {
      const msg = 'Failure to load window.twttr, aborting load'
      console.error(msg)
      reject(msg)
    } else {
      try {
        // <script> タグ内で定義した window.twttr.widgets をロードする
        window.twttr.widgets.load(document.getElementsByTagName('article'))
        resolve()
      } catch (e) {
        reject(e)
      }
    }
  })

// ページ遷移してから少しの間ディレイを入れる
// ページ内の他のコンテンツの読み込みを優先させるため
const delay = 2000

export const useTweetEmbed = () => {
  const isBrowser = useIsBrowser()
  const { pathname } = useLocation()

  // Debounced function
  useEffect(() => {
    const fn = async () => await loadWidgetAsync()
    const timer = setTimeout(() => {
      if (!isBrowser) return
      void fn() // ここまで到達して初めて非同期関数を実行
    }, delay)

    return () => clearTimeout(timer)
  }, [pathname])
}
```

</details>

## 終わりに

Markdown を変換してわちゃわちゃするのに remark 以外，もとい [unified](https://unifiedjs.com/) アーキテクチャ以外を採用するのはありえないという結論に至るくらい，remark 周りのあれこれは可能性があると感じている．本アイデアの着想元である [zenn.dev](https://zenn.dev/) でも早く `markdown-it` なんて投げ捨てて[^2] remark / rehype に改宗してほしい……

[^2]: [zenn-ediotr のソース](https://github.com/zenn-dev/zenn-editor/tree/canary)を見るとわかる．ゆくゆくは [zenn-embed-elements](https://github.com/zenn-dev/zenn-editor/tree/canary/packages/zenn-embed-elements) と同様の機能を目指したいものである
