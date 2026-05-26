import React, { useState, useRef, useEffect } from 'react';
import {
  Bell, ChevronDown, LogOut, RefreshCw, Home, User, Sun, Moon, Monitor,
} from 'lucide-react';
import useAuth from '../../../hooks/useAuth';

type ThemeMode = 'light' | 'dark' | 'system';

export default function AdminTopbar() {
  const { user, logout: handleLogout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('dark');
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const notifications = [
    'New visitor feedback received',
    'Event published successfully',
    'Artifact updated',
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Sync theme from localStorage
    const saved = localStorage.getItem('ama_theme') as ThemeMode | null;
    if (saved) setCurrentTheme(saved);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    setCurrentTheme(mode);
    localStorage.setItem('ama_theme', mode);
    const root = document.documentElement;
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', mode === 'dark' ? 'dark' : 'light');
    }
  };

  const cycleTheme = () => {
    const next: ThemeMode = currentTheme === 'dark' ? 'light' : currentTheme === 'light' ? 'system' : 'dark';
    applyTheme(next);
  };

  const themeIcon = currentTheme === 'dark' ? <Moon size={15} /> : currentTheme === 'light' ? <Sun size={15} /> : <Monitor size={15} />;
  const themeLabel = currentTheme === 'dark' ? 'Dark Mode' : currentTheme === 'light' ? 'Light Mode' : 'System';

  return (
    <header className="admin-topbar">
      <h1 className="admin-topbar-title">
        Assamese Manuscript Archive Admin
      </h1>

      <div className="admin-topbar-actions">
        {/* Notification Bell */}
        <div ref={notifRef} className="admin-topbar-dropdown-wrapper">
          <button onClick={() => setNotifOpen(!notifOpen)} className="admin-topbar-icon-btn" aria-label="Notifications">
            <Bell size={18} />
            {notifications.length > 0 && <span className="admin-topbar-notif-badge" />}
          </button>
          {notifOpen && (
            <div className="admin-topbar-dropdown admin-topbar-dropdown--notif">
              <div className="admin-topbar-dropdown-header">
                <span>Notifications</span>
                <button onClick={() => setNotifOpen(false)} className="admin-topbar-dropdown-action">Clear all</button>
              </div>
              <ul className="admin-topbar-notif-list">
                {notifications.map((note, index) => (
                  <li key={index} className="admin-topbar-notif-item">{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="admin-topbar-dropdown-wrapper">
          <button onClick={() => setProfileOpen(!profileOpen)} className="admin-topbar-profile-btn">
            <div className="admin-topbar-avatar"><User size={16} /></div>
            <span className="admin-topbar-username">{user?.name || user?.username || 'Admin'}</span>
            <ChevronDown size={14} className="admin-topbar-chevron" />
          </button>

          {profileOpen && (
            <div className="admin-topbar-dropdown admin-topbar-dropdown--profile">
              {/* Theme Toggle */}
              <button className="admin-topbar-dropdown-item" onClick={cycleTheme}>
                {themeIcon}
                <span>{themeLabel}</span>
              </button>

              <button className="admin-topbar-dropdown-item" onClick={() => window.location.reload()}>
                <RefreshCw size={15} />
                <span>Refresh Page</span>
              </button>

              <a href="/" className="admin-topbar-dropdown-item">
                <Home size={15} />
                <span>Visit Website</span>
              </a>

              <div className="admin-topbar-dropdown-divider" />

              <button className="admin-topbar-dropdown-item admin-topbar-dropdown-item--danger" onClick={handleLogout}>
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-topbar {
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 56px;
          background: var(--admin-surface);
          border-bottom: 1px solid var(--admin-border);
          backdrop-filter: blur(12px);
          flex-shrink: 0;
        }

        .admin-topbar-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 600;
          color: var(--admin-text);
          margin: 0;
          line-height: 1;
        }

        .admin-topbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-topbar-dropdown-wrapper { position: relative; }

        .admin-topbar-icon-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--admin-input-bg);
          border: 1px solid var(--admin-input-border);
          color: var(--admin-text-soft);
          cursor: pointer;
          transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
          outline: none;
        }

        .admin-topbar-icon-btn:hover {
          background: var(--admin-surface-hover);
          border-color: var(--admin-border-strong);
          color: var(--admin-text);
        }

        .admin-topbar-icon-btn:focus-visible {
          box-shadow: var(--admin-focus-ring);
        }

        .admin-topbar-notif-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-primary);
          border: 2px solid var(--admin-surface);
        }

        .admin-topbar-profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px 4px 4px;
          border-radius: var(--radius-pill);
          background: var(--admin-input-bg);
          border: 1px solid var(--admin-input-border);
          color: var(--admin-text);
          cursor: pointer;
          transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
          font-family: var(--font-body);
          outline: none;
        }

        .admin-topbar-profile-btn:hover {
          background: var(--admin-surface-hover);
          border-color: var(--admin-border-strong);
        }

        .admin-topbar-profile-btn:focus-visible {
          box-shadow: var(--admin-focus-ring);
        }

        .admin-topbar-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--color-primary);
          color: var(--color-on-primary);
        }

        .admin-topbar-username { font-size: 13px; font-weight: 500; }
        @media (max-width: 640px) { .admin-topbar-username { display: none; } }
        .admin-topbar-chevron { opacity: 0.5; }

        .admin-topbar-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--admin-shadow-lg);
          overflow: hidden;
          animation: topbarDropdownIn 0.15s ease-out;
        }

        @keyframes topbarDropdownIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .admin-topbar-dropdown--notif { width: 300px; }
        .admin-topbar-dropdown--profile { width: 200px; }

        .admin-topbar-dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--admin-divider);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--admin-text);
        }

        .admin-topbar-dropdown-action {
          font-size: 11px;
          color: var(--color-primary);
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
          font-weight: 500;
        }

        .admin-topbar-dropdown-action:hover { text-decoration: underline; }

        .admin-topbar-notif-list {
          list-style: none;
          margin: 0;
          padding: 0;
          max-height: 240px;
          overflow-y: auto;
        }

        .admin-topbar-notif-item {
          padding: 10px 16px;
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--admin-text-soft);
          border-bottom: 1px solid var(--admin-divider);
          transition: background 0.15s ease;
        }

        .admin-topbar-notif-item:hover { background: var(--admin-hover-bg); }
        .admin-topbar-notif-item:last-child { border-bottom: none; }

        .admin-topbar-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 16px;
          background: none;
          border: none;
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--admin-text-soft);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
          text-decoration: none;
        }

        .admin-topbar-dropdown-item:hover {
          background: var(--admin-hover-bg);
          color: var(--admin-text);
        }

        .admin-topbar-dropdown-item--danger { color: var(--color-error) !important; }
        .admin-topbar-dropdown-item--danger:hover { background: color-mix(in srgb, var(--color-error) 12%, transparent); }

        .admin-topbar-dropdown-divider {
          height: 1px;
          background: var(--admin-divider);
          margin: 4px 0;
        }
      `}</style>
    </header>
  );
}
