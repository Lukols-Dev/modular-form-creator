import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RESOURCES_PATH } from '../features/resources/routes'
import { StatePanel } from '../shared/ui/StatePanel'
import { AppLayout } from './AppLayout'
import { NotFoundPage } from './NotFoundPage'
import { RouteErrorPage } from './RouteErrorPage'

// Pages load per route, which keeps the main bundle small: zod and React Hook Form load only
// with the pages that use them. The function form of `lazy` is used on purpose: if a page fails
// to download (offline, or a new deployment), the error reaches RouteErrorPage instead of
// leaving the content area blank.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        // Pathless boundary, so an unexpected error keeps the app header visible.
        errorElement: <RouteErrorPage />,
        hydrateFallbackElement: <StatePanel busy title="Loading…" />,
        children: [
          { index: true, element: <Navigate to={RESOURCES_PATH} replace /> },
          {
            path: 'resources',
            lazy: async () => ({
              Component: (await import('../features/resources/pages/ResourcesListPage'))
                .ResourcesListPage,
            }),
          },
          {
            path: 'resources/:resourceId',
            lazy: async () => ({
              Component: (await import('../features/resources/pages/ResourceLayout'))
                .ResourceLayout,
            }),
            children: [
              {
                index: true,
                lazy: async () => ({
                  Component: (
                    await import('../features/resources/pages/ResourceOverviewPage')
                  ).ResourceOverviewPage,
                }),
              },
              {
                path: 'details',
                lazy: async () => ({
                  Component: (
                    await import('../features/resources/pages/ResourceDetailsPage')
                  ).ResourceDetailsPage,
                }),
              },
              {
                path: 'basic-info',
                lazy: async () => ({
                  Component: (await import('../features/resources/pages/BasicInfoPage'))
                    .BasicInfoPage,
                }),
              },
              {
                path: 'project-details',
                lazy: async () => ({
                  Component: (
                    await import('../features/resources/pages/ProjectDetailsPage')
                  ).ProjectDetailsPage,
                }),
              },
            ],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
