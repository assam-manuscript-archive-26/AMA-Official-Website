"use client";

import React from "react";

const CollectionsBanner: React.FC = () => {
  return (
    <div
      className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-0 p-6 sm:p-8 pt-32 sm:pt-32"
      style={{
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-active))',
        borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
      }}
    >
      <div>
        <h2
          className="text-3xl mb-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            color: 'var(--color-on-primary)',
          }}
        >
          Our Collections
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-body)' }}>
          Explore Assam's Satras, Mukhas and more.
        </p>
      </div>
    </div>
  );
};

export default CollectionsBanner;