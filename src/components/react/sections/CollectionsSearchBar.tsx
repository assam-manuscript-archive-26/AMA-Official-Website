"use client";

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { ScanQrCode, X } from "lucide-react";
import { motion, useAnimation } from "framer-motion";

// Animated Search Icon (from LandingHero)
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

interface CollectionItem {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  imageUrl: string;
}

interface CollectionsSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  showPrompt?: boolean;
  collectionsData?: CollectionItem[];
}

const CollectionsSearchBar: React.FC<CollectionsSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  showPrompt = false,
  collectionsData = [],
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchIconRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setFilteredSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update searchQuery and recompute suggestions
  const handleInputChange = (value: string) => {
    setSearchQuery(value);

    if (!value.trim()) {
      setFilteredSuggestions([]);
      return;
    }

    // Filter logic: match name, category, or any keyword (case-insensitive)
    const matches = collectionsData.filter((item) => {
      const query = value.toLowerCase();
      if (item.name.toLowerCase().includes(query)) return true;
      if (item.category.toLowerCase().includes(query)) return true;
      for (const kw of item.keywords || []) {
        if (kw.toLowerCase().includes(query)) return true;
      }
      return false;
    });

    // Map each matched item to a display string: "Name — Category"
    const suggestions = Array.from(
      new Set(
        matches.flatMap((item) => [item.name, item.category])
      )
    );

    // Keep only up to 5 suggestions
    setFilteredSuggestions(suggestions.slice(0, 5));
  };

  // When Enter is pressed in the input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // When the user clicks a suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setFilteredSuggestions([]);
    window.location.href = `/collections?search=${encodeURIComponent(suggestion)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div ref={searchRef} className="relative w-[90%] md:w-[80%] max-w-[700px] overflow-visible z-50 mx-auto mt-6">
      <form onSubmit={handleSubmit}>
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
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for paintings, manuscripts & more..."
            className="w-full h-full pl-14 pr-10 md:pr-36 bg-transparent text-[var(--color-primary)] placeholder-[var(--color-primary)] border-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-full"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-24 md:right-32 text-[var(--color-primary)]/60 hover:text-[var(--color-primary)] md:pr-10"
            >
              <X size={18} />
            </button>
          )}

          {/* QR Scanner Button */}
          <a
            href="/qrscanner"
            className="hidden sm:flex absolute md:right-16 items-center gap-1.5 text-[var(--color-primary)] hover:text-[var(--color-primary-active)] transition-colors pr-12"
          >
            <ScanQrCode size={20} />
          </a>

          {/* Search Button */}
          <button
            type="submit"
            onClick={handleSearch}
            className="hidden md:flex absolute right-4 items-center gap-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-active)] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Search Suggestions (Scrollable) */}
      {filteredSuggestions.length > 0 && (
        <ul
          className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-bg-elevated)] rounded-lg shadow-xl max-h-[250px] max-w-[600px] mx-auto overflow-hidden z-[9999] border border-[var(--color-border)]"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="w-full px-4 py-3 cursor-pointer transition text-sm hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-between group"
              style={{ color: "var(--color-text)" }}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="group-hover:text-white font-medium">
                {suggestion}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CollectionsSearchBar;