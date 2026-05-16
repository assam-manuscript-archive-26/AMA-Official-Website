"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Grid,
  List,
  Layers,
  ExternalLink,
  BookOpen,
  FileText,
  Globe,
  Archive,
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

interface ResourcesPageProps {
  books: Resource[];
  journals: Resource[];
  digitalArchives: Resource[];
  articles: Resource[];
}

type Category = 'all' | 'books' | 'journals' | 'digitalArchives' | 'articles';

const categoryConfig: Record<Category, {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
}> = {
  all: {
    label: 'All Resources',
    icon: Layers,
    description: 'Browse all scholarly resources across books, journals, digital archives, and articles.'
  },
  books: {
    label: 'Books',
    icon: BookMarked,
    description: 'Comprehensive scholarly books on Assamese manuscripts, painting traditions, and cultural heritage.'
  },
  journals: {
    label: 'Journals',
    icon: ScrollText,
    description: 'Peer-reviewed research papers and academic articles from leading journals.'
  },
  digitalArchives: {
    label: 'Digital Archives',
    icon: Database,
    description: 'Online repositories, digital collections, and accessible archives.'
  },
  articles: {
    label: 'Articles',
    icon: FileQuestion,
    description: 'Feature articles, essays, and in-depth analyses from various publications.'
  }
};

const iconMap: Record<Category, React.ComponentType<{ size?: number; className?: string }>> = {
  all: Layers,
  books: BookOpen,
  journals: FileText,
  digitalArchives: Globe,
  articles: Archive
};

export default function ResourcesPage({ books, journals, digitalArchives, articles }: ResourcesPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Handle responsive view mode
  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia('(max-width: 1023px)').matches) {
        setViewMode('list');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simulate loading state (will be replaced with real API fetch)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const resourcesByCategory: Record<Exclude<Category, 'all'>, Resource[]> = {
    books,
    journals,
    digitalArchives,
    articles
  };

  const allResources = useMemo(() => [
    ...books, ...journals, ...digitalArchives, ...articles
  ], [books, journals, digitalArchives, articles]);

  const currentResources = useMemo(() => {
    const resources = selectedCategory === 'all'
      ? allResources
      : resourcesByCategory[selectedCategory];
    if (!searchTerm.trim()) return resources;

    const query = searchTerm.toLowerCase();
    return resources.filter(
      resource =>
        resource.title.toLowerCase().includes(query) ||
        resource.author?.toLowerCase().includes(query) ||
        resource.source?.toLowerCase().includes(query)
    );
  }, [selectedCategory, searchTerm, books, journals, digitalArchives, articles, allResources]);

  const categoryCounts: Record<Category, number> = {
    all: books.length + journals.length + digitalArchives.length + articles.length,
    books: books.length,
    journals: journals.length,
    digitalArchives: digitalArchives.length,
    articles: articles.length
  };

  const categories = [
    { id: 'all' as Category, name: 'All Resources' },
    { id: 'books' as Category, name: 'Books' },
    { id: 'journals' as Category, name: 'Journals' },
    { id: 'digitalArchives' as Category, name: 'Digital Archives' },
    { id: 'articles' as Category, name: 'Articles' }
  ];

  const getCategoryIcon = (category: Category) => {
    const Icon = iconMap[category];
    return Icon;
  };

  return (
    <div
      className="w-full max-w-[1400px] mx-auto relative"
      style={{
        // backgroundColor: 'var(--color-canvas)',
        color: 'var(--color-ink)',
        fontFamily: 'var(--font-body)'
      }}
    >
      {/* Header - Matching Events/Collections Style */}
      <div
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-0 p-6 sm:p-8 pt-32 sm:pt-32"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-active))',
          borderRadius: '0 0 var(--radius-xl) var(--radius-xl)'
        }}
      >
        <div>
          <h2
            className="text-3xl mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              color: 'var(--color-on-primary)'
            }}
          >
            Resources
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-body)' }}>
            Scholarly resources on Assamese manuscripts, painting traditions, Sattra culture, and Vaishnavite heritage.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-3 order-first lg:order-none">
          <div
            className="flex p-1"
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius-lg)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <button
              onClick={() => setViewMode('list')}
              className="px-4 py-2 flex items-center gap-2 transition-colors lg:hidden"
              style={{
                borderRadius: 'var(--radius-md)',
                backgroundColor: viewMode === 'list' ? 'rgba(255,255,255,0.25)' : 'transparent',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '14px'
              }}
            >
              <List size={16} /> List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className="px-4 py-2 flex items-center gap-2 transition-colors"
              style={{
                borderRadius: 'var(--radius-md)',
                backgroundColor: viewMode === 'grid' ? 'rgba(255,255,255,0.25)' : 'transparent',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '14px'
              }}
            >
              <Grid size={16} /> Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="px-4 py-2 items-center gap-2 transition-colors hidden lg:flex"
              style={{
                borderRadius: 'var(--radius-md)',
                backgroundColor: viewMode === 'list' ? 'rgba(255,255,255,0.25)' : 'transparent',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '14px'
              }}
            >
              <List size={16} /> List
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 px-5 sm:px-8">
          <div
            className="w-12 h-12 rounded-full animate-spin"
            style={{
              borderTop: '3px solid var(--color-primary)',
              borderBottom: '3px solid var(--color-primary)',
              borderLeft: '3px solid transparent',
              borderRight: '3px solid transparent',
            }}
          />
          <p
            className="mt-4 text-lg"
            style={{
              color: 'var(--color-muted)',
              fontFamily: 'var(--font-body)'
            }}
          >
            Loading resources...
          </p>
        </div>
      )}

      {/* Content - Show when not loading */}
      {!isLoading && (
        <>
        <div className="flex flex-col lg:flex-row gap-4 my-8 px-5 sm:px-8">
          <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            size={20}
            style={{ color: 'var(--color-muted)' }}
          />
          <input
            type="text"
            placeholder={`Search ${categoryConfig[selectedCategory].label.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 transition-all"
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-hairline)',
              backgroundColor: 'var(--color-canvas)',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-hairline)'}
          />
        </div>

        <div className="flex gap-3 flex-wrap mb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setSearchTerm('');
              }}
              className="px-5 py-2.5 text-sm font-medium transition-all"
              style={{
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectedCategory === category.id ? 'var(--color-primary)' : 'var(--color-surface-card)',
                color: selectedCategory === category.id ? 'var(--color-on-primary)' : 'var(--color-ink)',
                fontFamily: 'var(--font-body)',
                border: selectedCategory === category.id ? 'none' : '1px solid var(--color-hairline)'
              }}
            >
              {category.name} ({categoryCounts[category.id]})
            </button>
          ))}
        </div>
      </div>

      {/* Category Description */}
      <div className="px-5 sm:px-8 mb-8">
        <p
          style={{
            color: 'var(--color-body)',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            lineHeight: 1.6
          }}
        >
          {categoryConfig[selectedCategory].description}
        </p>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6 px-5 sm:px-8">
        <span
          style={{
            color: 'var(--color-muted)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px'
          }}
        >
          Showing {currentResources.length} of {selectedCategory === 'all' ? allResources.length : resourcesByCategory[selectedCategory].length} resources
        </span>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-sm font-medium hover:underline"
            style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}
          >
            Clear search
          </button>
        )}
      </div>

      {/* Resources Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 px-5 sm:px-8 mb-12">
          {currentResources.map((resource, index) => {
            const CategoryIcon = getCategoryIcon(selectedCategory);

            return (
              <article
                key={resource.id}
                className="group cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-hairline)',
                  padding: 'var(--spacing-xl)',
                  paddingTop: 'var(--spacing-lg)',
                  paddingBottom: 'var(--spacing-lg)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--color-hairline)';
                }}
              >
                {/* Left Accent Bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2 rounded-l-lg"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />

                <div className="relative pl-5 pr-3">
                  {/* Category Icon */}
                  <div className="flex items-center justify-between mb-5 mt-1">
                    <div
                      className="p-3 rounded-lg"
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-on-primary)'
                      }}
                    >
                      <CategoryIcon size={22} />
                    </div>
                    {resource.year && (
                      <span
                        className="px-3 py-1.5 text-xs font-medium rounded-full"
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
                      fontSize: '19px',
                      lineHeight: 1.35,
                      color: 'var(--color-ink)'
                    }}
                  >
                    {resource.title}
                  </h3>

                  {/* Author */}
                  {resource.author && (
                    <p
                      className="mb-1.5"
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
                      className="mb-5 line-clamp-2"
                      style={{
                        color: 'var(--color-muted)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        lineHeight: 1.5
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
                    className="inline-flex items-center gap-2.5 text-sm font-medium mt-auto pt-2 transition-all group/link"
                    style={{
                      color: 'var(--color-primary)',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    <ExternalLink
                      size={17}
                      className="group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5 transition-transform"
                    />
                    <span>Access Resource</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-5 px-5 sm:px-8 mb-10">
          {currentResources.map((resource) => {
            const CategoryIcon = getCategoryIcon(selectedCategory);

            return (
              <div
                key={resource.id}
                className="p-7 cursor-pointer transition-all"
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-hairline)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-hairline)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                }}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="p-3 rounded-lg"
                          style={{
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-on-primary)'
                          }}
                        >
                          <CategoryIcon size={20} />
                        </div>
                        <div>
                          <h3
                            className="text-xl mb-2"
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontWeight: 500,
                              color: 'var(--color-ink)'
                            }}
                          >
                            {resource.title}
                          </h3>
                          {resource.author && (
                            <p className="text-sm mb-1.5" style={{ color: 'var(--color-body-strong)' }}>
                              {resource.author}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {resource.source && (
                      <p className="text-sm mb-3 mt-1" style={{ color: 'var(--color-muted)' }}>
                        {resource.source}
                      </p>
                    )}
                    {resource.year && (
                      <span
                        className="px-3.5 py-1.5 text-xs"
                        style={{
                          borderRadius: 'var(--radius-pill)',
                          backgroundColor: 'var(--color-surface-soft)',
                          color: 'var(--color-muted)',
                          fontFamily: 'var(--font-body)'
                        }}
                      >
                        {resource.year}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col justify-center items-end pl-4">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-on-primary)',
                        borderRadius: 'var(--radius-md)',
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      <ExternalLink size={16} />
                      View Resource
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {currentResources.length === 0 && (
        <div className="text-center py-20 px-5 sm:px-8">
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
            className="max-w-md mx-auto mb-6"
            style={{
              color: 'var(--color-muted)',
              fontFamily: 'var(--font-body)',
              fontSize: '15px'
            }}
          >
            Try adjusting your search or browse all resources in this category.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="px-6 py-3 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              fontFamily: 'var(--font-body)'
            }}
          >
            Clear Search
          </button>
        </div>
      )}
      </>
      )}
    </div>
  );
}