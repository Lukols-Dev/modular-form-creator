import type { ReactNode } from 'react'
import { Card } from '../../../design-system'
import { SectionHeading } from '../../../shared/ui/layout'
import { Badges, SectionHeader } from './SummarySection.styles'

interface SummarySectionProps {
  title: string
  badges?: ReactNode
  children: ReactNode
}

export function SummarySection({ title, badges, children }: SummarySectionProps) {
  return (
    <Card variant="outline">
      <SectionHeader>
        <SectionHeading>{title}</SectionHeading>
        {badges ? <Badges>{badges}</Badges> : null}
      </SectionHeader>
      {children}
    </Card>
  )
}
