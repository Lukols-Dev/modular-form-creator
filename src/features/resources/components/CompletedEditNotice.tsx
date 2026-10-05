import { Alert } from '../../../shared/ui/Alert'

/** Explains on module forms why applying changes to a completed resource sends nothing yet. */
export function CompletedEditNotice() {
  return (
    <Alert tone="info" title="This resource is completed">
      Applied changes stay in this browser tab. Nothing is sent to the server until you
      choose “Save changes” on the overview.
    </Alert>
  )
}
