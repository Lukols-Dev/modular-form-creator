import type { ReactNode } from 'react'
import { List, Missing, Row, Term, Value } from './FieldList.styles'

export interface Field {
  label: string
  /** Leave undefined for an empty value; it is shown as "Not provided". */
  value?: ReactNode
}

/** Read-only label and value pairs. */
export function FieldList({ fields }: { fields: Field[] }) {
  return (
    <List>
      {fields.map(({ label, value }) => (
        <Row key={label}>
          <Term>{label}</Term>
          <Value>{value ?? <Missing>Not provided</Missing>}</Value>
        </Row>
      ))}
    </List>
  )
}
