import React from 'react';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading, signIn } = useAuth();

  console.log('AuthGuard user:', user);
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
        <Button onClick={signIn} size="lg">
          Sign in with your organization
        </Button>
      </div>
    );
  return <>{children}</>;
};
