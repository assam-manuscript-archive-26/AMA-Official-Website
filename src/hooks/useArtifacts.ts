import { useState, useEffect, useCallback } from 'react';
import { getAllArtifacts } from '../backend/actions/artifact';

interface ArtifactItem {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  imageUrl: string;
  english_audio_url?: string;
  hindi_audio_url?: string;
  assamese_audio_url?: string;
}

interface UseArtifactsResult {
  artifacts: ArtifactItem[];
  isLoading: boolean;
  error: boolean;
  refetch: () => void;
}

let cachedArtifacts: ArtifactItem[] | null = null;
let cacheLoading = false;
let cacheError = false;

export default function useArtifacts(): UseArtifactsResult {
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>(cachedArtifacts || []);
  const [isLoading, setIsLoading] = useState(cacheLoading);
  const [error, setError] = useState(cacheError);

  const fetchArtifacts = useCallback(async () => {
    if (cachedArtifacts !== null) {
      setArtifacts(cachedArtifacts);
      setIsLoading(false);
      setError(false);
      return;
    }

    try {
      cacheLoading = true;
      setIsLoading(true);

      const result = await getAllArtifacts();

      if (result.success) {
        const artifactsData = result.artifacts || [];
        cachedArtifacts = artifactsData;
        cacheError = false;
        setArtifacts(artifactsData);
        setError(false);
      } else {
        cacheError = true;
        setError(true);
        setArtifacts([]);
      }
    } catch (err) {
      console.error('Error fetching artifacts:', err);
      cacheError = true;
      setError(true);
      setArtifacts([]);
    } finally {
      cacheLoading = false;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtifacts();
  }, [fetchArtifacts]);

  return {
    artifacts,
    isLoading,
    error,
    refetch: fetchArtifacts,
  };
}