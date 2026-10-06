import { useEffect, useRef } from 'react'

/**
 * Focus handling the design-system Drawer lacks. While a drawer is open, the app root is inert,
 * so Tab and screen readers stay inside the drawer, which must therefore be rendered outside the
 * root (with a portal). When it closes, focus returns to the element that opened it.
 * Call the returned function right before opening.
 */
export function useDrawerFocus(isOpen: boolean) {
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const appRoot = document.getElementById('root')
    if (!isOpen || !appRoot) {
      return
    }
    const opener = openerRef.current
    appRoot.inert = true
    // Runs when the drawer closes: the root must stop being inert before focus can return.
    return () => {
      appRoot.inert = false
      if (opener?.isConnected) {
        opener.focus()
      }
    }
  }, [isOpen])

  return () => {
    openerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
  }
}
