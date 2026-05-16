"use client";

import React, { useState, useEffect } from "react";
import CollectionsBanner from "./CollectionsBanner";
import CollectionsSearchBar from "./CollectionsSearchBar";
import useArtifacts from "@/hooks/useArtifacts";

interface ArtifactItem {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  imageUrl: string;
  english_audio_url?: string;
  hindi_audio_url?: string;
  assamese_audio_url?: string;
}

const CollectionsPage: React.FC = () => {
  // Get search query from URL params
  const getInitialSearchQuery = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("search") || "";
    }
    return "";
  };

  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery);
  const [showAll, setShowAll] = useState<{ [key: string]: boolean }>({});
  const [searchError, setSearchError] = useState(false);
  const { artifacts: artifactsData, isLoading, error: apiError } = useArtifacts();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Detect dark mode
  useEffect(() => {
    const checkTheme = () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(isDark);
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchError(true);
      setTimeout(() => setSearchError(false), 2000);
      return;
    }
    window.location.href = `/collections?search=${encodeURIComponent(searchQuery)}`;
  };

  // Group artifacts by category
  const groupedArtifacts = artifactsData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push({
      src: item.imageUrl,
      name: item.name,
      id: item.id,
      has_audio: !!(
        item.english_audio_url ||
        item.hindi_audio_url ||
        item.assamese_audio_url
      ),
    });
    return acc;
  }, {} as Record<string, Array<{
    src: string;
    name: string;
    id: string;
    has_audio?: boolean;
  }>>);

  // Convert grouped object to array format
  const artifactSections = Object.entries(groupedArtifacts).map(
    ([title, items]) => ({
      title,
      items,
    })
  );

  // Filter artifacts based on search query
  const filteredArtifacts = artifactSections
    .map((section) => {
      const filteredItems = section.items.filter((item) => {
        const artifactItem = artifactsData.find((ai) => ai.id === item.id);
        if (!artifactItem) return false;

        return (
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artifactItem.keywords.some((kw) =>
            kw.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          artifactItem.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      return { ...section, items: filteredItems };
    })
    .filter((section) => section.items.length > 0);

  const handleArtifactClick = (id: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      window.location.href = `/audioplayer?id=${id}`;
    }, 300);
  };

  return (
    <div
      className="w-full max-w-[1400px] mx-auto min-h-screen pb-15 relative"
      style={{
        // backgroundColor: "var(--color-canvas)",
        color: "var(--color-ink)",
        fontFamily: 'var(--font-body)',
      }}
    >
      <CollectionsBanner />

      <CollectionsSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        showPrompt={true}
        collectionsData={artifactsData}
      />

      {searchError && (
        <div className="flex justify-center mt-2">
          <div
            className="text-white text-sm px-3 py-2 rounded shadow-md"
            style={{ backgroundColor: "var(--color-error)" }}
          >
            Please enter a search query!
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="mt-20 flex flex-col items-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mb-4"
              style={{ borderColor: "var(--color-primary)" }}
            />
            <p style={{ color: "var(--color-muted)" }}>Loading artifacts...</p>
          </div>
        ) : apiError ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">!</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-ink)" }}>
              Failed to Load Artifacts
            </h3>
            <p style={{ color: "var(--color-muted)" }}>Please try again later.</p>
          </div>
        ) : filteredArtifacts.length > 0 ? (
          filteredArtifacts.map((section) => {
            const isExpanded = showAll[section.title] || false;
            const displayedItems = isExpanded
              ? section.items
              : section.items.slice(0, 5);

            return (
              <section key={section.title} className="mt-25 fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className="text-3xl font-bold font-display"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {section.title}
                  </h2>
                  {section.items.length > 4 && (
                    <button
                      onClick={() =>
                        setShowAll((prev) => ({
                          ...prev,
                          [section.title]: !isExpanded,
                        }))
                      }
                      className="text-lg font-bold underline cursor-pointer transition-colors"
                      style={{
                        color: "var(--color-primary)",
                      }}
                    >
                      {isExpanded ? "Show Less" : "Show All"}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                  {displayedItems.map((item) => (
                    <div
                      key={item.name}
                      onClick={() => handleArtifactClick(item.id)}
                      className="block cursor-pointer"
                    >
                      <div
                        className="relative group rounded-xl overflow-hidden w-full h-[280px] sm:h-[300px]
                        md:h-[340px] shadow-md hover:shadow-lg transition duration-500"
                        style={{
                          backgroundColor: "var(--color-surface-card)",
                        }}
                      >
                        {item.src ? (
                          <img
                            src={item.src}
                            alt={item.name}
                            className="rounded-xl object-cover w-full h-full transition-all duration-500 ease-in-out
                            transform group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center"
                            style={{
                              backgroundColor: "var(--color-surface-soft)",
                              borderColor: "var(--color-hairline)",
                            }}
                          >
                            <span style={{ color: "var(--color-muted)" }}>
                              No image
                            </span>
                          </div>
                        )}
                        <div
                          className={`absolute z-10 bottom-3 left-0 mx-2 p-2
                          backdrop-blur-lg w-[calc(100%-16px)] border
                          rounded-lg shadow-sm shadow-transparent transition-all duration-500 ${hoveredId === item.id ? 'group-hover:shadow-[0_4px_12px_rgba(204,120,92,0.3)]' : ''}`}
                          style={{
                            backgroundColor: hoveredId === item.id && isDarkMode
                              ? "var(--color-primary)"
                              : isDarkMode
                                ? "var(--color-surface-cream-strong)"
                                : "var(--color-bg-elevated)",
                            borderColor: isDarkMode
                              ? "var(--color-ink)"
                              : "var(--color-on-primary)",
                          }}
                          onMouseEnter={() => setHoveredId(item.id)}
                          onMouseLeave={() => setHoveredId(null)}
                        >
                          <h6
                            className="font-semibold text-sm leading-6 text-center"
                            style={{
                              color: hoveredId === item.id && isDarkMode
                                ? "var(--color-on-primary)"
                                : isDarkMode
                                  ? "var(--color-ink)"
                                  : "var(--color-on-primary)",
                              fontFamily: "'Courier New', Courier, monospace",
                              fontWeight: 900
                            }}
                          >
                            {item.name}
                          </h6>
                          <p
                            className="text-xs leading-5 text-center"
                            style={{
                              color: hoveredId === item.id && isDarkMode
                                ? "var(--color-on-primary)"
                                : isDarkMode
                                  ? "var(--color-body)"
                                  : "var(--color-on-primary)",
                              opacity: 0.8
                            }}
                          >
                            {section.title} Collection
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-ink)" }}>
              No Artifacts Found
            </h3>
            <p style={{ color: "var(--color-muted)" }}>
              {searchQuery
                ? `No results for "${searchQuery}". Try another search term.`
                : "The collection is currently empty."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;