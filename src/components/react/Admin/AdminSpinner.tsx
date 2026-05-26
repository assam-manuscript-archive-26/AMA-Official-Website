import React from 'react';
import { Loader2 } from 'lucide-react';

interface AdminSpinnerProps {
  size?: number;
  label?: string;
  fullHeight?: boolean;
}

export default function AdminSpinner({
  size = 28,
  label = 'Loading...',
  fullHeight = true,
}: AdminSpinnerProps) {
  return (
    <div className="admin-spinner-wrap" style={fullHeight ? { minHeight: 400 } : undefined}>
      <Loader2 size={size} className="admin-spinner-icon" />
      {label && <p className="admin-spinner-label">{label}</p>}
      <style>{`
        .admin-spinner-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: var(--admin-text-soft);
          font-family: var(--font-body);
          font-size: 14px;
        }
        .admin-spinner-icon {
          color: var(--color-primary);
          animation: adminSpin 0.8s linear infinite;
        }
        .admin-spinner-label {
          margin: 0;
        }
      `}</style>
    </div>
  );
}
