import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  BookOpen,
  FileText,
  Globe,
  Archive,
  Search,
  BookMarked,
  ScrollText,
  Database,
  FileQuestion
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  author?: string;
  source?: string;
  year?: string;
  url: string;
}

interface ResourcesGridProps {
  books: Resource[];
  journals: Resource[];
  digitalArchives: Resource[];
  articles: Resource[];
}

type Category = 'books' | 'journals' | 'digitalArchives' | 'articles';

const categoryConfig: Record<Category, {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  accentColor: string;
}> = {
  books: {
    label: 'Books',
    icon: BookOpen,
    description: 'Comprehensive scholarly books on Assamese manuscripts, painting traditions, and cultural heritage.',
    accentColor: '#cc785c'
  },
  journals: {
    label: 'Journals',
    icon: FileText,
    description: 'Peer-reviewed research papers and academic articles from leading journals.',
    accentColor: '#5db8a6'
  },
  digitalArchives: {
    label: 'Digital Archives',
    icon: Database,
    description: 'Online repositories, digital collections, and accessible archives.',
    accentColor: '#c9a227'
  },
  articles: {
    label: 'Articles',
    icon: Archive,
    description: 'Feature articles, essays, and in-depth analyses from various publications.',
    accentColor: '#8b5cf6'
  }
};

const iconMap: Record<Category, React.ComponentType<{ size?: number; className?: string }>> = {
  books: BookMarked,
  journals: ScrollText,
  digitalArchives: Globe,
  articles: FileQuestion
};

export default function ResourcesGrid({ books, journals, digitalArchives, articles }: ResourcesGridProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('books');
  const [searchQuery, setSearchQuery] = useState('');

  const resourcesByCategory: Record<Category, Resource[]> = {
    books,
    journals,
    digitalArchives,
    articles
  };

  const currentResources = useMemo(() => {
    const resources = resourcesByCategory[activeCategory];
    if (!searchQuery.trim()) return resources;

    const query = searchQuery.toLowerCase();
    return resources.filter(
      resource =>
        resource.title.toLowerCase().includes(query) ||
        resource.author?.toLowerCase().includes(query) ||
        resource.source?.toLowerCase().includes(query)
    );
  }, [activeCategory, searchQuery]);

  const categoryCounts: Record<Category, number> = {
    books: books.length,
    journals: journals.length,
    digitalArchives: digitalArchives.length,
    articles: articles.length
  };

  const getCategoryIcon = (category: Category) => {
    const Icon = iconMap[category];
    return Icon;
  };

  return (
    <div className="w-full">
      {/* Search and Filter Bar */}
      <div className="mb-10">
        <div className="relative max-w-md mx-auto">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
            size={20}
            style={{ color: 'var(--color-muted)' }}
          />
          <input
            type="text"
            placeholder={`Search ${categoryConfig[activeCategory].label.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl transition-all"
            style={{
              backgroundColor: 'var(--color-surface-card)',
              border: '1px solid var(--color-hairline)',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(204, 120, 92, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-hairline)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Category Tabs - Pill Style */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {(Object.keys(categoryConfig) as Category[]).map((category) => {
          const config = categoryConfig[category];
          const Icon = config.icon;
          const isActive = activeCategory === category;
          const count = categoryCounts[category];

          return (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setSearchQuery('');
              }}
              className={`
                group relative flex items-center gap-3 px-6 py-3.5 rounded-full font-medium
                transition-all duration-300 ease-out
                ${isActive
                  ? 'text-[var(--color-on-primary)] shadow-lg'
                  : 'text-[var(--color-body)] hover:text-[var(--color-ink)]'
                }
              `}
              style={{
                backgroundColor: isActive
                  ? `linear-gradient(135deg, ${config.accentColor}, ${config.accentColor}dd)`
                  : 'var(--color-surface-card)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 500,
                border: isActive ? 'none' : '1px solid var(--color-hairline)',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isActive ? `0 8px 25px ${config.accentColor}40` : 'none'
              }}
            >
              <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
              <span>{config.label}</span>
              <span
                className={`
                  px-2 py-0.5 text-xs rounded-full font-semibold
                  ${isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[var(--color-surface-soft)] text-[var(--color-muted)]'
                  }
                `}
              >
                {count}
              </span>

              {/* Hover Glow Effect */}
              {!isActive && (
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10"
                  style={{
                    background: `linear-gradient(135deg, ${config.accentColor}20, transparent)`,
                    filter: 'blur(8px)'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Category Description */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-10"
      >
        <p
          className="max-w-2xl mx-auto"
          style={{
            color: 'var(--color-body)',
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            lineHeight: 1.7
          }}
        >
          {categoryConfig[activeCategory].description}
        </p>
      </motion.div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6 px-2">
        <span
          style={{
            color: 'var(--color-muted)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px'
          }}
        >
          Showing {currentResources.length} of {resourcesByCategory[activeCategory].length} resources
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-sm font-medium hover:underline"
            style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}
          >
            Clear search
          </button>
        )}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {currentResources.map((resource, index) => {
            const CategoryIcon = getCategoryIcon(activeCategory);
            const config = categoryConfig[activeCategory];

            return (
              <motion.article
                key={resource.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 100,
                  damping: 15
                }}
                className="group relative overflow-hidden cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-hairline)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
                  e.currentTarget.style.borderColor = config.accentColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--color-hairline)';
                }}
              >
                {/* Left Accent Bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2"
                  style={{ backgroundColor: config.accentColor }}
                />

                {/* Card Content */}
                <div className="p-6 pl-7">
                  {/* Category Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="p-2.5 rounded-lg"
                      style={{
                        backgroundColor: `${config.accentColor}15`,
                        color: config.accentColor
                      }}
                    >
                      <CategoryIcon size={20} />
                    </div>
                    {resource.year && (
                      <span
                        className="px-3 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: 'var(--color-surface-soft)',
                          color: 'var(--color-muted)',
                          fontFamily: 'var(--font-body)'
                        }}
                      >
                        {resource.year}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    className="mb-3 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 500,
                      fontSize: '18px',
                      lineHeight: 1.4,
                      color: 'var(--color-ink)'
                    }}
                  >
                    {resource.title}
                  </h3>

                  {/* Author */}
                  {resource.author && (
                    <p
                      className="mb-1"
                      style={{
                        color: 'var(--color-body-strong)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        fontWeight: 500
                      }}
                    >
                      {resource.author}
                    </p>
                  )}

                  {/* Source */}
                  {resource.source && (
                    <p
                      className="mb-4 line-clamp-1"
                      style={{
                        color: 'var(--color-muted)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px'
                      }}
                    >
                      {resource.source}
                    </p>
                  )}

                  {/* External Link */}
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium mt-4 transition-all group/link"
                    style={{
                      color: config.accentColor,
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    <ExternalLink
                      size={16}
                      className="group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5 transition-transform"
                    />
                    <span>Access Resource</span>
                  </a>
                </div>

                {/* Decorative Corner */}
                <div
                  className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, transparent 50%, ${config.accentColor}10 50%)`
                  }}
                />
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {currentResources.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
          style={{
            backgroundColor: 'var(--color-surface-soft)',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{ backgroundColor: 'var(--color-surface-card)' }}
          >
            <Search size={32} style={{ color: 'var(--color-muted)' }} />
          </div>
          <h3
            className="mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: '24px',
              color: 'var(--color-ink)'
            }}
          >
            No resources found
          </h3>
          <p
            className="max-w-md mx-auto"
            style={{
              color: 'var(--color-muted)',
              fontFamily: 'var(--font-body)',
              fontSize: '15px'
            }}
          >
            Try adjusting your search or browse all resources in this category.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-6 px-6 py-3 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              fontFamily: 'var(--font-body)'
            }}
          >
            Clear Search
          </button>
        </motion.div>
      )}

      {/* All Categories Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16"
      >
        <div
          className="p-8 rounded-2xl"
          style={{
            backgroundColor: 'var(--color-surface-soft)',
            border: '1px solid var(--color-hairline)'
          }}
        >
          <h3
            className="text-center mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: '24px',
              color: 'var(--color-ink)'
            }}
          >
            Browse All Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.keys(categoryConfig) as Category[]).map((category) => {
              const config = categoryConfig[category];
              const Icon = config.icon;
              const count = categoryCounts[category];
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setSearchQuery('');
                  }}
                  className={`
                    p-4 rounded-xl text-left transition-all
                    ${isActive
                      ? 'ring-2 ring-offset-2'
                      : 'hover:bg-[var(--color-surface-card)]'
                    }
                  `}
                  style={{
                    backgroundColor: isActive ? 'var(--color-surface-card)' : 'transparent',
                    ringColor: config.accentColor
                  }}
                >
                  <div
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3"
                    style={{
                      backgroundColor: `${config.accentColor}20`,
                      color: config.accentColor
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <p
                    className="font-medium mb-1"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-ink)',
                      fontSize: '14px'
                    }}
                  >
                    {config.label}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-muted)',
                      fontSize: '12px'
                    }}
                  >
                    {count} resources
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}