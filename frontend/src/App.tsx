import React from 'react';
import store from '@/store';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from '@/features/landing/layout';
import Home from '@/features/home/home';
import ManageUsers from '@/features/users/components/ManageUsers';
import AddUser from '@/features/users/components/AddUser';
import EditUser from '@/features/users/components/EditUser';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route
              index
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/users"
              element={
                <Layout>
                  <ManageUsers />
                </Layout>
              }
            />
            <Route
              path="/users/add"
              element={
                <Layout>
                  <AddUser />
                </Layout>
              }
            />
            <Route
              path="/users/edit/:id"
              element={
                <Layout>
                  <EditUser />
                </Layout>
              }
            />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
