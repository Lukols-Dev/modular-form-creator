import styled, { css } from 'styled-components'

export type AlertTone = 'info' | 'success' | 'warning' | 'error'

const toneStyles: Record<AlertTone, ReturnType<typeof css>> = {
  info: css`
    --alert-color: ${({ theme }) => theme.colors.info};
    background: rgba(60, 90, 137, 0.08);
  `,
  success: css`
    --alert-color: ${({ theme }) => theme.colors.success};
    background: rgba(46, 139, 87, 0.09);
  `,
  warning: css`
    --alert-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentSoft};
  `,
  error: css`
    --alert-color: ${({ theme }) => theme.colors.warning};
    background: rgba(180, 71, 27, 0.08);
  `,
}

export const AlertBox = styled.div<{ $tone: AlertTone }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 14px ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 4px solid var(--alert-color);
  color: ${({ theme }) => theme.colors.ink};

  ${({ $tone }) => toneStyles[$tone]}
`

export const AlertContent = styled.div`
  display: grid;
  gap: 2px;
  flex: 1 1 280px;
  line-height: 1.45;
`

export const AlertTitle = styled.strong`
  color: ${({ theme }) => theme.colors.inkStrong};
`

export const AlertActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`
