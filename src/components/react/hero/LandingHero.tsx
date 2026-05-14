import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { ScanQrCode, X } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

// Animated Search Icon (from Artifex)
const SearchIconHandle = forwardRef<{ startAnimation: () => void; stopAnimation: () => void }, { className?: string; size?: number }>(
  ({ className, size = 20 }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start('animate'),
        stopAnimation: () => controls.start('normal'),
      };
    });

    return (
      <div className={className}>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            normal: { x: 0, y: 0 },
            animate: {
              x: [0, 0, -3, 0],
              y: [0, -4, 0, 0],
            },
          }}
          transition={{
            duration: 1,
            bounce: 0.3,
          }}
          animate={controls}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </motion.svg>
      </div>
    );
  }
);
SearchIconHandle.displayName = 'SearchIcon';

interface SearchSuggestion {
  id: string;
  name: string;
  category: string;
}

const mockSuggestions: SearchSuggestion[] = [
  { id: '1', name: 'Manuscript Paintings', category: 'Collections' },
  { id: '2', name: 'Religious Artifacts', category: 'Collections' },
  { id: '3', name: 'Satra Textiles', category: 'Collections' },
  { id: '4', name: 'Annual Festival 2026', category: 'Events' },
  { id: '5', name: 'Digital Archive Launch', category: 'News' },
];

export default function LandingHero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchIconRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockSuggestions
        .filter(
          (suggestion) =>
            suggestion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            suggestion.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    window.location.href = `/search?q=${encodeURIComponent(suggestion.name)}`;
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="relative overflow-visible">
      <section className="relative w-full h-[40vh] min-h-[300px] overflow-visible">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/bg3.jpg"
        >
          <source src="https://uploads.backendservices.in/storage/internship/artifex/videos/177877450165448.mp4" type="video/mp4" />

          {/* Fallback to image if video fails */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#5db8a6] via-[#cc785c] to-[#181715]" />
        </video>

        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 lg:py-60">

          {/* Headline */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight md:leading-[1.1] mb-8 text-center max-w-5xl" style={{ color: 'var(--hero-headline-color, white)', textShadow: '0 4px 20px rgba(0,0,0,0.4), 0 8px 40px rgba(0,0,0,0.2)' }}>
            Discover the Heritage of Assamese Manuscript Archive
          </h1>

          {/* Search Bar - On top of video */}
          <div ref={searchRef} className="relative w-[90%] md:w-[80%] max-w-[700px] overflow-visible z-50">
            <form onSubmit={handleSearch}>
              <div
                className="relative flex items-center h-[44px] md:h-[60px] bg-[var(--color-bg-elevated)] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4),0_8px_40px_rgba(0,0,0,0.2)]"
                onMouseEnter={() => searchIconRef.current?.startAnimation()}
                onMouseLeave={() => searchIconRef.current?.stopAnimation()}
              >
                {/* Animated Search Icon */}
                <div className="absolute left-6 text-[var(--color-primary)]">
                  <SearchIconHandle ref={searchIconRef} size={20} />
                </div>

                {/* Input */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search manuscripts and more..."
                  className="w-full h-full pl-14 pr-10 md:pr-36 bg-transparent text-[var(--color-primary)] placeholder-[var(--color-primary)] border-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-full"
                />

                {/* Clear Button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-24 md:right-32 text-[var(--color-primary)]/60 hover:text-[var(--color-primary)] md:pr-10"
                  >
                    <X size={18} />
                  </button>
                )}

                {/* QR Scanner Button - Hidden on mobile */}
                <a
                  href="/qrscanner"
                  className="hidden sm:flex absolute md:right-16 items-center gap-1.5 text-[var(--color-primary)] hover:text-[var(--color-primary-active)] transition-colors pr-12"
                >
                  <ScanQrCode size={20} className="transition-colors group-hover:text-amber-500" />
                </a>

                {/* Search Button - Hidden on md */}
                <button
                  type="submit"
                  className="hidden md:flex absolute right-4 items-center gap-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-active)] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Custom Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-bg-elevated)] rounded-lg shadow-xl max-h-[250px] max-w-[600px] mx-auto overflow-hidden z-[9999] border border-[var(--color-border)]">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-[var(--color-primary)] hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span className="text-[var(--color-text)] group-hover:text-white font-medium">
                      {suggestion.name}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)] group-hover:text-white/80">
                      — {suggestion.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}