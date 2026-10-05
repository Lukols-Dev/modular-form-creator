import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const TableScroller = styled.div<{ $dimmed: boolean }>`
  /* Positioned, so visually hidden labels stay inside the scroll area on narrow screens. */
  position: relative;
  overflow-x: auto;
  opacity: ${({ $dimmed }) => ($dimmed ? 0.55 : 1)};
  transition: opacity 0.2s ease;
`

export const Table = styled.table`
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
  font-size: 0.95rem;

  th {
    padding: 0 12px 10px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.inkMuted};
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-align: left;
    text-transform: uppercase;
    white-space: nowrap;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    vertical-align: middle;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  th:first-child,
  td:first-child {
    padding-left: 0;
  }

  th:last-child,
  td:last-child {
    padding-right: 0;
    text-align: right;
  }
`

export const NameCell = styled.div`
  display: grid;
  gap: 2px;
  justify-items: start;
`

export const NameLink = styled(Link)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.inkStrong};
  overflow-wrap: anywhere;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryStrong};
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`

export const SecondaryText = styled.span`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.inkMuted};
  white-space: nowrap;
`
