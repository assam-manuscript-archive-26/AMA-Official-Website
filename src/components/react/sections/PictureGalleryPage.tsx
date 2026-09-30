import React, { useEffect, useMemo, useRef, useState } from 'react';
import CollectionsSearchBar from './CollectionsSearchBar';
import useGallery, { type GalleryItem } from '@/hooks/useGallery';
import { AlertCircle, RefreshCw, Image as ImageIcon, Eye, X } from 'lucide-react';

export default function PictureGalleryPage() {
  const { items, isLoading, error, refetch } = useGallery();
  const [showAll, setShowAll] = useState<{ [category: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const scrollYRef = useRef<number>(0);

  // Body scroll locking when lightbox modal is open
  useEffect(() => {
    if (!selectedItem) {
      if (scrollYRef.current) {
        const scrollY = scrollYRef.current;
        scrollYRef.current = 0;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        document.documentElement.style.overflow = '';
        window.scrollTo({ top: scrollY, behavior: 'auto' });
      }
      return;
    }

    const scrollY = window.scrollY;
    scrollYRef.current = scrollY;

    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyLeft = document.body.style.left;
    const previousBodyRight = document.body.style.right;
    const previousBodyWidth = document.body.style.width;
    const previousBodyTouchAction = document.body.style.touchAction;
    const previousRootOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.touchAction = 'none';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedItem(null);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.left = previousBodyLeft;
      document.body.style.right = previousBodyRight;
      document.body.style.width = previousBodyWidth;
      document.body.style.touchAction = previousBodyTouchAction;
      document.documentElement.style.overflow = previousRootOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
      window.scrollTo({ top: scrollY, behavior: 'auto' });
    };
  }, [selectedItem]);

  // Group items by category (identical structure to CollectionsPage)
  const groupedGallery = useMemo(() => {
    return items.reduce((acc, item) => {
      const categoryName = item.category?.trim() || 'General';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(item);
      return acc;
    }, {} as Record<string, GalleryItem[]>);
  }, [items]);

  // Convert grouped object to array of sections
  const gallerySections = useMemo(() => {
    return Object.entries(groupedGallery).map(([title, sectionItems]) => ({
      title,
      items: sectionItems,
    }));
  }, [groupedGallery]);

  // Filter sections and items based on search query
  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return gallerySections;

    return gallerySections
      .map((section) => {
        const matchingItems = section.items.filter((item) => {
          const matchTitle = item.title?.toLowerCase().includes(query);
          const matchCat = item.category?.toLowerCase().includes(query);
          const matchAccent = item.accent?.toLowerCase().includes(query);
          const matchDesc = item.description?.toLowerCase().includes(query);
          return matchTitle || matchCat || matchAccent || matchDesc;
        });
        return {
          ...section,
          items: matchingItems,
        };
      })
      .filter((section) => section.items.length > 0);
  }, [gallerySections, searchQuery]);

  // Handle retry click with animated spin
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await refetch();
    } finally {
      setIsRetrying(false);
    }
  };

  // Prepare collections data format for CollectionsSearchBar suggestions
  const searchBarCollectionsData = useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      name: item.title,
      category: item.category,
      keywords: [item.title, item.category, ...(item.accent ? [item.accent] : [])],
      imageUrl: item.imageUrl,
    }));
  }, [items]);

  return (
    <>
      <div
        className="w-full max-w-[1400px] mx-auto min-h-screen pb-20 relative"
        style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-body)' }}
      >
        {/* Banner */}
        <div
          className="flex flex-col lg:flex-row justify-between items-center sm:items-start lg:items-center gap-4 mb-0 p-6 sm:p-8 pt-32 sm:pt-32"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(/assets/bg/samaguriBg.jpeg) center/cover no-repeat, linear-gradient(135deg, var(--color-primary), var(--color-primary-active))',
            borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
          }}
        >
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h2
              className="text-4xl sm:text-5xl mb-2 font-display text-white"
              style={{
                textTransform: 'uppercase',
                textRendering: 'optimizeLegibility',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              Gallery
            </h2>
            <p
              className="text-lg sm:text-xl font-body font-medium text-white/90"
              style={{ textRendering: 'optimizeLegibility' }}
            >
              Explore curated manuscript visuals, Sattra heritage art, and cultural imagery.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <CollectionsSearchBar
          searchQuery={searchQuery}
          setSearchQuery={(value) => {
            setSearchQuery(value);
            setShowAll({});
          }}
          handleSearch={() => setShowAll({})}
          collectionsData={searchBarCollectionsData}
          onSuggestionSelect={(suggestion) => {
            setSearchQuery(suggestion);
            setShowAll({});
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* 1. LOADING STATE — Modern Pulsing Skeletons */}
          {isLoading && (
            <div className="mt-14 fade-in" aria-live="polite" aria-busy="true">
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent"
                  style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
                />
                <span className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
                  Loading gallery archive...
                </span>
              </div>

              {[1, 2].map((sectionIndex) => (
                <div key={sectionIndex} className="mb-14">
                  <div className="flex justify-between items-end mb-6">
                    <div
                      className="h-8 w-48 rounded-lg animate-pulse"
                      style={{ backgroundColor: 'var(--color-surface-soft)' }}
                    />
                    <div
                      className="h-5 w-20 rounded-md animate-pulse"
                      style={{ backgroundColor: 'var(--color-surface-soft)' }}
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                    {[1, 2, 3, 4, 5].map((cardIndex) => (
                      <div
                        key={cardIndex}
                        className="rounded-xl overflow-hidden w-full h-[280px] sm:h-[300px] md:h-[340px] animate-pulse flex flex-col justify-end p-3"
                        style={{ backgroundColor: 'var(--color-surface-soft)' }}
                      >
                        <div
                          className="h-10 w-full rounded-lg"
                          style={{ backgroundColor: 'var(--color-surface-card)' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. ERROR STATE — Production-Grade Alert Card with Retry */}
          {!isLoading && error && (
            <div className="mt-14 fade-in flex justify-center">
              <div
                className="w-full max-w-xl text-center p-8 sm:p-10 rounded-2xl border shadow-lg"
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                }}
              >
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    color: 'rgb(239, 68, 68)',
                  }}
                >
                  <AlertCircle size={36} />
                </div>
                <h3
                  className="text-2xl font-bold font-display mb-2"
                  style={{ color: 'var(--color-ink)' }}
                >
                  Unable to Load Gallery Exhibits
                </h3>
                <p className="text-sm sm:text-base mb-6" style={{ color: 'var(--color-muted)' }}>
                  {typeof error === 'string'
                    ? error
                    : 'We encountered an issue connecting to the gallery archive database. Please check your connection and try again.'}
                </p>
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-md cursor-pointer hover:shadow-lg"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-on-primary)',
                  }}
                >
                  <RefreshCw size={16} className={isRetrying ? 'animate-spin' : ''} />
                  {isRetrying ? 'Connecting...' : 'Retry Connection'}
                </button>
              </div>
            </div>
          )}

          {/* 3. ARCHIVE EMPTY STATE — When Database Has Zero Items */}
          {!isLoading && !error && items.length === 0 && (
            <div className="mt-14 fade-in flex justify-center">
              <div
                className="w-full max-w-lg text-center py-16 px-6 rounded-2xl border"
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  borderColor: 'var(--color-hairline)',
                }}
              >
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
                  style={{ backgroundColor: 'var(--color-surface-soft)' }}
                >
                  <ImageIcon size={32} style={{ color: 'var(--color-primary)' }} />
                </div>
                <h3
                  className="text-2xl font-bold font-display mb-2"
                  style={{ color: 'var(--color-ink)' }}
                >
                  Gallery Archive Being Updated
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>
                  No exhibits are currently published in the gallery archive. Please check back soon or explore our collections.
                </p>
                <a
                  href="/collections"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-colors"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-on-primary)',
                  }}
                >
                  Explore Collections
                </a>
              </div>
            </div>
          )}

          {/* 4. ZERO SEARCH RESULTS STATE */}
          {!isLoading && !error && items.length > 0 && filteredSections.length === 0 && (
            <div className="text-center py-20 fade-in">
              <div className="text-4xl mb-4">🔎</div>
              <h3 className="text-2xl font-bold font-display mb-2" style={{ color: 'var(--color-ink)' }}>
                No Exhibits Found
              </h3>
              <p className="text-sm sm:text-base mb-6" style={{ color: 'var(--color-muted)' }}>
                No gallery exhibits matched <span className="font-semibold text-primary">"{searchQuery}"</span>.
                Try another title, category, or keyword.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-surface-soft)',
                  color: 'var(--color-ink)',
                }}
              >
                <X size={14} /> Clear Search
              </button>
            </div>
          )}

          {/* 5. CATEGORIZED GALLERY SECTIONS (Matching CollectionsPage) */}
          {!isLoading && !error && filteredSections.length > 0 && (
            <div className="mt-8 md:mt-12 space-y-16 sm:space-y-20">
              {filteredSections.map((section) => {
                const isExpanded = showAll[section.title] || false;
                const displayedItems = isExpanded
                  ? section.items
                  : section.items.slice(0, 5);

                return (
                  <section key={section.title} className="fade-in">
                    {/* Section Header */}
                    <div className="flex justify-between items-end mb-6 border-b pb-3" style={{ borderColor: 'var(--color-hairline)' }}>
                      <div>
                        <h2
                          className="text-2xl sm:text-3xl font-bold font-display tracking-tight"
                          style={{ color: 'var(--color-ink)' }}
                        >
                          {section.title}
                        </h2>
                        <span
                          className="text-xs sm:text-sm font-medium"
                          style={{ color: 'var(--color-muted)' }}
                        >
                          {section.items.length} {section.items.length === 1 ? 'exhibit' : 'exhibits'}
                        </span>
                      </div>

                      {section.items.length > 5 && (
                        <button
                          type="button"
                          onClick={() =>
                            setShowAll((prev) => ({
                              ...prev,
                              [section.title]: !isExpanded,
                            }))
                          }
                          className="text-sm sm:text-base font-bold underline cursor-pointer transition-colors"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          {isExpanded ? 'Show Less' : `Show All (${section.items.length})`}
                        </button>
                      )}
                    </div>

                    {/* Responsive Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                      {displayedItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          aria-label={`Open image preview for ${item.title}`}
                          onClick={() => setSelectedItem(item)}
                          className="block cursor-pointer text-left p-0 border-0 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-xl group"
                        >
                          <div
                            className="relative rounded-xl overflow-hidden w-full h-[280px] sm:h-[300px] md:h-[340px] shadow-md hover:shadow-xl transition-all duration-500"
                            style={{ backgroundColor: 'var(--color-surface-card)' }}
                          >
                            {/* Image Thumbnail */}
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                loading="lazy"
                                className="rounded-xl object-cover w-full h-full transition-all duration-500 ease-in-out transform group-hover:scale-105"
                              />
                            ) : (
                              <div
                                className="border-2 border-dashed rounded-xl w-full h-full flex flex-col items-center justify-center"
                                style={{
                                  backgroundColor: 'var(--color-surface-soft)',
                                  borderColor: 'var(--color-hairline)',
                                }}
                              >
                                <ImageIcon size={28} style={{ color: 'var(--color-muted)' }} />
                                <span className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                                  No image
                                </span>
                              </div>
                            )}

                            {/* Hover overlay hint */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                              <span className="p-2.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                                <Eye size={18} />
                              </span>
                            </div>

                            {/* Caption Card Bar */}
                            <div
                              className="absolute z-10 bottom-3 left-0 mx-2 p-2.5 backdrop-blur-lg w-[calc(100%-16px)] border rounded-lg shadow-sm transition-all duration-500"
                              style={{
                                backgroundColor: 'rgba(20,20,19,0.82)',
                                borderColor: 'rgba(255,255,255,0.18)',
                              }}
                            >
                              <div className="flex flex-col items-center justify-center text-center">
                                <h6
                                  className="font-semibold text-xs sm:text-sm leading-5 text-center line-clamp-2"
                                  style={{
                                    color: '#faf9f5',
                                    fontFamily: 'var(--font-body)',
                                    fontWeight: 700,
                                  }}
                                >
                                  {item.title}
                                </h6>
                                {item.accent && (
                                  <span
                                    className="text-[10px] sm:text-xs font-medium tracking-wide mt-1 uppercase line-clamp-1"
                                    style={{
                                      color: 'var(--color-primary)',
                                      letterSpacing: '0.04em',
                                    }}
                                  >
                                    {item.accent}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Fullscreen Preview Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
          aria-hidden="false"
          onClick={() => setSelectedItem(null)}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: 'rgba(10, 10, 10, 0.82)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              overscrollBehavior: 'contain',
            }}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={() => setSelectedItem(null)}
            className="absolute top-5 right-5 z-[70] p-2.5 rounded-full text-white bg-black/60 hover:bg-black/90 border border-white/20 transition-all cursor-pointer"
            aria-label="Close image preview"
          >
            <X size={20} />
          </button>

          {/* Dialog Container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedItem.title}
            className="relative z-[65] flex flex-col items-center justify-center max-w-[92vw] max-h-[90vh]"
            style={{
              animation: 'galleryModalIn 220ms ease-out',
              pointerEvents: 'auto',
              overscrollBehavior: 'contain',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedItem.imageUrl}
              alt={selectedItem.title}
              className="block rounded-xl shadow-2xl"
              style={{
                maxWidth: 'min(85vw, 1050px)',
                maxHeight: 'min(76vh, 720px)',
                width: 'auto',
                height: 'auto',
                display: 'block',
                objectFit: 'contain',
              }}
            />

            {/* Modal Caption */}
            <div
              className="mt-3 px-5 py-2.5 rounded-xl border backdrop-blur-md text-center max-w-[650px]"
              style={{
                backgroundColor: 'rgba(20, 20, 19, 0.85)',
                borderColor: 'rgba(255, 255, 255, 0.16)',
                color: '#faf9f5',
              }}
            >
              <h4 className="font-semibold text-base sm:text-lg mb-0.5">{selectedItem.title}</h4>
              <div className="flex items-center justify-center gap-3 text-xs sm:text-sm">
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  {selectedItem.category}
                </span>
                {selectedItem.accent && (
                  <>
                    <span className="opacity-40">•</span>
                    <span className="opacity-80">{selectedItem.accent}</span>
                  </>
                )}
              </div>
              {selectedItem.description && (
                <p className="text-xs sm:text-sm mt-2 opacity-75 line-clamp-3 text-left sm:text-center">
                  {selectedItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes galleryModalIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .fade-in {
          animation: galleryFadeIn 0.3s ease-in-out;
        }

        @keyframes galleryFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [role='dialog'] {
            animation: none !important;
          }
          .fade-in {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}
