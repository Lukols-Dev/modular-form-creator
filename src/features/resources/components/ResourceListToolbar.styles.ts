import styled from 'styled-components'

export const Toolbar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
  }
`
