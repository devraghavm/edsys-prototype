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
import { AuthProvider } from '@/auth/AuthProvider';
import { AuthGuard } from '@/auth/AuthGuard';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AuthGuard>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="/users" element={<ManageUsers />} />
                  <Route path="/users/add" element={<AddUser />} />
                  <Route path="/users/edit/:id" element={<EditUser />} />
                  <Route
                    path="*"
                    element={
                      <div className="text-center text-red-500">
                        Page not found
                      </div>
                    }
                  />
                </Routes>
              </Layout>
            </BrowserRouter>
          </QueryClientProvider>
        </Provider>
      </AuthGuard>
    </AuthProvider>
  );
};

export default App;
