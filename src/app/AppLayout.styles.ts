import { Link } from 'react-router-dom'
import styled from 'styled-components'

const CONTENT_WIDTH = '1040px'

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(8px);
`

export const HeaderInner = styled.div`
  max-width: ${CONTENT_WIDTH};
  margin: 0 auto;
  padding: 14px ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;

  @media (max-width: 600px) {
    padding: 12px ${({ theme }) => theme.spacing.md};
  }
`

export const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.05rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.inkStrong};
`

export const BrandMark = styled.span`
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.accent}
  );
`

export const Main = styled.main`
  max-width: ${CONTENT_WIDTH};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg}
    ${({ theme }) => theme.spacing.xxl};
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 600px) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md}
      ${({ theme }) => theme.spacing.xxl};
  }
`
