import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, ChevronDown } from 'lucide-react';
import ThemeToggle from '../theme-toggle/ThemeToggle';
import MobileBottomNav from './MobileBottomNav';

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

export default function FloatingNavbar({ initialPath = '/' }: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [activeLink, setActiveLink] = useState(initialPath);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 1024) {
        setIsScrolled(window.scrollY > 20);
      } else {
        setIsScrolled(false);
      }
    };
    
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
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

  return (
    <>
      {/* Desktop Floating Navbar - Scroll Responsive */}
      <div className="fixed top-0 left-0 w-full z-50 flex justify-center py-3 pointer-events-none">
        {/* Animated Background Pill */}
        <motion.div
          initial={false}
          animate={{
            x: '-50%',
            width: isScrolled ? 'min(67%, 1280px)' : 'min(100%, 9999px)',
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
          initial={false}
          animate={{ y: isScrolled ? 32 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-[90vw] sm:w-[92%] max-w-7xl flex justify-between items-center px-4 sm:px-3 sm:pr-6 pointer-events-auto"
        >
          {/* Left - Image & Text Logo */}
          <a
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity z-[60]"
          >
            <img
              src="/assets/logo/logo.png"
              alt="Assam Manuscript Archive Logo"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: '13px',
                fontWeight: 600,
                color: '#faf9f5',
                letterSpacing: '0.04em',
                lineHeight: 1.3,
                maxWidth: '140px',
              }}
            >
              Assamese Manuscript Archive
            </span>
          </a>

          {/* Center - Nav Links (like Artifex) */}
          <ul className="hidden md:flex space-x-4 pr-18">
            {navLinks.map((link) => {
              const isActive = activeLink === link.href;
              return (
                <li
                  key={link.href}
                  className={`relative group font-semibold font-sans transition-all
                  ${isActive ? 'text-[var(--color-primary)] text-[1.05rem]' : 'text-[#faf9f5] hover:text-[var(--color-primary)]'}`}
                >
                  <a href={link.href} className="px-3 py-2" onClick={() => setActiveLink(link.href)}>
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

          {/* Right - Theme Toggle (replacing Login button) */}
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