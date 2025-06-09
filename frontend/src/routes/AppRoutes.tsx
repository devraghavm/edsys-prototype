import React from 'react';
import { Route, Routes, useNavigate } from 'react-router';
import Home from '@/features/home/home';
import ManageUsers from '@/features/users/components/ManageUsers';
import AddUser from '@/features/users/components/AddUser';
import EditUser from '@/features/users/components/EditUser';
import CreateWorkgroup from '@/features/workgroup/create-workgroup/components/CreateWorkgroup';

// Dummy sign-in page for local dev bypass
const DummySignIn: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <div className="text-2xl font-bold">
        Redirecting to Home (local dummy sign-in)...
      </div>
      <div className="text-gray-500">
        This simulates an identity provider redirect in local development.
      </div>
    </div>
  );
};

const routeConfigs = [
  { path: '/', element: <Home />, index: true },
  { path: '/users', element: <ManageUsers /> },
  { path: '/users/add', element: <AddUser /> },
  { path: '/users/edit/:id', element: <EditUser /> },
  { path: '/workgroup/create', element: <CreateWorkgroup /> },
  { path: '/dummy-signin', element: <DummySignIn /> },
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
