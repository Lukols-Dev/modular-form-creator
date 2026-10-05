import type { ReactNode } from 'react'
import { Card } from '../../../design-system'
import { Alert } from '../../../shared/ui/Alert'
import { BackLink, MutedText, SectionHeading, Stack } from '../../../shared/ui/layout'

interface ModuleFormCardProps {
  title: string
  backTo: string
  /** A completed resource keeps applied changes in memory, so the card explains that. */
  isCompleted: boolean
  children: ReactNode
}

export function ModuleFormCard({
  title,
  backTo,
  isCompleted,
  children,
}: ModuleFormCardProps) {
  return (
    <Stack>
      <BackLink to={backTo}>← Back to overview</BackLink>
      <Card variant="elevated">
        <Stack $gap="xs">
          <SectionHeading>{title}</SectionHeading>
          <MutedText>
            {isCompleted
              ? 'Edit the module and apply the changes.'
              : 'Changes are saved to the server when you submit.'}{' '}
            All fields are required.
          </MutedText>
        </Stack>
        {isCompleted ? (
          <Alert tone="info" title="This resource is completed">
            Applied changes stay in this browser tab. Nothing is sent to the server until
            you choose “Save changes” on the overview.
          </Alert>
        ) : null}
        {children}
      </Card>
    </Stack>
  )
}
