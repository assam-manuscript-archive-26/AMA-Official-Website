"use client";

import React, { useState, useEffect } from "react";
import { getArticleById } from "@/data/knowMoreData";
import type { Article } from "@/data/knowMoreData";
import "./knowMorePage.css";

/**
 * KnowMorePage — renders a single article's content inside the paper-effect card.
 * Reads `id` from URL query params.
 */
const KnowMorePage: React.FC = () => {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
      setError("No article specified.");
      setIsLoading(false);
      return;
    }

    const found = getArticleById(id);
    if (found) {
      setArticle(found);
    } else {
      setError("Article not found.");
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="article-loading">
        <div className="article-loading-spinner" />
        <p style={{ color: "var(--color-muted)" }}>Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-error">
        <div style={{ fontSize: "3rem" }}>📜</div>
        <p>{error || "No article data available."}</p>
        <a href="/knowMore">&#8602; Back to All Articles</a>
      </div>
    );
  }

  return (
    <div
      className="article-page-wrapper"
      style={{
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Back link */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        <a href="/knowMore" className="article-back-link">
          &#9664; All Articles
        </a>
      </div>

      {/* Paper-effect article content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "0.5rem 1rem 2rem",
        }}
      >
        <div
          className="paper-effect"
          style={{
            maxWidth: "1400px",
            margin: "26px auto 0"
          }}
        >
          <article
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "3rem",
            }}
          >
            {/* Title Section */}
            <header
              className="fade-in"
              style={{ textAlign: "center" }}
            >
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                  color: "var(--color-ink)",
                  marginBottom: "0.75rem",
                  paddingTop: "2.5rem",
                }}
              >
                {article.title}
              </h1>
            </header>

            {/* Content Sections */}
            {article.content.map((section, sIdx) => (
              <section
                key={sIdx}
                className="article-content-section fade-in"
                style={{
                  padding: "0 1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  textAlign: "justify",
                  animationDelay: `${(sIdx + 1) * 0.1}s`,
                }}
              >
                {section.heading && (
                  <h2
                    style={{
                      fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                      textAlign: "left",
                    }}
                  >
                    {section.heading}
                  </h2>
                )}
                {section.paragraphs.map((para, pIdx) => (
                  <p
                    key={pIdx}
                    style={{
                      fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
                    }}
                  >
                    {para}
                  </p>
                ))}
              </section>
            ))}

            {/* CTA */}
            <div
              className="fade-in"
              style={{
                marginTop: "2.5rem",
                marginBottom: "1.5rem",
                textAlign: "center",
              }}
            >
              <a
                href={article.ctaHref}
                style={{
                  display: "inline-block",
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-on-primary)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  padding: "0.75rem 2rem",
                  borderRadius: "var(--radius-pill)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  fontSize: "1rem",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor =
                    "var(--color-primary-active)";
                  (e.target as HTMLElement).style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor =
                    "var(--color-primary)";
                  (e.target as HTMLElement).style.transform = "scale(1)";
                }}
              >
                {article.ctaText}
              </a>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default KnowMorePage;
