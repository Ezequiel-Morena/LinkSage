// src/hooks/useGiveawayCache.ts
import { useEffect, useState } from 'react';

interface CachedGiveaway {
  data: any;
  timestamp: number;
  initialRemainingSeconds: number;
}

export const useGiveawayCache = (giveawayIds: string[]) => {
  const getCacheKey = (id: string) => `giveaway_${id}`;

  const getCachedData = (): Record<string, CachedGiveaway> | null => {
    try {
      const cachedData: Record<string, CachedGiveaway> = {};
      let hasValidCache = false;

      giveawayIds.forEach(id => {
        const cached = sessionStorage.getItem(getCacheKey(id));
        if (cached) {
          cachedData[id] = JSON.parse(cached);
          hasValidCache = true;
        }
      });

      return hasValidCache ? cachedData : null;
    } catch (error) {
      return null;
    }
  };

  const setCachedData = (id: string, data: any, remainingSeconds: number) => {
    const cacheItem: CachedGiveaway = {
      data,
      timestamp: Date.now(),
      initialRemainingSeconds: remainingSeconds
    };
    sessionStorage.setItem(getCacheKey(id), JSON.stringify(cacheItem));
  };

  const calculateCurrentRemaining = (cachedItem: CachedGiveaway): number => {
    const elapsedSeconds = Math.floor((Date.now() - cachedItem.timestamp) / 1000);
    return Math.max(0, cachedItem.initialRemainingSeconds - elapsedSeconds);
  };

  return { getCachedData, setCachedData, calculateCurrentRemaining };
};