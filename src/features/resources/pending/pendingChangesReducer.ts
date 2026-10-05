import type { ModuleKey } from '../domain/constants'
import { getUnsavedChanges } from '../domain/rules'
import type { PendingChanges, Resource } from '../domain/types'

/**
 * Pending module edits of completed resources, keyed by the resource's Mongo `_id`.
 * Not by `resourceId`: the backend assigns max + 1, so deleting the newest resource frees its
 * number for the next one, and a stale entry could otherwise leak into a different resource.
 */
export type PendingChangesState = Record<string, PendingChanges>

export type PendingChangesAction =
  | { type: 'apply'; mongoId: string; changes: PendingChanges }
  | { type: 'revert'; mongoId: string; module: ModuleKey }
  | { type: 'prune'; saved: Resource }
  | { type: 'discard'; mongoId: string }

function withEntry(
  state: PendingChangesState,
  mongoId: string,
  entry: PendingChanges,
): PendingChangesState {
  if (Object.keys(entry).length > 0) {
    return { ...state, [mongoId]: entry }
  }
  const next = { ...state }
  delete next[mongoId]
  return next
}

export function pendingChangesReducer(
  state: PendingChangesState,
  action: PendingChangesAction,
): PendingChangesState {
  switch (action.type) {
    case 'apply':
      return withEntry(state, action.mongoId, {
        ...state[action.mongoId],
        ...action.changes,
      })
    case 'revert': {
      const current = state[action.mongoId]
      if (!current?.[action.module]) {
        return state
      }
      const remaining = { ...current }
      delete remaining[action.module]
      return withEntry(state, action.mongoId, remaining)
    }
    case 'prune': {
      // After a save, keep only the modules that still differ from the server, so edits
      // applied while the request was running are not lost.
      const current = state[action.saved._id]
      return current
        ? withEntry(state, action.saved._id, getUnsavedChanges(action.saved, current))
        : state
    }
    case 'discard':
      return action.mongoId in state ? withEntry(state, action.mongoId, {}) : state
  }
}
