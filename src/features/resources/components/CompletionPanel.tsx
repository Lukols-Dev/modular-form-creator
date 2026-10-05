import { useId } from 'react'
import { Button, Card } from '../../../design-system'
import { formatList } from '../../../shared/format'
import { MutedText, SectionHeading, SmallText, Stack } from '../../../shared/ui/layout'
import { MODULE_LABELS, MODULES } from '../domain/constants'
import { canProvision, getIncompleteModules } from '../domain/rules'
import type { Resource } from '../domain/types'
import { PanelRow, ProgressFill, ProgressTrack } from './CompletionPanel.styles'

interface CompletionPanelProps {
  resource: Resource
  isCompleting: boolean
  onComplete: () => void
}

/** Progress of a draft and the "Complete resource" action, locked until both modules are done. */
export function CompletionPanel({
  resource,
  isCompleting,
  onComplete,
}: CompletionPanelProps) {
  const hintId = useId()
  const incompleteModules = getIncompleteModules(resource)
  const completedCount = MODULES.length - incompleteModules.length
  const isReady = canProvision(resource)

  return (
    <Card variant="elevated">
      <PanelRow>
        <Stack $gap="xs">
          <SectionHeading>Progress</SectionHeading>
          <MutedText>
            {completedCount} of {MODULES.length} modules complete
          </MutedText>
        </Stack>
        {isReady ? (
          <Button
            type="button"
            disabled={isCompleting}
            aria-describedby={hintId}
            onClick={onComplete}
          >
            {isCompleting ? 'Completing…' : 'Complete resource'}
          </Button>
        ) : (
          <Button type="button" state="locked" aria-describedby={hintId}>
            Complete resource
          </Button>
        )}
      </PanelRow>
      <ProgressTrack
        role="progressbar"
        aria-label="Modules complete"
        aria-valuemin={0}
        aria-valuemax={MODULES.length}
        aria-valuenow={completedCount}
      >
        <ProgressFill $percent={(completedCount / MODULES.length) * 100} />
      </ProgressTrack>
      <SmallText id={hintId}>
        {isReady
          ? 'Both modules are complete. After completing, the resource can still be edited, but changes are saved together with “Save changes”.'
          : `Complete ${formatList(incompleteModules.map((module) => MODULE_LABELS[module]))} to finish this resource.`}
      </SmallText>
    </Card>
  )
}
