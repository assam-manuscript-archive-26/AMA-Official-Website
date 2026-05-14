import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Upload, Image, MessageSquare, CalendarCheck,
  BookOpen, Mail, Menu, X, MoreHorizontal, ChevronUp,
  Sun, Moon, Monitor,
} from 'lucide-react';

interface NavTab { name: string; icon: React.ReactNode; path: string; primary?: boolean; }

const tabs: NavTab[] = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin', primary: true },
  { name: 'Upload', icon: <Upload size={20} />, path: '/admin/upload', primary: true },
  { name: 'Artifacts', icon: <Image size={20} />, path: '/admin/artifacts', primary: true },
  { name: 'Feedback', icon: <MessageSquare size={20} />, path: '/admin/feedback', primary: true },
  { name: 'Events', icon: <CalendarCheck size={20} />, path: '/admin/events' },
  { name: 'Resources', icon: <BookOpen size={20} />, path: '/admin/resources' },
  { name: 'Contact', icon: <Mail size={20} />, path: '/admin/contact' },
];

interface AdminSidebarProps { currentPath?: string; onNavigate?: (path: string) => void; isOpen?: boolean; onToggle?: () => void; }

type ThemeMode = 'light' | 'dark' | 'system';

export default function AdminSidebar({ currentPath = '/admin', onNavigate, isOpen = true, onToggle }: AdminSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activePath = currentPath;
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('samaguri_theme') as ThemeMode | null;
      if (saved) setCurrentTheme(saved);
    }
  }, []);

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
    setIsMobileMenuOpen(false);
  };

  const applyTheme = (mode: ThemeMode) => {
    setCurrentTheme(mode);
    localStorage.setItem('samaguri_theme', mode);
    const root = document.documentElement;
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'light' : 'dark');
    } else {
      root.setAttribute('data-theme', mode === 'dark' ? 'light' : 'dark');
    }
    setThemeMenuOpen(false);
  };

  const themeIcon = currentTheme === 'dark' ? <Moon size={18} /> : currentTheme === 'light' ? <Sun size={18} /> : <Monitor size={18} />;
  const themeLabel = currentTheme === 'dark' ? 'Dark' : currentTheme === 'light' ? 'Light' : 'System';

  const primaryNavItems = tabs.filter(item => item.primary);
  const secondaryNavItems = tabs.filter(item => !item.primary);

  const isActive = (path: string) => {
    if (path === '/admin') return activePath === '/admin' || activePath === '/admin/';
    return activePath.startsWith(path);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="admin-sidebar-desktop">
        <div className={`admin-sidebar ${isOpen ? 'admin-sidebar--open' : 'admin-sidebar--closed'}`}>
          {/* Header */}
          <div className="admin-sidebar-header">
            {isOpen && (
              <div className="admin-sidebar-brand">
                <span className="admin-sidebar-title">Samaguri Satra</span>
                <span className="admin-sidebar-subtitle">Admin Panel</span>
              </div>
            )}
            <button onClick={onToggle} className="admin-sidebar-toggle" aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="admin-sidebar-nav">
            {tabs.map((tab) => (
              <a key={tab.path} href={tab.path} onClick={(e) => handleNav(e, tab.path)} className={`admin-sidebar-link ${isActive(tab.path) ? 'admin-sidebar-link--active' : ''}`} title={!isOpen ? tab.name : undefined}>
                <span className="admin-sidebar-link-icon">{tab.icon}</span>
                {isOpen && <span className="admin-sidebar-link-text">{tab.name}</span>}
              </a>
            ))}
          </nav>

          {/* Theme Toggle at Bottom */}
          <div className="admin-sidebar-footer">
            <div className="admin-sidebar-theme-wrapper">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="admin-sidebar-theme-btn"
                title={!isOpen ? `Theme: ${themeLabel}` : undefined}
              >
                <span className="admin-sidebar-link-icon">{themeIcon}</span>
                {isOpen && <span className="admin-sidebar-link-text">{themeLabel}</span>}
                {isOpen && <ChevronUp size={14} className={`admin-sidebar-theme-chevron ${themeMenuOpen ? 'admin-sidebar-theme-chevron--open' : ''}`} />}
              </button>

              {themeMenuOpen && (
                <div className="admin-sidebar-theme-menu">
                  <button onClick={() => applyTheme('light')} className={`admin-sidebar-theme-option ${currentTheme === 'light' ? 'admin-sidebar-theme-option--active' : ''}`}>
                    <Sun size={15} /> Light
                  </button>
                  <button onClick={() => applyTheme('dark')} className={`admin-sidebar-theme-option ${currentTheme === 'dark' ? 'admin-sidebar-theme-option--active' : ''}`}>
                    <Moon size={15} /> Dark
                  </button>
                  <button onClick={() => applyTheme('system')} className={`admin-sidebar-theme-option ${currentTheme === 'system' ? 'admin-sidebar-theme-option--active' : ''}`}>
                    <Monitor size={15} /> System
                  </button>
                </div>
              )}
            </div>
            {isOpen && <span className="admin-sidebar-footer-text">v1.0 — Samaguri Satra</span>}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="admin-mobile-nav">
        <div className="admin-mobile-bar">
          <div className="admin-mobile-bar-inner">
            {primaryNavItems.map((item) => (
              <a key={item.path} href={item.path} onClick={(e) => handleNav(e, item.path)} className={`admin-mobile-item ${isActive(item.path) ? 'admin-mobile-item--active' : ''}`}>
                {item.icon}
                <span className="admin-mobile-item-label">{item.name}</span>
              </a>
            ))}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`admin-mobile-item ${isMobileMenuOpen ? 'admin-mobile-item--active' : ''}`}>
              {isMobileMenuOpen ? <X size={20} /> : <MoreHorizontal size={20} />}
              <span className="admin-mobile-item-label">More</span>
            </button>
          </div>
        </div>

        <div className={`admin-mobile-more ${isMobileMenuOpen ? 'admin-mobile-more--open' : ''}`}>
          <div className="admin-mobile-more-panel">
            <div className="admin-mobile-more-arrow"><ChevronUp size={16} /></div>
            <div className="admin-mobile-more-grid">
              {secondaryNavItems.map((item) => (
                <a key={item.path} href={item.path} onClick={(e) => handleNav(e, item.path)} className={`admin-mobile-more-item ${isActive(item.path) ? 'admin-mobile-item--active' : ''}`}>
                  <div className="admin-mobile-more-item-icon">{item.icon}</div>
                  <span className="admin-mobile-more-item-label">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {isMobileMenuOpen && <div className="admin-mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />}
      </div>

      <style>{`
        /* ── Desktop Sidebar ──────────────────────────── */
        .admin-sidebar-desktop {
          display: none;
        }

        @media (min-width: 768px) {
          .admin-sidebar-desktop {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 50;
          }
        }

        .admin-sidebar {
          background: var(--color-surface-dark-elevated);
          color: var(--color-on-dark);
          display: flex;
          flex-direction: column;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-right: 1px solid var(--color-hairline-soft);
          overflow: visible;
          height: 100%;
        }

        .admin-sidebar--open { width: 240px; }
        .admin-sidebar--closed { width: 60px; }

        .admin-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          min-height: 72px;
        }

        .admin-sidebar-brand {
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
          white-space: nowrap;
        }

        .admin-sidebar-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 600;
          color: var(--color-on-dark);
          line-height: 1.2;
        }

        .admin-sidebar-subtitle {
          font-family: var(--font-body);
          font-size: 11px;
          color: var(--color-on-dark-soft);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .admin-sidebar-toggle {
          background: none;
          border: none;
          color: var(--color-on-dark-soft);
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s;
          flex-shrink: 0;
        }

        .admin-sidebar-toggle:hover {
          background: rgba(255,255,255,0.08);
          color: var(--color-on-dark);
        }

        .admin-sidebar-nav {
          flex: 1;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }

        .admin-sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-on-dark-soft);
          text-decoration: none;
          transition: all 0.15s ease;
          white-space: nowrap;
          position: relative;
        }

        .admin-sidebar-link:hover {
          background: rgba(255,255,255,0.06);
          color: var(--color-on-dark);
        }

        .admin-sidebar-link--active {
          background: var(--color-primary) !important;
          color: var(--color-on-primary) !important;
        }

        .admin-sidebar-link--active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 4px;
          bottom: 4px;
          width: 3px;
          border-radius: 0 2px 2px 0;
          background: var(--color-on-primary);
          opacity: 0.6;
        }

        .admin-sidebar-link-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 20px;
          height: 20px;
        }

        .admin-sidebar-link-text {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Footer + Theme ──────────────────────────── */
        .admin-sidebar-footer {
          padding: 12px 8px 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .admin-sidebar-footer-text {
          font-family: var(--font-body);
          font-size: 11px;
          color: var(--color-on-dark-soft);
          opacity: 0.5;
          padding: 0 12px;
        }

        .admin-sidebar-theme-wrapper {
          position: relative;
        }

        .admin-sidebar-theme-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-on-dark-soft);
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          text-align: left;
        }

        .admin-sidebar-theme-btn:hover {
          background: rgba(255,255,255,0.06);
          color: var(--color-on-dark);
        }

        .admin-sidebar-theme-chevron {
          margin-left: auto;
          opacity: 0.5;
          transition: transform 0.2s;
        }

        .admin-sidebar-theme-chevron--open {
          transform: rotate(180deg);
        }

        .admin-sidebar-theme-menu {
          position: absolute;
          bottom: calc(100% + 4px);
          left: 0;
          right: 0;
          background: var(--color-surface-dark-elevated);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-lg);
          box-shadow: 0 -8px 24px rgba(0,0,0,0.4);
          padding: 6px;
          animation: themeMenuIn 0.15s ease-out;
          z-index: 60;
        }

        @keyframes themeMenuIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .admin-sidebar-theme-option {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-on-dark-soft);
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.1s;
          text-align: left;
        }

        .admin-sidebar-theme-option:hover {
          background: rgba(255,255,255,0.06);
          color: var(--color-on-dark);
        }

        .admin-sidebar-theme-option--active {
          background: var(--color-primary) !important;
          color: var(--color-on-primary) !important;
        }

        /* ── Mobile Bottom Navigation ─────────────────── */
        .admin-mobile-nav { display: block; }
        @media (min-width: 768px) { .admin-mobile-nav { display: none; } }

        .admin-mobile-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 70;
          background: var(--color-surface-dark-elevated);
          border-top: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          padding: 6px 8px;
          padding-bottom: max(6px, env(safe-area-inset-bottom));
        }

        .admin-mobile-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-around;
        }

        .admin-mobile-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6px 12px;
          border-radius: var(--radius-lg);
          color: var(--color-on-dark-soft);
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: var(--font-body);
        }

        .admin-mobile-item:hover {
          color: var(--color-on-dark);
          background: rgba(255,255,255,0.06);
        }

        .admin-mobile-item--active {
          color: var(--color-primary) !important;
          background: rgba(204, 120, 92, 0.12);
        }

        .admin-mobile-item-label {
          font-size: 10px;
          margin-top: 3px;
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        .admin-mobile-more {
          position: fixed;
          bottom: 64px;
          left: 0;
          right: 0;
          z-index: 60;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(100%);
          opacity: 0;
          pointer-events: none;
        }

        .admin-mobile-more--open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .admin-mobile-more-panel {
          margin: 0 16px 8px;
          border-radius: var(--radius-xl);
          background: var(--color-surface-dark-elevated);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          box-shadow: 0 -8px 32px rgba(0,0,0,0.3);
          overflow: hidden;
        }

        .admin-mobile-more-arrow {
          display: flex;
          justify-content: center;
          padding: 8px 0 4px;
          color: var(--color-on-dark-soft);
          opacity: 0.4;
        }

        .admin-mobile-more-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          padding: 8px 16px 16px;
        }

        .admin-mobile-more-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px 8px;
          border-radius: var(--radius-lg);
          color: var(--color-on-dark-soft);
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .admin-mobile-more-item:hover {
          color: var(--color-on-dark);
          background: rgba(255,255,255,0.06);
        }

        .admin-mobile-more-item-icon { margin-bottom: 6px; }

        .admin-mobile-more-item-label {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 500;
          text-align: center;
          line-height: 1.2;
        }

        .admin-mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(4px);
          z-index: 20;
        }
      `}</style>
    </>
  );
}
