import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import {
  PendingChangesContext,
  type PendingChangesContextValue,
} from './PendingChangesContext'
import { pendingChangesReducer } from './pendingChangesReducer'

/**
 * Holds edits of completed resources in memory only. It sits above the router, so edits survive
 * moving between pages, and they are gone after a refresh, as the task requires. Nothing is
 * written to localStorage, sessionStorage or the URL.
 */
export function PendingChangesProvider({ children }: { children: ReactNode }) {
  const [pendingByResource, dispatch] = useReducer(pendingChangesReducer, {})
  const hasPendingChanges = Object.keys(pendingByResource).length > 0

  // Losing the edits on refresh is intended, but the user gets the browser's warning first.
  useEffect(() => {
    if (!hasPendingChanges) {
      return
    }
    const warnBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warnBeforeUnload)
    return () => window.removeEventListener('beforeunload', warnBeforeUnload)
  }, [hasPendingChanges])

  const value = useMemo<PendingChangesContextValue>(
    () => ({
      pendingByResource,
      stage: (resourceKey, changes) => dispatch({ type: 'stage', resourceKey, changes }),
      unstage: (resourceKey, module) =>
        dispatch({ type: 'unstage', resourceKey, module }),
      discard: (resourceKey) => dispatch({ type: 'discard', resourceKey }),
    }),
    [pendingByResource],
  )

  return <PendingChangesContext value={value}>{children}</PendingChangesContext>
}
