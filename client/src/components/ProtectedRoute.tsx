import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import LogoLoading from './LogoLoading';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation('/login');
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B0F14] via-[#131820] to-[#0B0F14]">
        <LogoLoading />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
