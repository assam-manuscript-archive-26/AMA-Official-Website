import { useState, useEffect, useCallback, useRef } from 'react';
import { Expand } from '@theme-toggles/react/dist/index.js';
import '@theme-toggles/react/css/Expand.css';

/**
 * ThemeToggle — Animated theme toggle for navbar
 *
 * Uses the Expand component from @theme-toggles/react for a smooth
 * sun ↔ moon icon morph animation, combined with the View Transition API
 * for a circular clip-path page reveal when switching themes.
 *
 * Modes: 'light' | 'dark'
 * Persists to localStorage('ama-theme') for cross-tab + cross-route sync.
 */

const STORAGE_KEY = 'ama-theme';

interface ThemeToggleProps {
  /** Duration of the circular clip-path reveal animation (ms) */
  revealDuration?: number;
  /** Duration of the sun/moon icon morph animation (ms) */
  iconDuration?: number;
}

export default function ThemeToggle({
  revealDuration = 600,
  iconDuration = 750,
}: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Function to sync React state with DOM/Storage
  const syncTheme = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const domTheme = document.documentElement.getAttribute('data-theme');

    // Resolve what the theme should be
    let resolved: 'light' | 'dark' = 'light'; // fallback to light

    if (stored === 'light' || stored === 'dark') {
      resolved = stored;
    } else if (domTheme === 'light' || domTheme === 'dark') {
      resolved = domTheme;
    }

    // Update state and ensure DOM matches
    setIsDark(resolved === 'dark');
    document.documentElement.setAttribute('data-theme', resolved);
    localStorage.setItem(STORAGE_KEY, resolved);
  }, []);

  // Initialize from localStorage or current data-theme attribute
  useEffect(() => {
    syncTheme();
    setMounted(true);
  }, [syncTheme]);

  // Sync when storage changes (cross-tab) or via Astro's View Transitions (cross-page root swap)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) syncTheme();
    };

    const handleAstroSwap = () => {
      // Re-initialize state based on newly swapped document root
      syncTheme();
    };

    window.addEventListener('storage', handleStorage);
    document.addEventListener('astro:after-swap', handleAstroSwap);

    return () => {
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('astro:after-swap', handleAstroSwap);
    };
  }, [syncTheme]);

  const handleToggle = useCallback(() => {
    const container = buttonRef.current;
    if (!container) return;

    // Calculate circle geometry for the reveal animation
    const rect = container.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    );

    const newIsDark = !isDark;
    const newTheme = newIsDark ? 'dark' : 'light';

    // Flash tooltip
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 1500);

    // If View Transition API is not supported, apply immediately
    if (typeof document.startViewTransition !== 'function') {
      setIsDark(newIsDark);
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem(STORAGE_KEY, newTheme);
      // Dispatch custom event for other components to react
      document.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: newTheme } }));
      return;
    }

    // Use View Transition API for smooth circular reveal
    // The key is to apply theme changes inside the callback
    const transition = document.startViewTransition(() => {
      setIsDark(newIsDark);
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem(STORAGE_KEY, newTheme);
      // Dispatch custom event for other components to react
      document.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: newTheme } }));
    });

    // Animate the circular clip-path reveal
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: revealDuration,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  }, [isDark, revealDuration]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <>
      {/* Tooltip */}
      <div
        style={{
          position: 'absolute',
          bottom: '100%',
          right: '0',
          marginBottom: '0.5rem',
          background: isDark ? 'oklch(0.96 0.01 260)' : 'oklch(0.12 0 0)',
          color: isDark ? 'oklch(0.12 0 0)' : 'oklch(0.96 0.01 260)',
          padding: '0.4rem 0.85rem',
          borderRadius: '2px',
          fontSize: '0.6875rem',
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 10000,
          opacity: showTooltip ? 1 : 0,
          transform: showTooltip ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
        aria-hidden="true"
      >
        {isDark ? 'Dark mode' : 'Light mode'}
      </div>

      {/* Toggle Button Container */}
      <div
        ref={buttonRef}
        style={{
          position: 'relative',
        }}
      >
        {/* @ts-ignore — React 19 types incompatibility with @theme-toggles/react */}
        <Expand
          toggled={isDark}
          toggle={handleToggle as any}
          duration={iconDuration}
          aria-label={`Current: ${isDark ? 'Dark mode' : 'Light mode'}. Click to switch theme.`}
          title={isDark ? 'Dark mode' : 'Light mode'}
          style={{
            width: '24px',
            height: '24px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            color: isDark ? '#cc785c' : '#cc785c',
            transition: 'transform 0.2s ease',
            WebkitTapHighlightColor: 'transparent',
            fontSize: '40px',
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = 'scale(1.15)';
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
      </div>
    </>
  );
}