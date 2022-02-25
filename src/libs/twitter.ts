import { useEffect } from 'react'
import { useLocation } from '@docusaurus/router'
import { default as useIsBrowser } from '@docusaurus/useIsBrowser'

declare global {
  interface Window {
    twttr: any
  }
}

const isFulfilled = <T,>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> =>
  input.status === 'fulfilled'

// 非同期関数を定義
const processTweetsAsync = async (blockquotes: HTMLCollectionOf<Element>) => {

  const loadEmbedTweet = window.twttr.widgets.load

  // Promise<void> を要素とする配列を並列して解決させる
  const data = await Promise.allSettled(
    // Promise<void> を要素とする配列を作る
    Array.from(blockquotes).map(
      (quote) =>
        new Promise<void>((resolve, reject) => {
          // console.log(quote)  // dom が帰る
          try {
            if (!quote.hasAttribute('class')) reject("quote doesn\'t have class")

            const className = quote.getAttribute('class').split(/\s/)

            if (!(className.includes('twitter-tweet'))) {
              reject()
            } else {
              // <blockquote> かつ少なくとも 'class' 属性は持っており，
              // そこに 'twitter-tweet' という値が含まれる Element に対して，
              // <script> タグ内で定義した window.twttr.widgets をロードする
              loadEmbedTweet(quote)
              resolve()
            }
          } catch (e) {
            reject(e)
          }
        })
    )
  )

  return data.filter(isFulfilled).map((r) => r.value)
}

// ページ遷移してから少しの間ディレイを入れる
// ページ内の他のコンテンツの読み込みを優先させるため
const delay = 100

export const useTweetEmbed = () => {
  const isBrowser = useIsBrowser()
  const { pathname } = useLocation()

  // Debounced function
  useEffect(() => {
    const blockquote = document.getElementsByTagName('blockquote');
    const fn = async () => await processTweetsAsync(blockquote)
    const timer = setTimeout(() => {
      if (!isBrowser) return
      void fn() // ここまで到達して初めて非同期関数を実行
    }, delay)

    return () => clearTimeout(timer)
  }, [pathname])
}
