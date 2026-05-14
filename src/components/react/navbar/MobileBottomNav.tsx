import React, { useState, useEffect } from 'react';
import { X, ChevronUp, MoreHorizontal, Home, Layers, Calendar, Handshake, Info, Compass, User } from 'lucide-react';

interface MobileBottomNavProps {
  initialPath?: string;
  onNavigate?: (path: string) => void;
}

const primaryNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/collections', label: 'Collections', icon: Layers },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/feedback', label: 'Feedback', icon: Handshake },
];

const secondaryNavItems = [
  { href: '/resources', label: 'Resources', icon: Info },
  { href: '/visit', label: 'Visit', icon: Compass },
  { href: '/about', label: 'About Us', icon: User },
];

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  // Read from the authoritative data-theme attribute on <html>
  // This is set by ThemeInit.astro and ThemeToggle, avoiding localStorage race conditions
  try {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
  } catch {}
  return 'dark';
}

export default function MobileBottomNav({ initialPath = '/', onNavigate }: MobileBottomNavProps) {
  const [activeLink, setActiveLink] = useState(initialPath);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  // Listen for theme changes - read from data-theme attribute (authoritative source)
  useEffect(() => {
    const getThemeFromDOM = () => {
      const attr = document.documentElement.getAttribute('data-theme');
      return (attr === 'light' || attr === 'dark') ? attr : 'dark';
    };

    const handleStorage = () => {
      setTheme(getThemeFromDOM());
    };

    const handleAstroSwap = () => {
      setTheme(getThemeFromDOM());
    };

    const handleThemeChange = () => {
      setTheme(getThemeFromDOM());
    };

    window.addEventListener('storage', handleStorage);
    document.addEventListener('astro:after-swap', handleAstroSwap);

    // Listen for theme-toggle custom event (fired by ThemeToggle when theme changes)
    document.addEventListener('theme-change', handleThemeChange);

    // Also poll for theme changes as fallback
    const interval = setInterval(() => {
      setTheme(getThemeFromDOM());
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('astro:after-swap', handleAstroSwap);
      document.removeEventListener('theme-change', handleThemeChange);
      clearInterval(interval);
    };
  }, []);

  const isDark = theme === 'dark';

  const colors = {
    light: {
      // Light mode: --color-text-secondary background with coral active, black inactive
      background: '#d8d5cf', // --color-text-secondary
      border: '#cc785c', // --color-primary (top border)
      text: '#141413', // --color-ink (black - non-active icons)
      textMuted: '#141413', // --color-ink (black - non-active icons)
      active: '#cc785c', // --color-primary (coral - active icons)
      activeBg: 'rgba(204, 120, 92, 0.2)', // coral with opacity
      menuBg: '#d8d5cf',
      menuBorder: '#cc785c',
    },
    dark: {
      // Dark mode: Dark background with white active, gray inactive
      background: '#181715', // surface-dark
      border: '#252320',
      text: '#6c6a64', // --color-muted (gray - non-active icons)
      textMuted: '#6c6a64', // --color-muted (gray - non-active icons)
      active: '#ffffff', // white - active icons
      activeBg: 'rgba(255, 255, 255, 0.1)',
      menuBg: '#181715',
      menuBorder: '#252320',
    },
  };

  const c = isDark ? colors.dark : colors.light;

  return (
    <>
      {/* Main Bottom Navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-[70] safe-area-pb"
        style={{
          backgroundColor: c.background,
          borderTop: `2px solid ${c.border}`,
        }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {primaryNavItems.map((item) => {
            const isActive = activeLink === item.href;
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setActiveLink(item.href)}
                className="flex flex-col items-center justify-center p-2 rounded-xl transition-all"
                style={{
                  color: isActive ? c.active : c.textMuted,
                  // backgroundColor: isActive ? c.activeBg : 'transparent',
                }}
              >
                <Icon size={20} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </a>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className="flex flex-col items-center justify-center p-2 rounded-xl transition-all"
            style={{
              color: isMoreMenuOpen ? c.active : c.textMuted,
              // backgroundColor: isMoreMenuOpen ? c.activeBg : 'transparent',
            }}
          >
            {isMoreMenuOpen ? <X size={20} /> : <MoreHorizontal size={20} />}
            <span className="text-xs mt-1 font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Expandable More Menu */}
      <div
        className={`md:hidden fixed bottom-16 left-0 right-0 z-[60] transition-all duration-300 ease-in-out ${
          isMoreMenuOpen ? 'translate-y-0 opacity-100 mb-2' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="mx-4 mb-2 rounded-2xl shadow-xl backdrop-blur-lg"
          style={{
            backgroundColor: c.menuBg,
            border: `1px solid ${c.menuBorder}`,
          }}
        >
          {/* Arrow indicator */}
          <div className="flex justify-center py-2">
            <ChevronUp
              size={16}
              style={{ color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.3)' }}
            />
          </div>

          {/* Secondary navigation items */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-3 gap-3">
              {secondaryNavItems.map((item) => {
                const isActive = activeLink === item.href;
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setActiveLink(item.href);
                      setIsMoreMenuOpen(false);
                    }}
                    className="flex flex-col items-center justify-center p-4 rounded-xl transition-all"
                    style={{
                      color: isActive ? c.active : c.textMuted,
                      backgroundColor: isActive ? c.activeBg : 'transparent',
                    }}
                  >
                    <div className="mb-2">
                      <Icon size={20} />
                    </div>
                    <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMoreMenuOpen && (
        <div
          className="fixed inset-0 z-20"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
          onClick={() => setIsMoreMenuOpen(false)}
        />
      )}
    </>
  );
}