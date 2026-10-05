import { use } from 'react'
import { PendingChangesContext } from './PendingChangesContext'

export function usePendingChanges() {
  const context = use(PendingChangesContext)
  if (!context) {
    throw new Error('usePendingChanges must be used inside PendingChangesProvider')
  }
  return context
}
