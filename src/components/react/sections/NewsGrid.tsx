import React from 'react';
import { motion } from 'framer-motion';

interface NewsItem {
  id: string;
  title: string;
  excerpt?: string;
  image?: string;
  published_at?: string;
  author?: string;
}

interface NewsGridProps {
  news: NewsItem[];
  featured?: boolean;
}

export default function NewsGrid({ news, featured = false }: NewsGridProps) {
  return (
    <div className={`grid gap-8 ${featured ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
      {news.map((item, index) => (
        <motion.article
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className={featured ? 'grid md:grid-cols-2 gap-8 items-center' : 'card-cream'}
        >
          {item.image && (
            <div className={`rounded-lg overflow-hidden ${featured ? 'aspect-[4/3]' : 'aspect-video mb-4'}`}>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className={featured ? '' : ''}>
            {item.published_at && (
              <p className="text-muted-soft text-sm mb-2">
                {new Date(item.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            )}
            <h3 className={`font-display text-2xl text-ink mb-3 ${featured ? 'md:text-3xl' : ''}`}>
              {item.title}
            </h3>
            {item.excerpt && (
              <p className="text-body line-clamp-3">{item.excerpt}</p>
            )}
          </div>
        </motion.article>
      ))}
    </div>
  );
}