import React, { useState, useRef, useEffect } from 'react';
import { Search, QrCode, X } from 'lucide-react';

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
  { id: '6', name: '18th Century Manuscripts', category: 'Period' },
  { id: '7', name: 'Bhakti Movement Art', category: 'Style' },
  { id: '8', name: 'Visitor Guidelines', category: 'Visit' },
];

export default function FloatingSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

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
    <div ref={searchRef} className="relative w-[90%] md:w-[80%] max-w-[700px] mx-auto mt-6 z-50">
      <form onSubmit={handleSearch}>
        <div className="relative flex items-center h-[50px] md:h-[60px]">
          {/* Search Icon */}
          <div className="absolute left-4 text-white">
            <Search size={20} />
          </div>

          {/* Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collections, artifacts, events..."
            className="w-full h-full pl-12 pr-10 md:pr-36 bg-[#181715]/90 backdrop-blur-lg rounded-full text-white placeholder-white/60 border border-[#181715]/30 focus:outline-none focus:border-[#cc785c] transition-colors"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-24 md:right-32 text-white/60 hover:text-white"
            >
              <X size={18} />
            </button>
          )}

          {/* QR Scanner Button - Hidden on mobile */}
          <a
            href="/qrscanner"
            className="hidden sm:flex absolute right-12 md:right-16 items-center gap-1.5 text-white/80 hover:text-[#cc785c] transition-colors"
          >
            <QrCode size={18} />
            <span className="hidden lg:inline text-sm">Scan</span>
          </a>

          {/* Search Button - Hidden on md */}
          <button
            type="submit"
            className="hidden md:flex absolute right-2 items-center gap-1.5 bg-[#cc785c] hover:bg-[#a9583e] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Custom Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#efe9de] rounded-lg shadow-xl max-h-[200px] overflow-y-auto z-50 border border-[#e6dfd8]">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-[#cc785c] hover:text-white transition-colors flex items-center justify-between group"
            >
              <span className="text-[#141413] group-hover:text-white font-medium">
                {suggestion.name}
              </span>
              <span className="text-xs text-[#6c6a64] group-hover:text-white/80">
                — {suggestion.category}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}