import { useOutletContext } from 'react-router-dom'
import type { Resource } from '../domain/types'

export interface ResourceOutletContext {
  resource: Resource
}

/** The resource loaded by ResourceLayout. Child routes render only once it is available. */
export function useResourceContext() {
  return useOutletContext<ResourceOutletContext>()
}
