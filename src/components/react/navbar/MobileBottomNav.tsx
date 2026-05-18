import { useState, useEffect, useCallback } from 'react';
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

const themeColors = {
  light: {
    background: '#d8d5cf',
    border: '#cc785c',
    text: '#141413',
    textMuted: '#141413',
    active: '#cc785c',
    activeBg: 'rgba(204, 120, 92, 0.2)',
    menuBg: '#d8d5cf',
    menuBorder: '#cc785c',
  },
  dark: {
    background: '#181715',
    border: '#252320',
    text: '#6c6a64',
    textMuted: '#6c6a64',
    active: '#ffffff',
    activeBg: 'rgba(255, 255, 255, 0.1)',
    menuBg: '#181715',
    menuBorder: '#252320',
  },
};

function getThemeFromDOM(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr;
  // Fallback: read localStorage directly (same key as ThemeInit.astro)
  try {
    const stored = localStorage.getItem('ama-theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return 'light';
}

export default function MobileBottomNav({ initialPath = '/', onNavigate }: MobileBottomNavProps) {
  const [activeLink, setActiveLink] = useState(initialPath);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  // This counter forces re-renders when theme changes. The actual theme value
  // is read from the DOM on every render, so it's always correct.
  const [, setThemeTick] = useState(0);

  const forceThemeRerender = useCallback(() => {
    setThemeTick(t => t + 1);
  }, []);

  // Force a re-read after hydration to pick up ThemeInit's changes.
  // Without this, the SSR-baked dark colors persist until the next mutation.
  useEffect(() => {
    forceThemeRerender();
  }, [forceThemeRerender]);

  useEffect(() => {
    // MutationObserver watches the data-theme attribute on <html> for changes.
    // This catches ALL theme changes regardless of source (ThemeToggle, manual DOM, etc.)
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          forceThemeRerender();
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Also listen for custom events from ThemeToggle (for same-page toggles)
    const handleThemeChange = () => forceThemeRerender();
    const handleAstroSwap = () => forceThemeRerender();
    document.addEventListener('theme-change', handleThemeChange);
    document.addEventListener('astro:after-swap', handleAstroSwap);

    return () => {
      observer.disconnect();
      document.removeEventListener('theme-change', handleThemeChange);
      document.removeEventListener('astro:after-swap', handleAstroSwap);
    };
  }, [forceThemeRerender]);

  // Read theme directly from DOM on every render — never stale, no flash.
  // getThemeFromDOM is a cheap attribute read, no need to memoize.
  const theme = getThemeFromDOM();
  const c = themeColors[theme];

  return (
    <>
      {/* Main Bottom Navigation */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[70] safe-area-pb"
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
            }}
          >
            {isMoreMenuOpen ? <X size={20} /> : <MoreHorizontal size={20} />}
            <span className="text-xs mt-1 font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Expandable More Menu */}
      <div
        className={`lg:hidden fixed bottom-16 left-0 right-0 z-[60] transition-all duration-300 ease-in-out ${
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
              style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' }}
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
