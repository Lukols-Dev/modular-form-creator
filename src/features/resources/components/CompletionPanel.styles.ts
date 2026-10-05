import styled from 'styled-components'

export const PanelRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

export const ProgressTrack = styled.div`
  height: 8px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

export const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease;
`
