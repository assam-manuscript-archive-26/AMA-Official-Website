import { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser, logout, getSession } from '../backend/actions/auth';

export interface AuthUser {
  id: string;
  username: string;
  name?: string;
  role?: string;
}

export default function useAuth() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      if (authenticated) {
        const userData = getCurrentUser();
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
  };

  return {
    isAuthenticated: isAuth,
    user,
    loading,
    logout: handleLogout,
    session: typeof window !== 'undefined' ? getSession() : null,
  };
}
