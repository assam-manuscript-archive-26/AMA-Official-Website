import React, { useState, useEffect, useCallback } from 'react';
import AdminGuard from './AdminGuard';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

// Eagerly import all admin components (they're small enough)
import Dashboard from './Dashboard';
import UploadManager from './UploadManager';
import ArtifactManager from './ArtifactManager';
import FeedbackManager from './FeedbackManager';
import EventsAdmin from './EventsAdmin';
import ResourcesAdmin from './ResourcesAdmin';
import ContactAdmin from './ContactAdmin';
import CloudUploadAdmin from './CloudUploadAdmin';

const ROUTES: Record<string, React.ComponentType> = {
  '/admin': Dashboard,
  '/admin/upload': UploadManager,
  '/admin/artifacts': ArtifactManager,
  '/admin/feedback': FeedbackManager,
  '/admin/events': EventsAdmin,
  '/admin/resources': ResourcesAdmin,
  '/admin/contact': ContactAdmin,
  '/admin/cloud-upload': CloudUploadAdmin,
};

interface AdminShellProps {
  children?: React.ReactNode;
  currentPath?: string;
}

export default function AdminShell({ currentPath }: AdminShellProps) {
  const [activePath, setActivePath] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.replace(/\/$/, '') || '/admin';
      return p;
    }
    return currentPath || '/admin';
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useCallback((path: string) => {
    const normalized = path.replace(/\/$/, '') || '/admin';
    if (normalized === activePath) return;
    window.history.pushState({}, '', normalized);
    setActivePath(normalized);
    const segment = normalized.split('/').pop();
    const title = segment === 'admin' ? 'Dashboard' : (segment || 'Dashboard');
    document.title = `${title.charAt(0).toUpperCase() + title.slice(1)} | Assamese Manuscript Archive Admin`;
  }, [activePath]);

  useEffect(() => {
    const handlePop = () => {
      const p = window.location.pathname.replace(/\/$/, '') || '/admin';
      setActivePath(p);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const ActiveComponent = ROUTES[activePath] || Dashboard;
  const marginLeft = sidebarOpen ? 240 : 60;

  return (
    <AdminGuard>
      <div className="admin-shell">
        <AdminSidebar
          currentPath={activePath}
          onNavigate={navigate}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(p => !p)}
        />
        <div className="admin-shell-main" style={{ marginLeft: `${marginLeft}px` }}>
          <AdminTopbar />
          <main className="admin-shell-content">
            <ActiveComponent />
          </main>
        </div>
      </div>

      <style>{`
        .admin-shell {
          display: flex;
          min-height: 100vh;
          background: var(--admin-bg);
          color: var(--admin-text);
        }

        .admin-shell-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          height: 100vh;
          overflow: hidden;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (max-width: 767px) {
          .admin-shell-main {
            margin-left: 0 !important;
          }
        }

        .admin-shell-content {
          flex: 1;
          padding: 28px;
          overflow-y: auto;
        }

        @media (max-width: 767px) {
          .admin-shell-content {
            padding: 20px 16px 80px;
          }
        }
      `}</style>
    </AdminGuard>
  );
}
