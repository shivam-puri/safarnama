import { useEffect, useRef, useState } from 'react'
import type { createBrowserRouter } from 'react-router-dom'

type DataRouter = ReturnType<typeof createBrowserRouter>

export function useRouteTransition(router: DataRouter, minVisibleMs = 2000) {
  const [visible, setVisible] = useState(false)
  const shownAtRef = useRef(0)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const unsubscribe = router.subscribe((state) => {
      if (state.navigation.state !== 'idle') {
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current)
          hideTimerRef.current = null
        }
        setVisible((wasVisible) => {
          if (!wasVisible) shownAtRef.current = Date.now()
          return true
        })
      } else {
        const elapsed = Date.now() - shownAtRef.current
        const remaining = Math.max(0, minVisibleMs - elapsed)
        hideTimerRef.current = setTimeout(() => setVisible(false), remaining)
      }
    })

    return () => {
      unsubscribe()
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [router, minVisibleMs])

  return visible
}
