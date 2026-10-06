import styled from 'styled-components'

export const Bar = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

export const Summary = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.inkMuted};
`

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const PageNumber = styled.span`
  min-width: 96px;
  font-size: 0.9rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.ink};
`
