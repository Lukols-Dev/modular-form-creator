import { Badge } from '../../../design-system'
import { formatDateTime, formatDigits, formatList } from '../../../shared/format'
import { Alert } from '../../../shared/ui/Alert'
import { Stack, TextLink } from '../../../shared/ui/layout'
import { FieldList } from '../components/FieldList'
import { ModuleStateBadge } from '../components/ModuleStateBadge'
import { StatusBadge } from '../components/StatusBadge'
import { SummarySection } from '../components/SummarySection'
import {
  CATEGORY_LABELS,
  MODULE_LABELS,
  PRIORITY_LABELS,
  type ModuleKey,
} from '../domain/constants'
import { getModuleState, sortTeamMembers } from '../domain/rules'
import { useResourceChanges } from '../pending/useResourceChanges'
import { resourcePath } from '../routes'
import { SummaryBadges } from './ResourceDetailsPage.styles'
import { useResourceContext } from './useResourceContext'

/** Empty strings from a draft become undefined, which the field list shows as "Not provided". */
const orEmpty = (value: string) => value || undefined

/** Read-only summary of the saved resource. Unsaved edits are listed, not mixed in. */
export function ResourceDetailsPage() {
  const { resource } = useResourceContext()
  const { changedModules } = useResourceChanges(resource)
  const { basicInfo, projectDetails } = resource
  const teamMembers = sortTeamMembers(projectDetails.options)

  const moduleBadges = (module: ModuleKey) => (
    <>
      <ModuleStateBadge state={getModuleState(resource, module)} />
      {changedModules.includes(module) ? (
        <Badge variant="warning">Unsaved changes</Badge>
      ) : null}
    </>
  )

  return (
    <Stack $gap="lg">
      {changedModules.length > 0 ? (
        <Alert tone="info" title="This page shows the last saved data">
          {formatList(changedModules.map((module) => MODULE_LABELS[module]))}{' '}
          {changedModules.length > 1 ? 'have' : 'has'} unsaved changes.{' '}
          <TextLink to={resourcePath(resource.resourceId)}>
            Review and save them on the overview
          </TextLink>
          .
        </Alert>
      ) : null}

      <SummarySection title="Resource">
        <FieldList
          fields={[
            { label: 'Name', value: resource.name },
            { label: 'Status', value: <StatusBadge status={resource.status} /> },
            { label: 'Resource ID', value: `#${resource.resourceId}` },
            { label: 'Created', value: formatDateTime(resource.createdAt) },
            { label: 'Last saved', value: formatDateTime(resource.updatedAt) },
          ]}
        />
      </SummarySection>

      <SummarySection title="Basic Info" badges={moduleBadges('basicInfo')}>
        <FieldList
          fields={[
            { label: 'Resource name', value: orEmpty(basicInfo.resourceName) },
            { label: 'Owner', value: orEmpty(basicInfo.owner) },
            { label: 'Email', value: orEmpty(basicInfo.email) },
            { label: 'Description', value: orEmpty(basicInfo.description) },
            {
              label: 'Priority',
              value: basicInfo.priority ? PRIORITY_LABELS[basicInfo.priority] : undefined,
            },
          ]}
        />
      </SummarySection>

      <SummarySection title="Project Details" badges={moduleBadges('projectDetails')}>
        <FieldList
          fields={[
            { label: 'Project name', value: orEmpty(projectDetails.projectName) },
            {
              label: 'Budget',
              value: projectDetails.budget
                ? formatDigits(projectDetails.budget)
                : undefined,
            },
            {
              label: 'Category',
              value: projectDetails.category
                ? CATEGORY_LABELS[projectDetails.category]
                : undefined,
            },
            {
              label: 'Team members needed',
              value: teamMembers.length ? (
                <SummaryBadges>
                  {teamMembers.map((member) => (
                    <Badge key={member}>{member}</Badge>
                  ))}
                </SummaryBadges>
              ) : undefined,
            },
          ]}
        />
      </SummarySection>
    </Stack>
  )
}
