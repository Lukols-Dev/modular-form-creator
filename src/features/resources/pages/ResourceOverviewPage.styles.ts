import styled from 'styled-components'

export const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`
