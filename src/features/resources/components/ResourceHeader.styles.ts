import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

export const HeaderBlock = styled.header`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
`

export const Meta = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.inkMuted};
`

export const Tabs = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const Tab = styled(NavLink)`
  margin-bottom: -1px;
  padding: 10px 14px;
  border-bottom: 2px solid transparent;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.inkMuted};

  &:hover {
    color: ${({ theme }) => theme.colors.inkStrong};
  }

  &.active {
    border-bottom-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryStrong};
  }
`
