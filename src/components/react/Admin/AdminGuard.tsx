import React, { type ReactNode } from 'react';
import useAuth from '../../../hooks/useAuth';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--color-surface-dark)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div className="admin-guard-spinner" />
          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-muted-soft)',
            fontSize: '14px',
          }}>
            Verifying session...
          </p>
          <style>{`
            .admin-guard-spinner {
              width: 32px;
              height: 32px;
              border: 3px solid var(--color-surface-dark-soft);
              border-top-color: var(--color-primary);
              border-radius: 50%;
              animation: adminGuardSpin 0.8s linear infinite;
            }
            @keyframes adminGuardSpin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
    return null;
  }

  return <>{children}</>;
}
