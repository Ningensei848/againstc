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
const delay = 500

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
