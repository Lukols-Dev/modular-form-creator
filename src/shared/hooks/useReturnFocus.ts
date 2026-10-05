import { useEffect, useRef } from 'react'

/**
 * Moves focus back to the element that opened a drawer once the drawer closes. Call the returned
 * function right before opening. The design-system Drawer does not restore focus itself, so
 * keyboard users would otherwise land at the top of the page.
 */
export function useReturnFocus(isOpen: boolean) {
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }
    const opener = openerRef.current
    // Runs after the closing render, when the page behind the drawer is no longer inert.
    return () => {
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
