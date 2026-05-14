import React from 'react';
import { motion } from 'framer-motion';

interface Collection {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  artifacts_count?: number;
}

interface CollectionGridProps {
  collections: Collection[];
  onSelect?: (id: string) => void;
}

export default function CollectionGrid({ collections, onSelect }: CollectionGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {collections.map((collection, index) => (
        <motion.article
          key={collection.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="card-cream cursor-pointer group"
          onClick={() => onSelect?.(collection.id)}
        >
          {collection.thumbnail && (
            <div className="aspect-[4/3] mb-6 rounded-lg overflow-hidden">
              <img
                src={collection.thumbnail}
                alt={collection.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <h3 className="font-display text-2xl text-ink mb-2">
            {collection.name}
          </h3>
          <p className="text-body text-sm mb-4 line-clamp-2">
            {collection.description}
          </p>
          {collection.artifacts_count && (
            <span className="text-muted-soft text-sm">
              {collection.artifacts_count} artifacts
            </span>
          )}
        </motion.article>
      ))}
    </div>
  );
}