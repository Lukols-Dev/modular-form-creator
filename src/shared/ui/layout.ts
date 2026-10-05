import { Link } from 'react-router-dom'
import styled, { type DefaultTheme } from 'styled-components'

type Space = keyof DefaultTheme['spacing']

/** Vertical stack with consistent spacing between children. */
export const Stack = styled.div<{ $gap?: Space }>`
  display: grid;
  gap: ${({ theme, $gap = 'md' }) => theme.spacing[$gap]};
  min-width: 0;
`

/** Horizontal group that wraps on narrow screens. */
export const Cluster = styled.div<{
  $gap?: Space
  $justify?: 'flex-start' | 'space-between' | 'flex-end'
}>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme, $gap = 'sm' }) => theme.spacing[$gap]};
  justify-content: ${({ $justify = 'flex-start' }) => $justify};
`

export const PageHeading = styled.h1`
  font-size: clamp(1.6rem, 1.2rem + 1.4vw, 2.1rem);
  line-height: 1.15;
  overflow-wrap: anywhere;
`

export const SectionHeading = styled.h2`
  font-size: 1.15rem;
  line-height: 1.3;
`

export const MutedText = styled.p`
  color: ${({ theme }) => theme.colors.inkMuted};
  line-height: 1.5;
`

export const TextLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryStrong};
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const BackLink = styled(Link)`
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.inkMuted};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryStrong};
  }
`
