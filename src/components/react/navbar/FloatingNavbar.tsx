import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { X, ChevronDown } from 'lucide-react';
import ThemeToggle from '../theme-toggle/ThemeToggle';
import MobileBottomNav from './MobileBottomNav';

/**
 * Padding between the outermost nav content edge and the pill's inner border (px).
 * The pill border is 3px when scrolled, so total extra per side = PILL_GAP + 3.
 */
const PILL_GAP = 5;
const PILL_BORDER = 3;
const PILL_EXTRA = 2 * (PILL_GAP + PILL_BORDER); // 16px total

interface Props {
  initialPath?: string;
}

const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'COLLECTIONS', href: '/collections' },
  { label: 'EVENTS', href: '/events' },
  { label: 'RESOURCES', href: '/resources' },
  { label: 'VISIT', href: '/visit' },
  { label: 'FEEDBACK', href: '/feedback' },
  { label: 'ABOUT US', href: '/about' },
];

const mobilePrimaryLinks = [
  { label: 'Home', href: '/' },
  { label: 'Collections', href: '/collections' },
  { label: 'Events', href: '/events' },
  { label: 'Feedback', href: '/feedback' },
];

const mobileSecondaryLinks = [
  { label: 'Resources', href: '/resources' },
  { label: 'Visit', href: '/visit' },
  { label: 'About Us', href: '/about' },
];

/**
 * Returns responsive sizing values based on the current viewport width.
 * Linearly interpolates between compact (1024px) and full (1920px) sizes.
 */
function getResponsiveSizes(width: number) {
  // Clamp the interpolation factor: 0 at 1024px, 1 at 1920px
  const t = Math.max(0, Math.min(1, (width - 1024) / (1920 - 1024)));

  // Helper: linear interpolation
  const lerp = (min: number, max: number) => min + t * (max - min);

  return {
    // Logo
    logoSize: lerp(28, 40),              // px — image dimensions
    logoGap: lerp(6, 12),                // px — gap between image & text
    logoFontSize: lerp(10, 13),          // px
    logoMaxWidth: lerp(90, 140),         // px

    // Nav items
    navFontSize: lerp(0.72, 1),          // rem — base (non-active) size
    navActiveFontSize: lerp(0.78, 1.05), // rem — active item size
    navPaddingX: lerp(4, 12),            // px
    navPaddingY: lerp(4, 8),             // px
    navGap: lerp(2, 16),                 // px — space between items
  };
}

export default function FloatingNavbar({ initialPath = '/' }: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [activeLink, setActiveLink] = useState(initialPath);
  const [viewportWidth, setViewportWidth] = useState(1920);
  const [navWidth, setNavWidth] = useState(0);
  const navRef = useRef<HTMLElement>(null);

  // ── Measure nav content width via ResizeObserver ──
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const measure = () => setNavWidth(nav.offsetWidth);
    measure(); // initial

    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 1024) {
        setIsScrolled(window.scrollY > 20);
      } else {
        setIsScrolled(false);
      }
    };
    
    const handleResize = () => {
      const w = window.innerWidth;
      const desktop = w >= 1024;
      setIsDesktop(desktop);
      setViewportWidth(w);
      if (!desktop) {
        setIsScrolled(false);
      } else {
        setIsScrolled(window.scrollY > 20);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Memoize responsive sizes so they only recompute when width changes
  const sizes = useMemo(() => getResponsiveSizes(viewportWidth), [viewportWidth]);

  // ── Pill width: derived from actual nav content width ──
  // When scrolled → shrink to exactly wrap the nav content + padding/border.
  // When un-scrolled → full viewport width (100%).
  // Both are pixel values so Motion interpolates in a single smooth step.
  const pillWidthScrolled = navWidth > 0 ? navWidth + PILL_EXTRA : viewportWidth;
  const pillWidthFull = viewportWidth;

  return (
    <>
      {/* Desktop Floating Navbar - Scroll Responsive */}
      <div className="fixed top-0 left-0 w-full z-50 flex justify-center py-3 pointer-events-none">
        {/* Animated Background Pill */}
        <motion.div
          initial={false}
          animate={{
            x: '-50%',
            width: isScrolled ? pillWidthScrolled : pillWidthFull,
            y: isScrolled ? 32 : 0,
            borderRadius: isScrolled ? '9999px' : '0px',
            borderTopWidth: isScrolled ? '3px' : '0px',
            borderLeftWidth: isScrolled ? '3px' : '0px',
            borderRightWidth: isScrolled ? '3px' : '0px',
            borderBottomWidth: isScrolled ? '3px' : '1px',
            backgroundColor: (!isDesktop || isScrolled) ? 'rgba(24, 23, 21, 0.95)' : 'rgba(24, 23, 21, 0.8)',
            borderColor: isScrolled ? 'rgba(24, 23, 21, 0.3)' : 'rgba(24, 23, 21, 0.2)',
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            borderRadius: {
              duration: isScrolled ? 0.6 : 0.15,
              ease: [0.22, 1, 0.36, 1]
            }
          }}
          className="absolute top-0 left-1/2 h-full backdrop-blur-3xl border-solid pointer-events-auto"
        />

        {/* Navbar Content - Fixed horizontally, animates vertically */}
        <motion.nav
          ref={navRef}
          initial={false}
          animate={{ y: isScrolled ? 32 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-[90vw] sm:w-[92%] max-w-7xl flex justify-between items-center px-4 sm:px-3 sm:pr-6 pointer-events-auto"
        >
          {/* Left - Image & Text Logo */}
          <a
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity z-[60]"
            style={{ gap: `${sizes.logoGap}px` }}
          >
            <img
              src="/assets/logo/logo.png"
              alt="Assam Manuscript Archive Logo"
              className="rounded-full object-cover flex-shrink-0"
              style={{
                height: `${sizes.logoSize}px`,
                width: `${sizes.logoSize}px`,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: `${sizes.logoFontSize}px`,
                fontWeight: 600,
                color: '#faf9f5',
                letterSpacing: '0.04em',
                lineHeight: 1.3,
                maxWidth: `${sizes.logoMaxWidth}px`,
              }}
            >
              Assamese Manuscript Archive
            </span>
          </a>

          {/* Center - Nav Links — visible only on lg+ (1024px) to avoid cramping */}
          <ul
            className="hidden lg:flex items-center"
            style={{ gap: `${sizes.navGap}px` }}
          >
            {navLinks.map((link) => {
              const isActive = activeLink === link.href;
              return (
                <li
                  key={link.href}
                  className={`relative group font-semibold font-sans transition-all whitespace-nowrap
                  ${isActive ? 'text-[var(--color-primary)]' : 'text-[#faf9f5] hover:text-[var(--color-primary)]'}`}
                  style={{
                    fontSize: isActive ? `${sizes.navActiveFontSize}rem` : `${sizes.navFontSize}rem`,
                  }}
                >
                  <a
                    href={link.href}
                    onClick={() => setActiveLink(link.href)}
                    style={{
                      padding: `${sizes.navPaddingY}px ${sizes.navPaddingX}px`,
                      display: 'inline-block',
                    }}
                  >
                    {link.label}
                  </a>
                  <span className={`absolute left-1/2 transform -translate-x-1/2 bottom-[-6px]
                  flex items-center gap-1 transition-opacity duration-300
                  ${isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                    <span className="w-1.5 h-1.5 bg-[#cc785c] rounded-full"></span>
                    <span className="w-6 h-1 bg-[#cc785c] rounded"></span>
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Right - Theme Toggle */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </motion.nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav initialPath={activeLink} />
    </>
  );
}