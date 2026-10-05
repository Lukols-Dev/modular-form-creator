import type { ModuleKey } from '../domain/constants'
import type { PendingModules } from '../domain/types'

/**
 * Unsaved module edits of completed resources, keyed by the resource's Mongo `_id`.
 * Not by `resourceId`: the backend assigns max + 1, so deleting the newest resource frees its
 * number for the next one, and a stale entry could otherwise leak into a different resource.
 */
export type PendingChangesState = Record<string, PendingModules>

export type PendingChangesAction =
  | { type: 'stage'; resourceKey: string; changes: PendingModules }
  | { type: 'unstage'; resourceKey: string; module: ModuleKey }
  | { type: 'discard'; resourceKey: string }

function withoutResource(state: PendingChangesState, resourceKey: string) {
  const next = { ...state }
  delete next[resourceKey]
  return next
}

export function pendingChangesReducer(
  state: PendingChangesState,
  action: PendingChangesAction,
): PendingChangesState {
  switch (action.type) {
    case 'stage':
      return {
        ...state,
        [action.resourceKey]: { ...state[action.resourceKey], ...action.changes },
      }
    case 'unstage': {
      const current = state[action.resourceKey]
      if (!current?.[action.module]) {
        return state
      }
      const remaining = { ...current }
      delete remaining[action.module]
      return Object.keys(remaining).length > 0
        ? { ...state, [action.resourceKey]: remaining }
        : withoutResource(state, action.resourceKey)
    }
    case 'discard':
      return action.resourceKey in state
        ? withoutResource(state, action.resourceKey)
        : state
  }
}
