import { Outlet, useParams } from 'react-router-dom'
import { PageHeading, Stack } from '../../../shared/ui/layout'

export function ResourceLayout() {
  const { resourceId } = useParams()

  return (
    <Stack>
      <PageHeading>Resource {resourceId}</PageHeading>
      <Outlet />
    </Stack>
  )
}
