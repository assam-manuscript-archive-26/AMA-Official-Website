import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Plus, X, Search, Tag } from 'lucide-react';

interface CreatableCategorySelectProps {
  value: string;
  onChange: (category: string) => void;
  categories: string[];
  placeholder?: string;
  disabled?: boolean;
}

export default function CreatableCategorySelect({
  value,
  onChange,
  categories,
  placeholder = 'Select or create a category...',
  disabled = false,
}: CreatableCategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside on desktop
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [isOpen]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((cat) => cat.toLowerCase().includes(query));
  }, [categories, searchQuery]);

  // Check if typed query is an exact match for any existing category
  const isExactMatch = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return false;
    return categories.some((cat) => cat.toLowerCase() === query);
  }, [categories, searchQuery]);

  const handleSelect = (category: string) => {
    onChange(category);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleCreateNew = (customCat: string) => {
    const trimmed = customCat.trim();
    if (!trimmed) return;
    onChange(trimmed);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = searchQuery.trim();
      if (!trimmed) return;

      if (!isExactMatch) {
        handleCreateNew(trimmed);
      } else if (filteredCategories.length > 0) {
        handleSelect(filteredCategories[0]);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`cat-select-wrapper ${isOpen ? 'cat-select-wrapper--open' : ''}`}
    >
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          className="cat-select-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Trigger Button */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        className={`cat-select-trigger ${disabled ? 'cat-select-trigger--disabled' : ''} ${
          isOpen ? 'cat-select-trigger--active' : ''
        }`}
      >
        <div className="cat-select-trigger-content">
          <Tag size={15} className="cat-select-trigger-icon" />
          {value ? (
            <span className="cat-select-value-text">{value}</span>
          ) : (
            <span className="cat-select-placeholder-text">{placeholder}</span>
          )}
        </div>

        <div className="cat-select-actions">
          {value && (
            <button
              type="button"
              className="cat-select-clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              title="Clear category"
              aria-label="Clear selected category"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown
            size={16}
            className={`cat-select-chevron ${isOpen ? 'cat-select-chevron--open' : ''}`}
          />
        </div>
      </div>

      {/* Elevated Dropdown Menu / Mobile Bottom Sheet */}
      {isOpen && (
        <div className="cat-select-dropdown" role="listbox">
          {/* Mobile Sheet Top Bar */}
          <div className="cat-select-mobile-header">
            <div className="cat-select-mobile-pill" />
            <div className="cat-select-mobile-title-row">
              <span className="cat-select-mobile-title">Choose or Create Category</span>
              <button
                type="button"
                className="cat-select-mobile-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Search / Create Input inside Menu */}
          <div className="cat-select-search-box">
            <Search size={16} className="cat-select-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search or type new category..."
              className="cat-select-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="cat-select-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search input"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Creatable Action Button if Query is New */}
          {searchQuery.trim() && !isExactMatch && (
            <div className="cat-select-create-action-wrap">
              <button
                type="button"
                className="cat-select-create-btn"
                onClick={() => handleCreateNew(searchQuery.trim())}
              >
                <div className="cat-select-create-icon-wrap">
                  <Plus size={16} />
                </div>
                <div className="cat-select-create-text-wrap">
                  <span className="cat-select-create-label">Create new category:</span>
                  <strong className="cat-select-create-name">"{searchQuery.trim()}"</strong>
                </div>
              </button>
            </div>
          )}

          {/* Options List */}
          <div className="cat-select-list">
            <div className="cat-select-list-header">
              <span>Existing Categories ({filteredCategories.length})</span>
            </div>

            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => {
                const isSelected = value === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(cat)}
                    className={`cat-select-option ${isSelected ? 'cat-select-option--selected' : ''}`}
                  >
                    <span className="cat-select-option-text">{cat}</span>
                    {isSelected && (
                      <Check size={16} className="cat-select-option-check" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="cat-select-empty">
                {!searchQuery.trim() ? (
                  <span>No categories available yet. Type above to create one.</span>
                ) : (
                  <span>No existing category matches "{searchQuery}". Tap "Create" above.</span>
                )}
              </div>
            )}
          </div>

          {/* Footer tip */}
          <div className="cat-select-footer">
            <span>Type a name and press <strong>Enter</strong> to create.</span>
          </div>
        </div>
      )}

      <style>{`
        .cat-select-wrapper {
          position: relative;
          width: 100%;
          font-family: var(--font-body, system-ui, sans-serif);
        }

        .cat-select-wrapper--open {
          z-index: 999;
        }

        /* ── Backdrop for Mobile ──────────────────────── */
        .cat-select-backdrop {
          display: none;
        }

        @media (max-width: 640px) {
          .cat-select-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.72);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            z-index: 999998;
            animation: catBackdropIn 0.2s ease-out;
          }

          @keyframes catBackdropIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        }

        /* ── Trigger Input Button ──────────────────────── */
        .cat-select-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          min-height: 42px;
          padding: 8px 12px;
          background: var(--admin-input-bg, #282724);
          border: 1px solid var(--admin-input-border, #3a3935);
          border-radius: var(--radius-md, 8px);
          cursor: pointer;
          user-select: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
          outline: none;
          box-sizing: border-box;
        }

        @media (max-width: 640px) {
          .cat-select-trigger {
            min-height: 44px;
            padding: 10px 12px;
          }
        }

        .cat-select-trigger:hover {
          border-color: var(--admin-border-strong, #52525b);
        }

        .cat-select-trigger:focus-visible,
        .cat-select-trigger--active {
          border-color: var(--color-primary, #cc785c) !important;
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary, #cc785c) 25%, transparent);
        }

        .cat-select-trigger--disabled {
          opacity: 0.6;
          cursor: not-allowed;
          pointer-events: none;
        }

        .cat-select-trigger-content {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
          flex: 1;
        }

        .cat-select-trigger-icon {
          color: var(--color-primary, #cc785c);
          flex-shrink: 0;
        }

        .cat-select-value-text {
          font-size: 13px;
          font-weight: 600;
          color: var(--admin-text, #faf9f5) !important;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cat-select-placeholder-text {
          font-size: 13px;
          color: var(--admin-text-muted, #8e8c85);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cat-select-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          margin-left: 8px;
        }

        .cat-select-clear-btn {
          background: none;
          border: none;
          color: var(--admin-text-muted, #8e8c85);
          cursor: pointer;
          padding: 3px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s ease, background-color 0.15s ease;
        }

        .cat-select-clear-btn:hover {
          color: var(--admin-text, #faf9f5);
          background: rgba(255, 255, 255, 0.1);
        }

        .cat-select-chevron {
          color: var(--admin-text-soft, #c2c0b6);
          transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
        }

        .cat-select-chevron--open {
          transform: rotate(180deg);
        }

        /* ── Dropdown / Mobile Sheet ─────────────────── */
        .cat-select-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          z-index: 99999 !important;
          background: var(--admin-surface, #1e1e1d) !important;
          border: 1px solid var(--admin-border-strong, #484742);
          border-radius: var(--radius-lg, 12px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(0, 0, 0, 0.35);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: catSelectMenuIn 0.16s ease-out;
          box-sizing: border-box;
          max-width: 100%;
        }

        @keyframes catSelectMenuIn {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .cat-select-mobile-header {
          display: none;
        }

        @media (max-width: 640px) {
          .cat-select-dropdown {
            position: fixed;
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            border-radius: 20px 20px 0 0;
            border-bottom: none;
            max-height: 80vh;
            padding-bottom: max(16px, env(safe-area-inset-bottom));
            z-index: 999999 !important;
            box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.75);
            animation: catSheetUp 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          }

          @keyframes catSheetUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }

          .cat-select-mobile-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px 16px 8px;
            border-bottom: 1px solid var(--admin-divider, rgba(255, 255, 255, 0.08));
          }

          .cat-select-mobile-pill {
            width: 36px;
            height: 4px;
            border-radius: 2px;
            background: var(--admin-border-strong, #52525b);
            margin-bottom: 10px;
          }

          .cat-select-mobile-title-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }

          .cat-select-mobile-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--admin-text, #faf9f5);
          }

          .cat-select-mobile-close {
            background: var(--admin-chip-bg, #282724);
            border: 1px solid var(--admin-chip-border, #3a3935);
            color: var(--admin-text-soft, #c2c0b6);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
        }

        /* ── Search Input ─────────────────────────────── */
        .cat-select-search-box {
          position: relative;
          display: flex;
          align-items: center;
          padding: 10px 12px;
          border-bottom: 1px solid var(--admin-divider, rgba(255, 255, 255, 0.08));
          background: var(--admin-input-bg, #282724);
        }

        .cat-select-search-icon {
          position: absolute;
          left: 20px;
          color: var(--color-primary, #cc785c);
          pointer-events: none;
        }

        .cat-select-search-input {
          width: 100%;
          height: 38px;
          padding: 8px 32px 8px 34px;
          background: var(--admin-surface, #1e1e1d) !important;
          border: 1px solid var(--admin-input-border, #3a3935);
          border-radius: var(--radius-sm, 6px);
          color: var(--admin-text, #faf9f5) !important;
          font-family: inherit;
          font-size: 13px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.15s ease;
        }

        .cat-select-search-input:focus {
          border-color: var(--color-primary, #cc785c);
        }

        .cat-select-search-input::placeholder {
          color: var(--admin-text-muted, #8e8c85);
        }

        .cat-select-search-clear {
          position: absolute;
          right: 20px;
          background: none;
          border: none;
          color: var(--admin-text-muted, #8e8c85);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3px;
        }

        .cat-select-search-clear:hover {
          color: var(--admin-text, #faf9f5);
        }

        /* ── Creatable Action Item ────────────────────── */
        .cat-select-create-action-wrap {
          padding: 8px 10px;
          border-bottom: 1px solid var(--admin-divider, rgba(255, 255, 255, 0.08));
          background: color-mix(in srgb, var(--color-primary, #cc785c) 10%, var(--admin-surface, #1e1e1d));
        }

        .cat-select-create-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: none;
          border: 1px dashed var(--color-primary, #cc785c);
          border-radius: var(--radius-md, 8px);
          cursor: pointer;
          text-align: left;
          transition: background-color 0.15s ease, transform 0.1s ease;
          box-sizing: border-box;
        }

        .cat-select-create-btn:hover,
        .cat-select-create-btn:active {
          background: var(--color-primary, #cc785c);
        }

        .cat-select-create-icon-wrap {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: color-mix(in srgb, var(--color-primary, #cc785c) 25%, transparent);
          color: var(--color-primary, #cc785c);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cat-select-create-btn:hover .cat-select-create-icon-wrap,
        .cat-select-create-btn:active .cat-select-create-icon-wrap {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .cat-select-create-text-wrap {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }

        .cat-select-create-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--color-primary, #cc785c);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .cat-select-create-btn:hover .cat-select-create-label,
        .cat-select-create-btn:active .cat-select-create-label {
          color: rgba(255, 255, 255, 0.9);
        }

        .cat-select-create-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--admin-text, #faf9f5) !important;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cat-select-create-btn:hover .cat-select-create-name,
        .cat-select-create-btn:active .cat-select-create-name {
          color: #ffffff !important;
        }

        /* ── Option List ──────────────────────────────── */
        .cat-select-list {
          max-height: 230px;
          overflow-y: auto;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          -webkit-overflow-scrolling: touch;
        }

        @media (max-width: 640px) {
          .cat-select-list {
            max-height: 40vh;
          }
        }

        .cat-select-list::-webkit-scrollbar {
          width: 6px;
        }

        .cat-select-list::-webkit-scrollbar-thumb {
          background: var(--admin-border, #343330);
          border-radius: 3px;
        }

        .cat-select-list-header {
          padding: 6px 10px 4px;
          font-size: 11px;
          font-weight: 600;
          color: var(--admin-text-muted, #8e8c85);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .cat-select-option {
          width: 100%;
          min-height: 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 12px;
          background: none;
          border: none;
          border-radius: var(--radius-sm, 6px);
          cursor: pointer;
          text-align: left;
          transition: background-color 0.12s ease, color 0.12s ease;
          box-sizing: border-box;
        }

        .cat-select-option:hover,
        .cat-select-option:active {
          background: color-mix(in srgb, var(--color-primary, #cc785c) 14%, var(--admin-surface, #1e1e1d));
        }

        .cat-select-option--selected {
          background: color-mix(in srgb, var(--color-primary, #cc785c) 20%, var(--admin-surface, #1e1e1d));
        }

        .cat-select-option-text {
          font-size: 13px;
          font-weight: 500;
          color: var(--admin-text, #faf9f5) !important;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cat-select-option--selected .cat-select-option-text {
          font-weight: 700;
          color: var(--color-primary, #cc785c) !important;
        }

        .cat-select-option-check {
          color: var(--color-primary, #cc785c);
          flex-shrink: 0;
        }

        .cat-select-empty {
          padding: 20px 12px;
          text-align: center;
          font-size: 12px;
          color: var(--admin-text-muted, #8e8c85);
        }

        /* ── Footer Tip ───────────────────────────────── */
        .cat-select-footer {
          padding: 8px 12px;
          background: var(--admin-input-bg, #282724);
          border-top: 1px solid var(--admin-divider, rgba(255, 255, 255, 0.08));
          font-size: 11px;
          color: var(--admin-text-muted, #8e8c85);
          display: flex;
          align-items: center;
        }

        .cat-select-footer strong {
          color: var(--color-primary, #cc785c);
        }
      `}</style>
    </div>
  );
}
