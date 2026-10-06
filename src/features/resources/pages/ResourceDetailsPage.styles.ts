import styled from 'styled-components'

export const SummaryBadges = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  white-space: normal;
`
