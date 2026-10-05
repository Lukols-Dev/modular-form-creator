import { createBrowserRouter, Navigate } from 'react-router-dom'
import { BasicInfoPage } from '../features/resources/pages/BasicInfoPage'
import { ProjectDetailsPage } from '../features/resources/pages/ProjectDetailsPage'
import { ResourceDetailsPage } from '../features/resources/pages/ResourceDetailsPage'
import { ResourceLayout } from '../features/resources/pages/ResourceLayout'
import { ResourceOverviewPage } from '../features/resources/pages/ResourceOverviewPage'
import { ResourcesListPage } from '../features/resources/pages/ResourcesListPage'
import { RESOURCES_PATH } from '../features/resources/routes'
import { AppLayout } from './AppLayout'
import { NotFoundPage } from './NotFoundPage'
import { RouteErrorPage } from './RouteErrorPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        // Pathless boundary, so an unexpected error keeps the app header visible.
        errorElement: <RouteErrorPage />,
        children: [
          { index: true, element: <Navigate to={RESOURCES_PATH} replace /> },
          { path: 'resources', element: <ResourcesListPage /> },
          {
            path: 'resources/:resourceId',
            element: <ResourceLayout />,
            children: [
              { index: true, element: <ResourceOverviewPage /> },
              { path: 'details', element: <ResourceDetailsPage /> },
              { path: 'basic-info', element: <BasicInfoPage /> },
              { path: 'project-details', element: <ProjectDetailsPage /> },
            ],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
