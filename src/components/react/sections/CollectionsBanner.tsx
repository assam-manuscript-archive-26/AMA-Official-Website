"use client";

import React from "react";

const CollectionsBanner: React.FC = () => {
  return (
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
          }}
        >
          Our Collections
        </h2>
        <p
          className="text-lg sm:text-xl font-body font-medium text-white"
          style={{
            textRendering: 'optimizeLegibility',
          }}
        >
          Explore Our Neo-Vaishnavite Manuscript Collections
        </p>
      </div>
    </div>
  );
};

export default CollectionsBanner;