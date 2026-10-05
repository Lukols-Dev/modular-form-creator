import { useEffect, useState } from 'react'
import { Button, Card } from '../../../design-system'
import { getErrorMessage } from '../../../shared/api/client'
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue'
import { useReturnFocus } from '../../../shared/hooks/useReturnFocus'
import { Alert } from '../../../shared/ui/Alert'
import { Cluster, MutedText, PageHeading, Stack } from '../../../shared/ui/layout'
import { StatePanel } from '../../../shared/ui/StatePanel'
import { CreateResourceDrawer } from '../components/CreateResourceDrawer'
import { DeleteResourceDrawer } from '../components/DeleteResourceDrawer'
import { PaginationBar } from '../components/PaginationBar'
import { ResourceListToolbar } from '../components/ResourceListToolbar'
import { ResourceTable } from '../components/ResourceTable'
import { PAGE_SIZE } from '../domain/constants'
import { isSearchableName } from '../domain/rules'
import type { Resource } from '../domain/types'
import { useResourcesQuery } from '../queries/useResourcesQuery'
import { useResourceListFilters } from './useResourceListFilters'

const SEARCH_DEBOUNCE_MS = 300

export function ResourcesListPage() {
  const { filters, setPage, setStatus, setSortOrder, setSearch, clearFilters } =
    useResourceListFilters()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null)
  const rememberCreateOpener = useReturnFocus(isCreateOpen)
  const rememberDeleteOpener = useReturnFocus(resourceToDelete !== null)

  const search = filters.search.trim()
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)
  const { data, error, isError, isFetching, isPlaceholderData, refetch } =
    useResourcesQuery(
      {
        page: filters.page,
        pageSize: PAGE_SIZE,
        sortOrder: filters.sortOrder,
        status: filters.status,
        name: debouncedSearch || undefined,
      },
      // Wait while the user is typing; the current rows stay on screen, dimmed.
      { enabled: search === debouncedSearch },
    )

  // The backend clamps a page past the end (for example after deleting the only item on the
  // last page) and reports the page it returned. Follow it, so the URL and controls agree.
  const servedPage = data?.pagination.page
  useEffect(() => {
    if (servedPage !== undefined && !isPlaceholderData && servedPage !== filters.page) {
      setPage(servedPage, { replace: true })
    }
  }, [servedPage, isPlaceholderData, filters.page, setPage])

  const openCreateDrawer = () => {
    rememberCreateOpener()
    setIsCreateOpen(true)
  }
  const openDeleteDrawer = (resource: Resource) => {
    rememberDeleteOpener()
    setResourceToDelete(resource)
  }
  const retryButton = (
    <Button
      type="button"
      variant="secondary"
      disabled={isFetching}
      onClick={() => refetch()}
    >
      {isFetching ? 'Retrying…' : 'Retry'}
    </Button>
  )

  let content
  if (!data) {
    content = isError ? (
      <StatePanel
        tone="error"
        title="Could not load resources"
        description={getErrorMessage(error)}
        action={retryButton}
      />
    ) : (
      <StatePanel busy title="Loading resources…" />
    )
  } else if (data.items.length === 0) {
    content =
      data.params.status || data.params.name ? (
        <StatePanel
          title="No resources match your filters"
          description="Try a different name or status."
          action={
            <Button type="button" variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <StatePanel
          title="No resources yet"
          description="Create your first resource to get started."
          action={
            <Button type="button" onClick={openCreateDrawer}>
              New resource
            </Button>
          }
        />
      )
  } else {
    content = (
      <Card variant="elevated">
        {isError ? (
          <Alert
            tone="warning"
            title="The list could not be refreshed"
            actions={retryButton}
          >
            {getErrorMessage(error)}
          </Alert>
        ) : null}
        <ResourceTable
          resources={data.items}
          isStale={isPlaceholderData}
          onDelete={openDeleteDrawer}
        />
        <PaginationBar pagination={data.pagination} onPageChange={setPage} />
      </Card>
    )
  }

  return (
    <>
      {/* The design-system Drawer has no focus trap, so the page behind an open drawer is made
          inert: Tab stays in the drawer and screen readers skip the covered content. */}
      <Stack $gap="lg" inert={isCreateOpen || resourceToDelete !== null}>
        <title>Resources · Modular Form Creator</title>
        <Cluster $justify="space-between" $gap="md">
          <Stack $gap="xs">
            <PageHeading>Resources</PageHeading>
            <MutedText>
              Create a resource, fill in Basic Info and Project Details, then complete it.
            </MutedText>
          </Stack>
          <Button type="button" onClick={openCreateDrawer}>
            New resource
          </Button>
        </Cluster>

        <ResourceListToolbar
          search={filters.search}
          searchError={
            search && !isSearchableName(search)
              ? 'Resource names contain only letters, numbers, spaces and hyphens.'
              : undefined
          }
          status={filters.status}
          sortOrder={filters.sortOrder}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onSortOrderChange={setSortOrder}
        />

        {content}
      </Stack>

      <CreateResourceDrawer
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <DeleteResourceDrawer
        resource={resourceToDelete}
        onClose={() => setResourceToDelete(null)}
      />
    </>
  )
}
