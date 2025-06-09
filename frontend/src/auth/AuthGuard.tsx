import React from 'react';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === 'true';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading, signIn } = useAuth();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <div className="text-2xl font-bold">Sign in to continue</div>
        <Button
          onClick={() => {
            if (BYPASS_AUTH) {
              // Store dummy user in localStorage
              localStorage.setItem(
                'dummy_user',
                JSON.stringify({
                  name: 'Local Dev User',
                  email: 'dev@example.com',
                })
              );
              // Reload to trigger AuthProvider to pick up the dummy user
              window.location.reload();
            } else {
              signIn();
            }
          }}
          size="lg"
        >
          Sign in with your organization
        </Button>
      </div>
    );

  return <>{children}</>;
};
