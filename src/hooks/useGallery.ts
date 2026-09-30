import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllGalleryItems } from '../backend/actions/gallery';

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  accent?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UseGalleryResult {
  items: GalleryItem[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export default function useGallery(): UseGalleryResult {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getAllGalleryItems();

      if (result.success) {
        setItems(result.items || []);
        setError(null);
      } else {
        const errorMsg = typeof result.error === 'string' ? result.error : 'Failed to fetch gallery exhibits';
        setError(errorMsg);
        setItems([]);
      }
    } catch (err: any) {
      console.error('Error fetching gallery:', err);
      setError(err?.message || 'Unable to connect to the gallery database');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category && item.category.trim()) {
        set.add(item.category.trim());
      }
    });
    return Array.from(set);
  }, [items]);

  return {
    items,
    categories,
    isLoading,
    error,
    refetch: fetchGallery,
  };
}
