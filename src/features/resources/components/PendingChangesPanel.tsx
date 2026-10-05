import { Button, Card } from '../../../design-system'
import { formatList } from '../../../shared/format'
import { Alert } from '../../../shared/ui/Alert'
import { MutedText, SectionHeading } from '../../../shared/ui/layout'
import { MODULE_LABELS, type ModuleKey } from '../domain/constants'

interface PendingChangesPanelProps {
  changedModules: ModuleKey[]
  isSaving: boolean
  onSave: () => void
  onDiscard: () => void
}

/** Status of a completed resource: either all saved, or a banner with unsaved module edits. */
export function PendingChangesPanel({
  changedModules,
  isSaving,
  onSave,
  onDiscard,
}: PendingChangesPanelProps) {
  if (changedModules.length === 0) {
    return (
      <Card variant="elevated">
        <SectionHeading>Completed</SectionHeading>
        <MutedText>
          Both modules are complete. You can still edit them: changes stay in this browser
          tab until you save them here with a single update.
        </MutedText>
      </Card>
    )
  }

  const changedLabels = formatList(changedModules.map((module) => MODULE_LABELS[module]))

  return (
    <Alert
      tone="warning"
      title="Unsaved changes"
      actions={
        <>
          <Button
            type="button"
            variant="secondary"
            disabled={isSaving}
            onClick={onDiscard}
          >
            Discard
          </Button>
          <Button type="button" disabled={isSaving} onClick={onSave}>
            {isSaving ? 'Saving…' : 'Save changes'}
          </Button>
        </>
      }
    >
      {changedLabels} {changedModules.length > 1 ? 'have' : 'has'} unsaved changes. They
      are kept only in this tab and will be lost if you refresh or close it.
    </Alert>
  )
}
