import { useRef, useCallback } from 'react'

type FunctionArgs = any[]

type PromiseType<T extends FunctionArgs> = (...args: T) => Promise<void>

type CallbackType<T extends FunctionArgs> = (...args: T) => void

interface DebounceFilterOptions {
  maxWait?: number
  rejectOnCancel?: boolean
}

/**
 * Debounce execution of a function.
 *
 * @param fn - A function to be executed after delay milliseconds debounced.
 * @param ms - A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param options - Options
 * @returns A new, debounced, function.
 */
function useDebounceFn<T extends FunctionArgs>(
  fn: CallbackType<T>,
  ms = 200,
  options: DebounceFilterOptions = {}
): PromiseType<T> {
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const maxWaitRef = useRef<ReturnType<typeof setTimeout>>()
  const lastCallTimeRef = useRef<number>(0)
  const lastCallArgsRef = useRef<T>()
  const lastInvokeRef = useRef<number>(0)
  const pendingRef = useRef(false)

  const { maxWait = 0, rejectOnCancel = false } = options

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = undefined
    }
    if (maxWaitRef.current) {
      clearTimeout(maxWaitRef.current)
      maxWaitRef.current = undefined
    }
    pendingRef.current = false
  }, [])

  const flush = useCallback(() => {
    if (pendingRef.current) {
      const args = lastCallArgsRef.current
      clear()
      fn(...args!)
    }
  }, [clear, fn])

  const debouncedFn = useCallback(
    (...args: T) => {
      return new Promise<void>((resolve, reject) => {
        const currentTime = Date.now()
        const elapsed = currentTime - lastCallTimeRef.current
        const delay = Math.max(0, ms - elapsed)

        clear()
        lastCallArgsRef.current = args
        lastCallTimeRef.current = currentTime

        if (pendingRef.current && delay > 0) {
          timerRef.current = setTimeout(() => {
            flush()
            resolve()
          }, delay)
        } else {
          pendingRef.current = true
          timerRef.current = setTimeout(() => {
            lastInvokeRef.current = Date.now()
            flush()
            resolve()
          }, delay)
        }

        if (maxWait > 0) {
          maxWaitRef.current = setTimeout(() => {
            if (pendingRef.current) {
              if (rejectOnCancel) {
                reject()
              } else {
                resolve()
              }
              clear()
            }
          }, maxWait)
        }
      })
    },
    [clear, flush, maxWait, ms, rejectOnCancel]
  )

  return debouncedFn
}

export default useDebounceFn
