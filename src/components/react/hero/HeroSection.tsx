import React from 'react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCta?: string;
  secondaryHref?: string;
  imageUrl?: string;
}

export default function HeroSection({
  title,
  subtitle,
  description,
  ctaText = 'Explore Collections',
  ctaHref = '/collections',
  secondaryCta,
  secondaryHref,
  imageUrl,
}: HeroSectionProps) {
  return (
    <section className="min-h-[80vh] flex items-center py-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {subtitle && (
            <p className="text-primary font-medium mb-4 uppercase tracking-wider text-sm">
              {subtitle}
            </p>
          )}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-ink leading-tight mb-6">
            {title}
          </h1>
          {description && (
            <p className="text-body text-lg mb-8 max-w-lg">
              {description}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            <a
              href={ctaHref}
              className="btn-primary inline-flex items-center justify-center"
            >
              {ctaText}
            </a>
            {secondaryCta && secondaryHref && (
              <a
                href={secondaryHref}
                className="btn-secondary inline-flex items-center justify-center"
              >
                {secondaryCta}
              </a>
            )}
          </div>
        </motion.div>

        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-card">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}