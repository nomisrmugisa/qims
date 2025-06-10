import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ManagementLayout from '../layout/Management/ManagementLayout';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - color
// const Color = Loadable(lazy(() => import('pages/component-overview/color')));
// const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
// const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// render - management pages
const UsersPage = Loadable(lazy(() => import('pages/management/users/users')));
const RequestsPage = Loadable(lazy(() => import('pages/management/requests')));
const InspectionsPage = Loadable(lazy(() => import('pages/management/inspections')));
const FormsPage = Loadable(lazy(() => import('pages/management/forms')));
// const RolesPage = Loadable(lazy(() => import('pages/management/users/roles')));
// const AuditsPage = Loadable(lazy(() => import('pages/management/users/audits')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'management',
      element: <ManagementLayout />,
      children: [
        { path: 'users/users', element: <UsersPage /> },
        { path: 'requests', element: <RequestsPage /> },
        { path: 'inspections', element: <InspectionsPage /> },
        { path: 'forms', element: <FormsPage /> },
        // { path: 'users/roles', element: <RolesPage /> },
        // { path: 'users/audits', element: <AuditsPage /> },
      ]
    }
  ]
};

export default MainRoutes;
