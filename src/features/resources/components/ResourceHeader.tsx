import { formatDate, formatDateTime } from '../../../shared/format'
import { BackLink, PageHeading } from '../../../shared/ui/layout'
import type { Resource } from '../domain/types'
import { RESOURCES_PATH, resourceDetailsPath, resourcePath } from '../routes'
import { HeaderBlock, Meta, Tab, Tabs, TitleRow } from './ResourceHeader.styles'
import { StatusBadge } from './StatusBadge'

export function ResourceHeader({ resource }: { resource: Resource }) {
  return (
    <HeaderBlock>
      <BackLink to={RESOURCES_PATH}>← All resources</BackLink>
      <TitleRow>
        <PageHeading>{resource.name}</PageHeading>
        <StatusBadge status={resource.status} />
      </TitleRow>
      <Meta>
        Resource #{resource.resourceId} · Created {formatDate(resource.createdAt)} · Last
        saved {formatDateTime(resource.updatedAt)}
      </Meta>
      <Tabs aria-label="Resource sections">
        <Tab to={resourcePath(resource.resourceId)} end>
          Overview
        </Tab>
        <Tab to={resourceDetailsPath(resource.resourceId)}>Details</Tab>
      </Tabs>
    </HeaderBlock>
  )
}
