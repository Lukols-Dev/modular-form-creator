import type { ModuleKey } from '../domain/constants'
import { getUnsavedChanges } from '../domain/rules'
import type { PendingChanges, Resource } from '../domain/types'

/** Pending modules of one resource. The resourceId lets a 404 at that address drop them. */
export interface PendingEntry extends PendingChanges {
  resourceId: number
}

/**
 * Pending module edits of completed resources, keyed by the resource's Mongo `_id`.
 * Not by `resourceId`: the backend assigns max + 1, so deleting the newest resource frees its
 * number for the next one, and a stale entry could otherwise leak into a different resource.
 */
export type PendingChangesState = Record<string, PendingEntry>

export type PendingChangesAction =
  | { type: 'apply'; resource: Resource; changes: PendingChanges }
  | { type: 'revert'; resource: Resource; module: ModuleKey }
  | { type: 'prune'; saved: Resource }
  | { type: 'discard'; mongoId: string }
  | { type: 'discardMissing'; resourceId: number }

function without(state: PendingChangesState, mongoIds: string[]): PendingChangesState {
  const next = { ...state }
  for (const mongoId of mongoIds) {
    delete next[mongoId]
  }
  return next
}

function withEntry(
  state: PendingChangesState,
  mongoId: string,
  entry: PendingEntry,
): PendingChangesState {
  return entry.basicInfo || entry.projectDetails
    ? { ...state, [mongoId]: entry }
    : without(state, [mongoId])
}

export function pendingChangesReducer(
  state: PendingChangesState,
  action: PendingChangesAction,
): PendingChangesState {
  switch (action.type) {
    case 'apply': {
      const { _id, resourceId } = action.resource
      return withEntry(state, _id, { ...state[_id], ...action.changes, resourceId })
    }
    case 'revert': {
      const current = state[action.resource._id]
      if (!current?.[action.module]) {
        return state
      }
      const remaining = { ...current }
      delete remaining[action.module]
      return withEntry(state, action.resource._id, remaining)
    }
    case 'prune': {
      // After a save, keep only the modules that still differ from the server, so edits
      // applied while the request was running are not lost.
      const current = state[action.saved._id]
      return current
        ? withEntry(state, action.saved._id, {
            ...getUnsavedChanges(action.saved, current),
            resourceId: current.resourceId,
          })
        : state
    }
    case 'discard':
      return action.mongoId in state ? without(state, [action.mongoId]) : state
    case 'discardMissing': {
      // A 404 at this address means no existing resource has the id, so these edits belong to a
      // deleted resource and can never be saved.
      const stale = Object.keys(state).filter(
        (mongoId) => state[mongoId].resourceId === action.resourceId,
      )
      return stale.length > 0 ? without(state, stale) : state
    }
  }
}
