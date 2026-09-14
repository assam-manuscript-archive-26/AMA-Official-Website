import React, { useEffect, useMemo, useRef, useState } from 'react';
import CollectionsSearchBar from './CollectionsSearchBar';
import { pictureGalleryItems } from '@/data/pictureGallery';

export default function PictureGalleryPage() {
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<(typeof pictureGalleryItems)[number] | null>(null);
  const scrollYRef = useRef<number>(0);

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

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return pictureGalleryItems;

    return pictureGalleryItems.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const visibleItems = useMemo(
    () => (showAll ? filteredItems : filteredItems.slice(0, 5)),
    [filteredItems, showAll]
  );

  return (
    <>
      <div className="w-full max-w-[1400px] mx-auto min-h-screen pb-15 relative" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-body)' }}>
        <div
          className="flex flex-col lg:flex-row justify-between items-center sm:items-start lg:items-center gap-4 mb-0 p-6 sm:p-8 pt-32 sm:pt-32"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.65)), url(/assets/bg/samaguriBg.jpeg) center/cover no-repeat, linear-gradient(135deg, var(--color-primary), var(--color-primary-active))',
            borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
          }}
        >
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h2
              className="text-4xl sm:text-5xl mb-2 font-body text-white"
              style={{
                textTransform: 'uppercase',
                textRendering: 'optimizeLegibility',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
              }}
            >
              Gallery
            </h2>
            <p
              className="text-lg sm:text-xl font-body font-medium text-white"
              style={{
                textRendering: 'optimizeLegibility',
              }}
            >
              Explore curated manuscript visuals and heritage imagery from Assam.
            </p>
          </div>
        </div>

        <CollectionsSearchBar
          searchQuery={searchQuery}
          setSearchQuery={(value) => {
            setSearchQuery(value);
            setShowAll(false);
          }}
          handleSearch={() => setShowAll(false)}
          collectionsData={pictureGalleryItems.map((item) => ({
            id: item.id,
            name: item.title,
            category: 'Gallery',
            keywords: [item.title],
            imageUrl: item.image,
          }))}
          onSuggestionSelect={(suggestion) => {
            setSearchQuery(suggestion);
            setShowAll(false);
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-8 md:mt-10 fade-in">
            {filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">🔎</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-ink)' }}>
                  No Gallery Items Found
                </h3>
                <p style={{ color: 'var(--color-muted)' }}>
                  {searchQuery ? `No results for "${searchQuery}". Try another title.` : 'No gallery items are currently available.'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                  {visibleItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Open image preview for ${item.title}`}
                      onClick={() => setSelectedItem(item)}
                      className="block cursor-pointer text-left p-0 border-0 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-xl"
                    >
                      <div
                        className="relative group rounded-xl overflow-hidden w-full h-[280px] sm:h-[300px] md:h-[340px] shadow-md hover:shadow-lg transition duration-500"
                        style={{ backgroundColor: 'var(--color-surface-card)' }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="rounded-xl object-cover w-full h-full transition-all duration-500 ease-in-out transform group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center"
                            style={{
                              backgroundColor: 'var(--color-surface-soft)',
                              borderColor: 'var(--color-hairline)',
                            }}
                          >
                            <span style={{ color: 'var(--color-muted)' }}>No image</span>
                          </div>
                        )}

                        <div
                          className="absolute z-10 bottom-3 left-0 mx-2 p-2 backdrop-blur-lg w-[calc(100%-16px)] border rounded-lg shadow-sm transition-all duration-500"
                          style={{
                            backgroundColor: 'rgba(20,20,19,0.78)',
                            borderColor: 'rgba(255,255,255,0.2)',
                          }}
                        >
                          <div className="flex items-center justify-center" style={{ minHeight: '3rem' }}>
                            <h6
                              className="font-semibold text-sm leading-6 text-center line-clamp-2"
                              style={{
                                color: '#faf9f5',
                                fontFamily: 'var(--font-body)',
                                fontWeight: 700,
                              }}
                            >
                              {item.title}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {filteredItems.length > 5 && (
                  <div className="flex justify-center mt-8 mb-4">
                    <button
                      type="button"
                      onClick={() => setShowAll((prev) => !prev)}
                      className="font-bold uppercase tracking-[0.12em] px-6 py-3 rounded-full border transition-colors"
                      style={{
                        color: 'var(--color-primary)',
                        borderColor: 'var(--color-primary)',
                        backgroundColor: 'transparent',
                      }}
                    >
                      {showAll ? 'Show Less' : 'See More'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-[55] flex items-center justify-center p-5 sm:p-8"
          aria-hidden="false"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: 'rgba(12, 12, 12, 0.72)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              overscrollBehavior: 'contain',
            }}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedItem.title}
            className="relative z-[56] flex items-center justify-center"
            style={{
              animation: 'galleryModalIn 220ms ease-out',
              pointerEvents: 'auto',
              overscrollBehavior: 'contain',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedItem.image}
              alt={selectedItem.title}
              className="block rounded-xl shadow-2xl"
              style={{
                maxWidth: 'min(62vw, 900px)',
                maxHeight: 'min(70vh, 680px)',
                width: 'auto',
                height: 'auto',
                display: 'block',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes galleryModalIn {
          from {
            opacity: 0;
            transform: scale(0.985);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [role='dialog'] {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}
