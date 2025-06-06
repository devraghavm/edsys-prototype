import React from 'react';
import { Route, Routes } from 'react-router';
import Home from '@/features/home/home';
import ManageUsers from '@/features/users/components/ManageUsers';
import AddUser from '@/features/users/components/AddUser';
import EditUser from '@/features/users/components/EditUser';
import CreateWorkgroup from '@/features/workgroup/create-workgroup/components/CreateWorkgroup';

const routeConfigs = [
  { path: '/', element: <Home />, index: true },
  { path: '/users', element: <ManageUsers /> },
  { path: '/users/add', element: <AddUser /> },
  { path: '/users/edit/:id', element: <EditUser /> },
  { path: '/workgroup/create', element: <CreateWorkgroup /> },
  {
    path: '*',
    element: <div className="text-center text-red-500">Page not found</div>,
  },
];

const AppRoutes: React.FC = () => (
  <Routes>
    {routeConfigs.map(({ path, element, index }) =>
      index ? (
        <Route key={path} index element={element} />
      ) : (
        <Route key={path} path={path} element={element} />
      )
    )}
  </Routes>
);

export default AppRoutes;
