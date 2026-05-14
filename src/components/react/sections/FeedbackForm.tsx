import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeedbackFormProps {
  onSubmit?: (data: FeedbackData) => Promise<void>;
}

interface FeedbackData {
  name: string;
  email: string;
  message: string;
  rating: number;
}

export default function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [formData, setFormData] = useState<FeedbackData>({
    name: '',
    email: '',
    message: '',
    rating: 0,
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit?.(formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-cream text-center py-12"
      >
        <h3 className="font-display text-2xl text-ink mb-4">Thank You!</h3>
        <p className="text-body">Your feedback has been submitted successfully.</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="card-cream max-w-lg mx-auto"
    >
      <h3 className="font-display text-2xl text-ink mb-6">Share Your Feedback</h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-body mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setFormData({ ...formData, rating: star })}
              className="p-1"
            >
              <Star
                size={28}
                className={`transition-colors ${
                  star <= (hoveredRating || formData.rating)
                    ? 'fill-accent-gold text-accent-gold'
                    : 'text-hairline-soft'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-body mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-3 bg-canvas border border-hairline rounded-md text-ink focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-body mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-3 bg-canvas border border-hairline rounded-md text-ink focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-body mb-2">Message</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-3 bg-canvas border border-hairline rounded-md text-ink focus:border-primary focus:outline-none resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isSubmitting ? 'Submitting...' : (
          <>
            <Send size={18} />
            Submit Feedback
          </>
        )}
      </button>
    </motion.form>
  );
}