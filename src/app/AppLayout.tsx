import { Outlet, ScrollRestoration } from 'react-router-dom'
import { RESOURCES_PATH } from '../features/resources/routes'
import { Brand, BrandMark, Header, HeaderInner, Main } from './AppLayout.styles'

export function AppLayout() {
  return (
    <>
      <Header>
        <HeaderInner>
          <Brand to={RESOURCES_PATH}>
            <BrandMark aria-hidden="true" />
            Modular Form Creator
          </Brand>
        </HeaderInner>
      </Header>
      <Main>
        <Outlet />
      </Main>
      <ScrollRestoration />
    </>
  )
}
