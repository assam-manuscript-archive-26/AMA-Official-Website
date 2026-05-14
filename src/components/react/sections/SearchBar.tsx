import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search manuscripts, artists, periods...',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-6 py-4 pl-12 pr-24 bg-surface-card border border-hairline rounded-lg text-ink placeholder:text-muted focus:border-primary focus:outline-none"
        />
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-muted hover:text-ink transition-colors"
          >
            <Filter size={20} />
          </button>
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                onSearch?.('');
              }}
              className="p-2 text-muted hover:text-ink transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>

      {showFilters && (
        <div className="mt-4 p-4 bg-surface-card rounded-lg border border-hairline">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm text-muted mb-2">Period</label>
              <select className="px-3 py-2 bg-canvas border border-hairline rounded-md text-ink text-sm">
                <option value="">All Periods</option>
                <option value="18th">18th Century</option>
                <option value="19th">19th Century</option>
                <option value="20th">20th Century</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Style</label>
              <select className="px-3 py-2 bg-canvas border border-hairline rounded-md text-ink text-sm">
                <option value="">All Styles</option>
                <option value="精品">精品 (Fine)</option>
                <option value="文">文 (Literary)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Satra</label>
              <select className="px-3 py-2 bg-canvas border border-hairline rounded-md text-ink text-sm">
                <option value="">All Satras</option>
                <option value="auniati">Auniati Satra</option>
                <option value="kamalabari">Kamalabari Satra</option>
                <option value="dakhinpat">Dakhinpat Satra</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}