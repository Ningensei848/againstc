import { useCallback, useRef } from 'react'

// 【小ネタ】ReactのカスタムフックでuseDebounceを実装する
// @see cf. https://zenn.dev/bom_shibuya/articles/bd9c84bfe59f4f

type Debounce = (fn: () => void) => void

export const useDebounce = (timeout: number): Debounce => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const debounce: Debounce = useCallback(
    (fn) => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
      timer.current = setTimeout(() => {
        fn()
      }, timeout)
    },
    [timeout]
  )
  return debounce
}
