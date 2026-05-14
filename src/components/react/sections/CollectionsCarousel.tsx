"use client";

import React, { useEffect, useRef, useState } from "react";
import { getAllArtifacts } from "@/backend/actions/artifact";
import "./CollectionsCarousel.css";

interface CollectionItem {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  imageUrl: string;
  english_audio_url?: string;
  hindi_audio_url?: string;
  assamese_audio_url?: string;
}

const CollectionsCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch collections from API
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const result = await getAllArtifacts();

        if (!result.success) {
          setError(true);
          setCollections([]);
        } else {
          // Filter to only show items with images and limit to 20
          const allCollections = (result.artifacts || [])
            .filter((item: CollectionItem) => item.imageUrl)
            .slice(0, 20);

          setCollections(allCollections);
          setError(false);
        }
      } catch (err) {
        console.error("Error fetching collections:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current && scrollRef.current.firstChild instanceof HTMLElement) {
      const cardWidth = scrollRef.current.firstChild.offsetWidth + 16;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Auto scroll every 3 seconds
  useEffect(() => {
    if (collections.length === 0) return;

    const interval = setInterval(() => {
      if (scrollRef.current && scrollRef.current.firstChild instanceof HTMLElement) {
        const cardWidth = scrollRef.current.firstChild.offsetWidth + 16;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;

        if (scrollLeft + cardWidth >= maxScrollLeft) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [collections]);

  if (isLoading) {
    return (
      <div className="collections-section">
        <div className="collections-container">
          <h2 className="collections-title">EXPLORE OUR COLLECTIONS</h2>
          <div className="loading-message">
            <div className="spinner"></div>
            Loading Collections...
          </div>
        </div>
        <div className="loading-spinner-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="collections-section">
        <div className="collections-container">
          <h2 className="collections-title">EXPLORE OUR COLLECTIONS</h2>
          <div className="empty-message">
            <p className="error-text">Failed to load collections. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="collections-section">
        <div className="collections-container">
          <h2 className="collections-title">EXPLORE OUR COLLECTIONS</h2>
          <a href="/collections" className="view-more-link">
            View More
          </a>
          <div className="empty-message">
            <p>No collections available yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="collections-section">
      <div className="collections-container">
        <div className="collections-header">
          <h2 className="collections-title">EXPLORE OUR COLLECTIONS</h2>
          <a href="/collections" className="view-more-link">
            View More ➜
          </a>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="scroll-container"
        >
          {collections.map((item) => (
            <a
              key={item.id}
              href={`/audioplayer?id=${item.id}`}
              className="collection-card"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                setTimeout(() => {
                  window.location.href = `/audioplayer?id=${item.id}`;
                }, 300);
              }}
            >
              <div className="card-image-wrapper">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="card-image"
                  />
                ) : (
                  <div className="no-image-placeholder">
                    <span>No image</span>
                  </div>
                )}

                <div className="card-overlay">
                  <h6 className="card-title">{item.name}</h6>
                  <p className="card-subtitle">{item.category} Collection</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Navigation Arrows */}
        {collections.length > 1 && (
          <div className="slider-nav">
            <button
              className="nav-btn left"
              onClick={() => scroll("left")}
            >
              &#x2BA8;
            </button>
            <button
              className="nav-btn right"
              onClick={() => scroll("right")}
            >
              &#x27A5;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsCarousel;