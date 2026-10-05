import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Button } from '../design-system'
import { StatePanel } from '../shared/ui/StatePanel'

/** Last-resort screen for unexpected rendering errors. Request errors are handled by each page. */
export function RouteErrorPage() {
  const error = useRouteError()
  const reason = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : null

  return (
    <StatePanel
      tone="error"
      title="Something went wrong"
      description={
        <>
          The page could not be displayed. Reload it to try again.
          {reason ? <> Details: {reason}</> : null}
        </>
      }
      action={<Button onClick={() => window.location.reload()}>Reload page</Button>}
    />
  )
}
