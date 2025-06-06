import React from 'react';
import store from '@/store';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';
import Layout from '@/features/landing/layout';
import { AuthProvider } from '@/auth/AuthProvider';
import { AuthGuard } from '@/auth/AuthGuard';
import AppRoutes from './routes/AppRoutes';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AuthGuard>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Layout>
                <AppRoutes />
              </Layout>
            </BrowserRouter>
          </QueryClientProvider>
        </Provider>
      </AuthGuard>
    </AuthProvider>
  );
};

export default App;
