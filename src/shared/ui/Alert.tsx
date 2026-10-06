import type { ReactNode } from 'react'
import {
  AlertActions,
  AlertBox,
  AlertContent,
  AlertTitle,
  type AlertTone,
} from './Alert.styles'

interface AlertProps {
  tone?: AlertTone
  title?: string
  children?: ReactNode
  actions?: ReactNode
}

/** Inline message banner. Errors are announced immediately, success messages politely. */
export function Alert({ tone = 'info', title, children, actions }: AlertProps) {
  const role = tone === 'error' ? 'alert' : tone === 'success' ? 'status' : undefined

  return (
    <AlertBox $tone={tone} role={role}>
      <AlertContent>
        {title ? <AlertTitle>{title}</AlertTitle> : null}
        {children ? <div>{children}</div> : null}
      </AlertContent>
      {actions ? <AlertActions>{actions}</AlertActions> : null}
    </AlertBox>
  )
}
