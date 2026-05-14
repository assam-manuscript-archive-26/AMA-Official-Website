import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  image?: string;
}

interface EventsGridProps {
  events: Event[];
}

export default function EventsGrid({ events }: EventsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event, index) => (
        <motion.article
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="card-cream"
        >
          {event.image && (
            <div className="aspect-video mb-4 rounded-lg overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex items-center gap-2 text-primary text-sm mb-3">
            <Calendar size={16} />
            <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h3 className="font-display text-xl text-ink mb-2">{event.title}</h3>
          {event.description && (
            <p className="text-body text-sm mb-4 line-clamp-2">{event.description}</p>
          )}
          {event.location && (
            <div className="flex items-center gap-2 text-muted-soft text-sm">
              <MapPin size={14} />
              <span>{event.location}</span>
            </div>
          )}
        </motion.article>
      ))}
    </div>
  );
}