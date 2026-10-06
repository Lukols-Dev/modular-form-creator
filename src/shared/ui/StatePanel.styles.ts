import styled, { keyframes } from 'styled-components'

export const PanelBody = styled.div`
  display: grid;
  justify-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  text-align: center;
`

export const PanelTitle = styled.h2<{ $tone: 'neutral' | 'error' }>`
  font-size: 1.2rem;
  color: ${({ theme, $tone }) =>
    $tone === 'error' ? theme.colors.warning : theme.colors.inkStrong};
`

export const PanelText = styled.div`
  max-width: 52ch;
  color: ${({ theme }) => theme.colors.inkMuted};
  line-height: 1.5;
`

export const PanelActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const Spinner = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: ${spin} 0.8s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 2.4s;
  }
`
