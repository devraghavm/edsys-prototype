import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  fetchAuthSession,
  signInWithRedirect,
  signOut as signOutFromProvider,
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

type AuthContextType = {
  user: any;
  loading: boolean;
  signIn: () => void;
  signOut: () => void;
  userPrincipalName?: string;
};

const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === 'true';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [userPrincipalName, setUserPrincipalName] = useState<
    string | undefined
  >();
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const authSession = await fetchAuthSession();
      console.log('Auth session:', authSession);
      setUser(authSession.userSub);
      const idToken = authSession.tokens?.idToken?.payload;
      const upn = idToken?.['custom:upn'];
      setUserPrincipalName(typeof upn === 'string' ? upn : undefined);
    } catch {
      setUser(null);
      setUserPrincipalName(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (BYPASS_AUTH) {
      const dummy = localStorage.getItem('dummy_user');
      if (dummy) {
        setUser(JSON.parse(dummy));
      }
      setLoading(false);
    } else {
      fetchUser();
      const listener = (data: any) => {
        if (['signIn', 'signOut'].includes(data.payload.event)) fetchUser();
      };
      const removeListener = Hub.listen('auth', listener);
      setLoading(false);
      return () => removeListener();
    }
  }, []);

  const signIn = () => {
    // Do not return the promise, just call the async function
    void signInWithRedirect({ provider: { custom: 'Auth0' } });
  };
  const signOut = () => {
    if (BYPASS_AUTH) {
      localStorage.removeItem('dummy_user');
      setUser(null);
      window.location.reload();
    } else {
      void signOutFromProvider();
    }
  };

  const contextValue = React.useMemo(
    () => ({
      user,
      loading,
      signIn,
      signOut,
      userPrincipalName,
    }),
    [user, loading, userPrincipalName]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
