import type { ReactNode } from 'react'
import { Card } from '../../../design-system'
import { BackLink, MutedText, SectionHeading, Stack } from '../../../shared/ui/layout'

interface ModuleFormCardProps {
  title: string
  description: ReactNode
  backTo: string
  /** Optional message shown above the form, e.g. how completed resources are saved. */
  notice?: ReactNode
  children: ReactNode
}

export function ModuleFormCard({
  title,
  description,
  backTo,
  notice,
  children,
}: ModuleFormCardProps) {
  return (
    <Stack>
      <BackLink to={backTo}>← Back to overview</BackLink>
      <Card variant="elevated">
        <Stack $gap="xs">
          <SectionHeading>{title}</SectionHeading>
          <MutedText>{description}</MutedText>
        </Stack>
        {notice}
        {children}
      </Card>
    </Stack>
  )
}
