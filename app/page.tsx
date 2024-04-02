'use client'
import { GithubIcon, SquareTerminal, Triangle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useEffect, useRef, useState } from 'react'
import Alert from '../components/ui/alert'
import { Input } from '../components/ui/input'
import { useDebounce } from '../hooks/useDebounce'
import { useDebug } from '../hooks/useDebug'
import { useDocumentReadyState } from '../hooks/useDocumentReadyState'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useEffectOnce } from '../hooks/useEffectOnce'
import { useFirstMountState } from '../hooks/useFirstMountState'
import { useHover } from '../hooks/useHover'
import { useIdle } from '../hooks/useIdle'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { useInterval } from '../hooks/useInterval'
import { useIsClient } from '../hooks/useIsClient'
import { useIsTouchDevice } from '../hooks/useIsTouchDevice'
import { useIsVisible } from '../hooks/useIsVisible'
import useKeySequence from '../hooks/useKeySequence'
import { useMediaQuery } from '../hooks/useMediaQuery'
import useMousePosition from '../hooks/useMousePosition'
import { useOrientation } from '../hooks/useOrientation'
import { usePageLeave } from '../hooks/usePageLeave'
import { useRect } from '../hooks/useRect'
import useThrottle from '../hooks/useThrottle'
import useWindowLoad from '../hooks/useWindowLoad'
import useWindowResize from '../hooks/useWindowResize'

export default function Dashboard() {
  const [inputValue, setInputValue] = useState<string>('')
  const debouncedValue = useDebounce(inputValue, 500)
  const isDebugMode = useDebug()
  const readyState = useDocumentReadyState()
  const isFirstMount = useFirstMountState()
  const position = useMousePosition()
  const [title, setTitle] = useState<string>('')
  const [queryString, setQueryString] = useState<string>('')
  const isMatch = useMediaQuery(queryString)
  const isTouchDevice = useIsTouchDevice()
  const orientation = useOrientation()
  const isClient = useIsClient()
  const throttledValue = useThrottle(inputValue, 500)
  const isLoaded = useWindowLoad()
  const windowSize = useWindowResize()
  const [userStatus, setUserStatus] = useState<string>('User is on the page')
  const [value, setValue] = useState<string>('')
  const [hoverRef, isHovered] = useHover<HTMLDivElement>()
  const isIdle = useIdle(60000) // 1 minute
  const divRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<HTMLDivElement>(null)
  const entry = useIntersectionObserver(observerRef, {
    threshold: 0.5,
  })
  const [count, setCount] = useState(0)
  const { setRef, inView } = useIsVisible({ threshold: 1 })
  const targetRef = useRef<HTMLDivElement>(null)
  const rect = useRect(targetRef)
  const [isResizing, setIsResizing] = useState<boolean>(false)

  useDocumentTitle(title)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handlePageLeave = () => {
    setUserStatus('User left the page')
    console.log('User left the page')
  }

  usePageLeave(handlePageLeave)

  useEffect(() => {
    console.log('Throttled value:', throttledValue)
  }, [throttledValue])

  useEffect(() => {
    if (entry) {
      console.log(`Element is ${entry.isIntersecting ? 'visible' : 'hidden'}`)
    }
  }, [entry])

  useInterval(() => {
    setCount((prevCount) => (prevCount + 1) % 25)
  }, 1000)

  useEffectOnce(() => {
    console.log('Effect ran only once')

    return () => {
      console.log('Effect cleaned up')
    }
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && targetRef.current && rect) {
        const newWidth = e.clientX - rect.left
        const newHeight = e.clientY - rect.top

        ;(targetRef.current as HTMLDivElement).style.width = `${newWidth}px`
        ;(targetRef.current as HTMLDivElement).style.height = `${newHeight}px`
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, rect, targetRef])

  const KeySequenceTester = () => {
    useKeySequence({
      sequence: 'xd',
      callback: () => {
        alert('Key sequence detected!')
        console.log('Key sequence detected!')
      },
      eventType: 'keydown',
      keystrokeDelay: 1000,
    })
  }
  return (
    <div className="grid h-screen w-full pl-[53px]">
      <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
        <div className="border-b p-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Home"
          >
            <Triangle className="size-5 fill-foreground" />
          </Button>
        </div>
        <nav className="grid gap-1 p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg bg-muted"
                  aria-label="React Hooks Showcase"
                >
                  <SquareTerminal className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={5}
              >
                React Hooks Showcase
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-auto rounded-lg"
                  aria-label="Github"
                >
                  <GithubIcon className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={5}
              >
                Help
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col">
        {/* Need to implement the drawer component to make this page responsive */}
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative hidden flex-col items-start gap-8 md:flex">
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-base font-medium">
                  Hooks Block 1
                </legend>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useDeboune"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useClipboard
                  </h2>
                  <Alert
                    id="useClipboard"
                    message="This preview is under construction."
                  />
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useDeboune"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useDebounce
                  </h2>
                  <Input
                    className="mt-3"
                    type="text"
                    id="useDebounce"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type something"
                    aria-describedby="debouncedValue"
                  />
                  <p
                    id="debouncedValue"
                    className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Debounced value: {debouncedValue}
                  </p>
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useDebug"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useDebug
                  </h2>
                  {isDebugMode ? (
                    <div>
                      <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        🛠️ The application is running in debug mode.
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      🚀 The application is running in production mode.
                    </p>
                  )}
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useDocumentReadyState"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useDocumentReadyState
                  </h2>
                  <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Current ready state: {readyState}
                  </p>
                  {readyState === 'loading' && (
                    <p>⌛ The document is still loading.</p>
                  )}
                  {readyState === 'interactive' && (
                    <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      🕹️ The document has finished parsing but is still loading
                      sub-resources.
                    </p>
                  )}
                  {readyState === 'complete' && (
                    <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      ✅ The document and all sub-resources have finished
                      loading.
                    </p>
                  )}
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useDocumentTitle"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useDocumentTitle
                  </h2>
                  <Input
                    type="text"
                    className="mt-3"
                    value={title}
                    onChange={handleChange}
                    maxLength={15}
                    id="useDocumentTitle"
                    placeholder="Enter a new document title"
                  />
                  <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Current document title: {title}
                  </p>
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useDrag"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useDrag
                  </h2>
                  <Alert
                    id="useDrag"
                    message="This preview is under construction"
                  />
                </div>
              </fieldset>
            </form>
          </div>
          <div className="relative hidden flex-col items-start gap-8 md:flex">
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-base font-medium">
                  Hooks Block 2
                </legend>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useEffectOnce"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useEffectOnce
                  </h2>
                  <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Check the console for the effect and cleanup messages.
                  </p>
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useFavicon"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useFavicon
                  </h2>
                  <Alert
                    id="useFavicon"
                    message="This preview is under construction."
                  />
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useFetch"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useFetch
                  </h2>
                  <Alert
                    id="useFetch"
                    message="This preview is under construction."
                  />
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useFirstMountState"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useFirstMountState
                  </h2>
                  <div>
                    {isFirstMount ? (
                      <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        🥇 First render
                      </p>
                    ) : (
                      <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        🔜 Subsequent render
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useFoucFix"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useFoucFix
                  </h2>
                  <Alert
                    id="useFoucFix"
                    message="This preview is under construction."
                  />
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useGeolocation"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useGeolocation
                  </h2>
                  <Alert
                    id="useGeolocation"
                    message="This preview is under construction."
                  />
                </div>
              </fieldset>
            </form>
          </div>
          <div className="relative hidden flex-col items-start gap-8 md:flex">
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-base font-medium">
                  Hooks Block 3
                </legend>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useHover"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useHover
                  </h2>
                  <div
                    ref={hoverRef}
                    className="py-6 text-center border-2 border-dashed rounded-lg"
                  >
                    {isHovered ? (
                      <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        ✅ Hovered
                      </p>
                    ) : (
                      <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        ❌ Not Hovered
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useIdle"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useIdle
                  </h2>
                  <div>
                    {isIdle ? (
                      <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        🦥 User is idle
                      </p>
                    ) : (
                      <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        🙋🏻‍♂️ User is active
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useIntersectionObserver"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useIntersectionObserver
                  </h2>
                  <div
                    ref={observerRef}
                    className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <p>
                      ⬇️ Scroll this element into view to see it logged to the
                      console. l this element into view to see it logged to the
                      console.
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useInterval"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useInterval
                  </h2>
                  <div>
                    <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      ⏱ Count {count}
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useIOSToolbarState"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useIOSToolbarState
                  </h2>
                  <Alert
                    id="useIOSToolbarState"
                    message="This preview is under construction."
                  />
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useIsClient"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useIsClient
                  </h2>
                  <div>
                    {isClient ? (
                      <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        💻 Running on the client-side
                      </p>
                    ) : (
                      <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        🗄️ Running on the server-side
                      </p>
                    )}
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
          <div className="relative hidden flex-col items-start gap-8 md:flex">
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-base font-medium">
                  Hooks Block 4
                </legend>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useIsomorphicLayoutEffect"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useIsomorphicLayoutEffect
                  </h2>
                  <Alert
                    id="useIsomorphicLayoutEffect"
                    message="This preview is under construction."
                  />
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useIsTouchDevice"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useIsTouchDevice
                  </h2>
                  <div>
                    {isTouchDevice ? (
                      <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        👆🏻 Touch Device
                      </p>
                    ) : (
                      <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        ❌ Not a Touch Device
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useIsVisible"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useIsVisible
                  </h2>
                  <div
                    ref={setRef}
                    className="py-6 text-center border-2 border-dashed rounded-lg"
                  >
                    {inView ? (
                      <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        ✅ The heading is current in view!
                      </p>
                    ) : (
                      <p className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        ❌ The heading is not in view
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useKeySequence"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useKeySequence
                  </h2>
                  <div>
                    Press <kbd>h</kbd> then <kbd>e</kbd> then <kbd>l</kbd> then{' '}
                    <kbd>l</kbd> then <kbd>o</kbd> to trigger the alert.
                  </div>
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useList"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useList
                  </h2>
                  <Alert
                    id="useList"
                    message="This preview is under construction."
                  />
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useMediaQuery"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useMediaQuery
                  </h2>
                  <Alert
                    id="useMediaQuery"
                    message="This preview is under construction."
                  />
                </div>
              </fieldset>
            </form>
          </div>
          <div className="relative hidden flex-col items-start gap-8 md:flex">
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-base font-medium">
                  Hooks Block 5
                </legend>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useMousePosition"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useMousePosition
                  </h2>
                  <div
                    id="useMousePosition"
                    className="mt-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <p>
                      X: {position.x}, Y: {position.y}
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useNetworkState"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useNetworkState
                  </h2>
                  <Alert
                    id="useNetworkState"
                    message="This preview is under construction."
                  />
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useOnClickOutside"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useOnCLickOutside
                  </h2>
                  <Alert
                    id="useOnCLickOutside"
                    message="This preview is under construction."
                  />
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useOrientation"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useOrientation
                  </h2>
                  <div id="useOrientation">
                    <p>Current angle: {orientation.angle}</p>
                    <p>Current type: {orientation.type}</p>
                  </div>
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="usePageLeave"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    usePageLeave
                  </h2>
                  <div>
                    <p>{userStatus}</p>
                    <p>
                      Click outside of this page to trigger the `usePageLeave`
                      hook.
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useRect"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useRect
                  </h2>
                  <div
                    ref={targetRef}
                    style={{
                      width: '100px',
                      height: '100px',
                      backgroundColor: 'lightgray',
                      cursor: 'nwse-resize',
                      minHeight: '100px',
                      minWidth: '100px',
                      maxWidth: '350px',
                      maxHeight: '350px',
                    }}
                    onMouseDown={() => setIsResizing(true)}
                  ></div>
                  <pre className="select-none">
                    {JSON.stringify(rect, null, 2)}
                  </pre>
                </div>
              </fieldset>
            </form>
          </div>
          <div className="relative hidden flex-col items-start gap-8 md:flex">
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-base font-medium">
                  Hooks Block 6
                </legend>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useScript"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useScript
                  </h2>
                  <Alert
                    id="useScript"
                    message="This preview is under construction."
                  />
                </div>

                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useSessionStorage"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useSessionStorage
                  </h2>
                  <Alert
                    id="useSessionStorage"
                    message="This preview is under construction."
                  />
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useThrottle"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useThrottle
                  </h2>
                  <div>
                    <Input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your value"
                    />
                  </div>
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useUnmount"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useUnmount
                  </h2>
                  <Alert
                    id="useUnmount"
                    message="This preview is under construction."
                  />
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useUpdateEffect"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useUpdateEffect
                  </h2>
                  <Alert
                    id="useUpdateEffect"
                    message="This preview is under construction."
                  />
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useWindowLoad"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useWindowLoad
                  </h2>
                  <div className="py-6 text-center border-2 border-dashed rounded-lg">
                    {isLoaded ? (
                      <h1>Window has finished loading!</h1>
                    ) : (
                      <h1>Loading...</h1>
                    )}
                  </div>
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useWindowResize"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useWindowResize
                  </h2>
                  <div>
                    <p>Inner Width: {windowSize.innerWidth}</p>
                    <p>Inner Height: {windowSize.innerHeight}</p>
                    <p>Outer Width: {windowSize.outerWidth}</p>
                    <p>Outer Height: {windowSize.outerHeight}</p>
                  </div>
                </div>
                <div className="grid gap-3 p-4 border rounded-lg">
                  <h2
                    id="useWindowSize"
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    useWindowSize
                  </h2>
                  <div>
                    <p>Window Size {JSON.stringify(windowSize)}</p>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
