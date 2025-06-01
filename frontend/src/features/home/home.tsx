import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Dummy authentication hook (replace with your actual auth logic)
const useAuth = () => {
  // Example: Replace with real authentication state
  const [user, setUser] = React.useState<{ name: string } | null>({
    name: 'Raghav Medapati',
  });
  // To simulate logged out, set user to null above

  return { user };
};

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-w-screen min-h-screen bg-gray-100 flex">
      <Card className="w-full max-w-screen shadow-lg">
        <CardHeader>
          <CardTitle>
            {user ? `Welcome, ${user.name}!` : 'Welcome to EdSys'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <p className="text-gray-700">
              We're glad to see you back. Explore your dashboard and resources.
            </p>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-700">
                Please log in to access your dashboard and resources.
              </p>
              <Button variant="default">Login</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
