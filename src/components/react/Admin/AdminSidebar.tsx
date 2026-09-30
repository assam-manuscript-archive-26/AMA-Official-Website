import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Upload, Image, Images, MessageSquare, CalendarCheck,
  BookOpen, Mail, Cloud, Menu, X, MoreHorizontal, ChevronUp,
  Sun, Moon, Monitor,
} from 'lucide-react';

interface NavTab { name: string; icon: React.ReactNode; path: string; primary?: boolean; }

const tabs: NavTab[] = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin', primary: true },
  { name: 'Upload', icon: <Upload size={20} />, path: '/admin/upload', primary: true },
  { name: 'Artifacts', icon: <Image size={20} />, path: '/admin/artifacts', primary: true },
  { name: 'Gallery', icon: <Images size={20} />, path: '/admin/gallery', primary: true },
  { name: 'Feedback', icon: <MessageSquare size={20} />, path: '/admin/feedback', primary: true },
  { name: 'Events', icon: <CalendarCheck size={20} />, path: '/admin/events' },
  { name: 'Resources', icon: <BookOpen size={20} />, path: '/admin/resources' },
  { name: 'Contact', icon: <Mail size={20} />, path: '/admin/contact' },
  { name: 'Cloud Upload', icon: <Cloud size={20} />, path: '/admin/cloud-upload' },
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
      const saved = localStorage.getItem('ama_theme') as ThemeMode | null;
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
    localStorage.setItem('ama_theme', mode);
    const root = document.documentElement;
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', mode === 'dark' ? 'dark' : 'light');
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
            {isOpen ? (
              <>
                <a href="/admin" onClick={(e) => handleNav(e, '/admin')} className="admin-sidebar-logo-link" aria-label="Admin home">
                  <img
                    src="/assets/logo/logo.png"
                    alt="Assamese Manuscript Archive"
                    className="admin-sidebar-logo"
                  />
                </a>
                <button onClick={onToggle} className="admin-sidebar-toggle" aria-label="Collapse sidebar">
                  <X size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={onToggle}
                className="admin-sidebar-logo-toggle"
                aria-label="Expand sidebar"
                title="Expand sidebar"
              >
                <img
                  src="/assets/logo/logo.png"
                  alt="Assamese Manuscript Archive"
                  className="admin-sidebar-logo admin-sidebar-logo--swap"
                />
                <span className="admin-sidebar-logo-menu" aria-hidden="true">
                  <Menu size={18} />
                </span>
              </button>
            )}
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
            {isOpen && <span className="admin-sidebar-footer-text">v1.0 — Assamese Manuscript Archive</span>}
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
          background: var(--admin-surface);
          color: var(--admin-text);
          display: flex;
          flex-direction: column;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-right: 1px solid var(--admin-border);
          overflow: visible;
          height: 100%;
        }

        .admin-sidebar--open { width: 240px; }
        .admin-sidebar--closed { width: 60px; }

        .admin-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid var(--admin-divider);
          min-height: 64px;
          gap: 8px;
        }

        .admin-sidebar-logo-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: opacity 0.15s ease, transform 0.15s ease;
          outline: none;
        }

        .admin-sidebar-logo-link:hover { opacity: 0.85; }
        .admin-sidebar-logo-link:active { transform: scale(0.96); }
        .admin-sidebar-logo-link:focus-visible { box-shadow: var(--admin-focus-ring); }

        .admin-sidebar-logo {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }

        /* Collapsed state — logo doubles as expand toggle */
        .admin-sidebar-logo-toggle {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          flex-shrink: 0;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          outline: none;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .admin-sidebar-logo-toggle:focus-visible {
          box-shadow: var(--admin-focus-ring);
        }
        .admin-sidebar-logo-toggle:active { transform: scale(0.94); }

        .admin-sidebar-logo--swap {
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .admin-sidebar-logo-toggle:hover .admin-sidebar-logo--swap,
        .admin-sidebar-logo-toggle:focus-visible .admin-sidebar-logo--swap {
          opacity: 0;
          transform: scale(0.85);
        }

        .admin-sidebar-logo-menu {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-primary);
          color: var(--color-on-primary);
          opacity: 0;
          transform: scale(0.85);
          transition: opacity 0.18s ease, transform 0.18s ease;
          pointer-events: none;
        }
        .admin-sidebar-logo-toggle:hover .admin-sidebar-logo-menu,
        .admin-sidebar-logo-toggle:focus-visible .admin-sidebar-logo-menu {
          opacity: 1;
          transform: scale(1);
        }

        .admin-sidebar--closed .admin-sidebar-header {
          padding: 16px 12px;
          justify-content: center;
        }

        .admin-sidebar--closed .admin-sidebar-toggle {
          display: none;
        }

        .admin-sidebar-toggle {
          background: none;
          border: none;
          color: var(--admin-text-soft);
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease, color 0.15s ease;
          flex-shrink: 0;
          outline: none;
        }

        .admin-sidebar-toggle:hover {
          background: var(--admin-hover-bg);
          color: var(--admin-text);
        }

        .admin-sidebar-toggle:focus-visible {
          box-shadow: var(--admin-focus-ring);
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
          color: var(--admin-text-soft);
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
          white-space: nowrap;
          position: relative;
          outline: none;
        }

        .admin-sidebar-link:hover {
          background: var(--admin-hover-bg);
          color: var(--admin-text);
        }

        .admin-sidebar-link:focus-visible {
          box-shadow: var(--admin-focus-ring);
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
          border-top: 1px solid var(--admin-divider);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .admin-sidebar-footer-text {
          font-family: var(--font-body);
          font-size: 11px;
          color: var(--admin-text-muted);
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
          color: var(--admin-text-soft);
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
          white-space: nowrap;
          text-align: left;
          outline: none;
        }

        .admin-sidebar-theme-btn:hover {
          background: var(--admin-hover-bg);
          color: var(--admin-text);
        }

        .admin-sidebar-theme-btn:focus-visible {
          box-shadow: var(--admin-focus-ring);
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
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--admin-shadow-lg);
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
          color: var(--admin-text-soft);
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
          text-align: left;
          outline: none;
        }

        .admin-sidebar-theme-option:hover {
          background: var(--admin-hover-bg);
          color: var(--admin-text);
        }

        .admin-sidebar-theme-option:focus-visible {
          box-shadow: var(--admin-focus-ring);
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
          background: var(--admin-surface);
          border-top: 1px solid var(--admin-border);
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
          color: var(--admin-text-soft);
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
          font-family: var(--font-body);
        }

        .admin-mobile-item:hover {
          color: var(--admin-text);
          background: var(--admin-hover-bg);
        }

        .admin-mobile-item--active {
          color: var(--color-primary) !important;
          background: color-mix(in srgb, var(--color-primary) 12%, transparent);
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
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          backdrop-filter: blur(16px);
          box-shadow: var(--admin-shadow-lg);
          overflow: hidden;
        }

        .admin-mobile-more-arrow {
          display: flex;
          justify-content: center;
          padding: 8px 0 4px;
          color: var(--admin-text-muted);
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
          color: var(--admin-text-soft);
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .admin-mobile-more-item:hover {
          color: var(--admin-text);
          background: var(--admin-hover-bg);
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
          background: rgba(20,20,19,0.4);
          backdrop-filter: blur(4px);
          z-index: 20;
        }
      `}</style>
    </>
  );
}
