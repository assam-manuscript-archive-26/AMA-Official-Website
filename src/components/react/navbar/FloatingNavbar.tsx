import React, { useState, useEffect } from 'react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(initialPath);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Floating Navbar - Matching Artifex structure */}
      <nav
        className={`
          fixed top-8 left-1/2 -translate-x-1/2 z-50
          w-[90vw] sm:w-[92%] max-w-7xl px-4 sm:px-6 py-3
          flex justify-between items-center rounded-full border-[3px] transition-all duration-300
          ${isScrolled
            ? 'bg-[#181715]/95 backdrop-blur-3xl border-[#181715]/30'
            : 'bg-[#181715]/80 backdrop-blur-3xl border-[#181715]/20'
          }
        `}
      >
        {/* Left - Text Logo */}
        <a
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity z-[60]"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: '13px',
            fontWeight: 600,
            color: '#faf9f5',
            letterSpacing: '0.04em',
            textDecoration: 'none',
            lineHeight: 1.3,
            maxWidth: '140px',
          }}
        >
          Assam Manuscript Archive
        </a>

        {/* Center - Nav Links (like Artifex) */}
        <ul className="hidden md:flex space-x-4">
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
      </nav>

      {/* Mobile Full-Screen Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#faf9f5]">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-[#e6dfd8]">
            <a href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <img
                src="/assets/blank.png"
                alt="blankLogo"
                className="h-8 w-auto rounded-full"
              />
              <span className="font-display text-lg text-[#141413]">Assamese Manuscript Archive</span>
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-[#141413]"
            >
              <X size={24} />
            </button>
          </div>

          {/* Primary Links */}
          <nav className="flex flex-col items-center gap-4 pt-12">
            {mobilePrimaryLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-6 py-3 rounded-full text-lg font-medium text-[#141413] hover:bg-[#efe9de] transition-colors w-[90%] justify-center"
              >
                {link.label}
              </a>
            ))}

            {/* More Toggle */}
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="flex items-center gap-3 px-6 py-3 rounded-full text-lg font-medium text-[#141413] hover:bg-[#efe9de] transition-colors w-[90%] justify-center"
            >
              More
              <ChevronDown
                size={20}
                className={`transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Secondary Links */}
            {isMoreMenuOpen && (
              <div className="flex flex-col gap-2 w-[90%] mt-2">
                {mobileSecondaryLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-6 py-3 rounded-full text-base font-medium text-[#6c6a64] hover:bg-[#efe9de] transition-colors justify-center"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </nav>

          {/* Theme Toggle */}
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <ThemeToggle />
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav initialPath={activeLink} />
    </>
  );
}