import { lazy } from 'react';

// project imports
import AuthLayout from 'layout/Auth';
import Loadable from 'components/Loadable';

// jwt auth
const UsersPage = Loadable(lazy(() => import('pages/management/users/users')));
const RequestsPage = Loadable(lazy(() => import('pages/management/requests')));
const InspectionsPage = Loadable(lazy(() => import('pages/management/inspections')));
const FormsPage = Loadable(lazy(() => import('pages/management/forms')));
const RolesPage = Loadable(lazy(() => import('pages/management/users/roles')));
const AuditsPage = Loadable(lazy(() => import('pages/management/users/audits')));

// ==============================|| AUTH ROUTING ||============================== //

const ManagementRoutes = {
  path: '/',
  children: [
    {
      path: 'management',
      element: <AuthLayout />,
      children: [
        { path: 'users/users', element: <UsersPage /> },
        { path: 'requests', element: <RequestsPage /> },
        { path: 'inspections', element: <InspectionsPage /> },
        { path: 'forms', element: <FormsPage /> },
        { path: 'users/roles', element: <RolesPage /> },
        { path: 'users/audits', element: <AuditsPage /> },
      ]
    }
  ]
};

export default ManagementRoutes;
