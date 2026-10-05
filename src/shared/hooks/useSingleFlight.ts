import { useRef } from 'react'

/**
 * Returns a runner that starts `action` only when no earlier run is still in progress.
 *
 * TanStack Query hands `isPending` to React on the next tick, so a disabled button alone does
 * not stop a fast double click from sending the same request twice.
 */
export function useSingleFlight() {
  const isRunning = useRef(false)

  return (action: () => Promise<unknown>) => {
    if (isRunning.current) {
      return
    }
    isRunning.current = true
    const release = () => {
      isRunning.current = false
    }
    // Failures are shown from the mutation state, so the rejection is only used to release.
    action().then(release, release)
  }
}
