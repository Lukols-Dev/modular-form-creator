import styled from 'styled-components'

/**
 * The design-system Checkbox paints its square over the invisible native input, so clicking the
 * square did nothing; only the text worked. The input is laid exactly over the square, above it,
 * which keeps the look and makes the square clickable.
 */
export const TeamMembersField = styled.div`
  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    margin: 0;
    z-index: 1;
    cursor: pointer;
  }
`
