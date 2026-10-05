import type { ReactNode } from 'react'
import { Card } from '../../design-system'
import {
  PanelActions,
  PanelBody,
  PanelText,
  PanelTitle,
  Spinner,
} from './StatePanel.styles'

interface StatePanelProps {
  title: string
  description?: ReactNode
  action?: ReactNode
  tone?: 'neutral' | 'error'
  /** Shows a spinner and announces the panel as a loading status. */
  busy?: boolean
}

/** Full-width placeholder for loading, empty, error and not-found states. */
export function StatePanel({
  title,
  description,
  action,
  tone = 'neutral',
  busy = false,
}: StatePanelProps) {
  return (
    <Card variant="elevated">
      <PanelBody role={tone === 'error' ? 'alert' : busy ? 'status' : undefined}>
        {busy ? <Spinner aria-hidden="true" /> : null}
        <PanelTitle $tone={tone}>{title}</PanelTitle>
        {description ? <PanelText>{description}</PanelText> : null}
        {action ? <PanelActions>{action}</PanelActions> : null}
      </PanelBody>
    </Card>
  )
}
