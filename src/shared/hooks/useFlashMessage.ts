import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface FlashState {
  flash?: string
}

function readFlash(state: unknown): string | undefined {
  return (state as FlashState | null)?.flash
}

/** Navigation options that show `message` once on the next page. */
export function withFlash(message: string): { state: FlashState } {
  return { state: { flash: message } }
}

/**
 * Returns the message passed with `withFlash` and removes it from the history entry, so it does
 * not show up again after a refresh.
 */
export function useFlashMessage(): string | undefined {
  const location = useLocation()
  const navigate = useNavigate()
  const [message] = useState(() => readFlash(location.state))

  useEffect(() => {
    if (readFlash(location.state)) {
      navigate(location.pathname + location.search, {
        replace: true,
        state: null,
        preventScrollReset: true,
      })
    }
  }, [location, navigate])

  return message
}
