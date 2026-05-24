"use client";

import React from "react";
import { articles } from "@/data/knowMoreData";
import "./knowMorePage.css";

/**
 * Decorative SVG thumbnail (inspired by MajuliIntro pattern).
 * Uses DESIGN.md brand colors: coral, teal, dark surface.
 */
const ArticleThumbnail: React.FC<{ title: string; index: number }> = ({
  title,
  index,
}) => {
  // Alternate gradient directions for visual variety
  const gradients = [
    { from: "#5db8a6", via: "#cc785c", to: "#181715" },
    { from: "#cc785c", via: "#c9a227", to: "#181715" },
  ];
  const g = gradients[index % gradients.length];
  // Get the first character of the title for the decorative initial
  const initial = title.charAt(0).toUpperCase();

  return (
    <svg
      viewBox="0 0 600 400"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient
          id={`grad-${index}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={g.from} />
          <stop offset="50%" stopColor={g.via} />
          <stop offset="100%" stopColor={g.to} />
        </linearGradient>
        <pattern
          id={`pattern-${index}`}
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="30"
            cy="30"
            r="25"
            fill="none"
            stroke="#faf9f5"
            strokeWidth="1"
          />
          <circle
            cx="30"
            cy="30"
            r="15"
            fill="none"
            stroke="#faf9f5"
            strokeWidth="0.5"
          />
          <circle cx="30" cy="30" r="5" fill="#faf9f5" />
        </pattern>
      </defs>
      {/* Background gradient */}
      <rect width="600" height="400" fill={`url(#grad-${index})`} />
      {/* Decorative pattern overlay */}
      <rect
        width="600"
        height="400"
        fill={`url(#pattern-${index})`}
        opacity="0.15"
      />
      {/* Decorative initial circle */}
      <circle cx="300" cy="180" r="50" fill="rgba(250,249,245,0.2)" />
      <text
        x="300"
        y="195"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', serif"
        fontSize="48"
        fontWeight="500"
        fill="#faf9f5"
      >
        {initial}
      </text>
    </svg>
  );
};

/**
 * KnowMoreCollections — gallery of all available articles.
 * Click navigates to /knowMore?id=<id>.
 */
const KnowMoreCollections: React.FC = () => {
  const handleArticleClick = (id: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      window.location.href = `/knowMore?id=${encodeURIComponent(id)}`;
    }, 300);
  };

  return (
    <div
      className="article-page-wrapper"
      style={{
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Banner */}
      <div className="know-more-banner fade-in">
        <h1>Learn More About Us</h1>
        <p>Journey Through Assam's Neo-Vaishnavite Manuscripts</p>
      </div>

      {/* Articles Grid */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem 4rem",
        }}
      >
        <div className="know-more-gallery-grid">
          {articles.map((article, idx) => (
            <div
              key={article.id}
              className="article-card fade-in"
              style={{ animationDelay: `${idx * 0.15}s` }}
              onClick={() => handleArticleClick(article.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleArticleClick(article.id);
                }
              }}
            >
              {/* Thumbnail — MajuliIntro SVG pattern */}
              <div className="article-card-thumbnail">
                <ArticleThumbnail title={article.title} index={idx} />
              </div>

              {/* Card body */}
              <div className="article-card-body">
                <span className="article-card-category">
                  {article.category}
                </span>
                <h3 className="article-card-title">{article.title}</h3>
                <p className="article-card-excerpt">{article.excerpt}</p>
                <span className="article-card-readmore">
                  Read Article &#x279C;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KnowMoreCollections;
