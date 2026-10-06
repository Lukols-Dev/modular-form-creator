import styled from 'styled-components'

export const List = styled.dl`
  display: grid;
  margin: 0;
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(140px, 220px) minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  padding: 12px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  &:first-child {
    border-top: none;
    padding-top: 0;
  }

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
    gap: ${({ theme }) => theme.spacing.xs};
  }
`

export const Term = styled.dt`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.inkMuted};
`

export const Value = styled.dd`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkStrong};
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`

export const Missing = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
  font-style: italic;
`
