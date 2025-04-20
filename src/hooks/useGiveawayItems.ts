import { useEffect, useState } from 'react';
import { useGiveawayCache } from './useGiveawayCache';

interface LinkItem {
  url: string;
  displayText: string;
  remainingSeconds: number | null;
  hasEnded: boolean;
  error: boolean;
}

export const useGiveawayItems = (links: string[], giveawayIds: string[], getDisplayText: (url: string) => string) => {
  const [itemsByState, setItemsByState] = useState<LinkItem[][]>([[], [], []]);
  const [loading, setLoading] = useState(true);
  const { getCachedData, setCachedData, calculateCurrentRemaining } = useGiveawayCache(giveawayIds);

  useEffect(() => {
    let active = true;

    const fetchStatus = async (ids: string[]): Promise<Record<string, Omit<LinkItem, 'url' | 'displayText'>>> => {
      const cachedData = getCachedData();
      const idsToFetch: string[] = [];
      const result: Record<string, Omit<LinkItem, 'url' | 'displayText'>> = {};

      if (cachedData) {
        ids.forEach(id => {
          if (cachedData[id]) {
            const remaining = calculateCurrentRemaining(cachedData[id]);
            result[id] = {
              remainingSeconds: remaining,
              hasEnded: remaining <= 0,
              error: false,
            };
          } else {
            idsToFetch.push(id);
          }
        });
      } else {
        idsToFetch.push(...ids);
      }

      if (idsToFetch.length > 0) {
        try {
          const res = await fetch(`/api/giveaway-timer/${idsToFetch.join(',')}`);
          const freshData = await res.json();

          Object.entries(freshData).forEach(([id, entry]) => {
            const entryData = entry as {
              error: boolean;
              hasEnded: boolean;
              result: { remainingSeconds: number } | null;
            };

            if (!entryData.error && entryData.result) {
              setCachedData(id, entryData, entryData.result.remainingSeconds);
            }

            result[id] = {
              remainingSeconds: entryData.result?.remainingSeconds ?? null,
              hasEnded: entryData.hasEnded,
              error: entryData.error,
            };
          });
        } catch {
          idsToFetch.forEach(id => {
            result[id] = {
              remainingSeconds: null,
              hasEnded: false,
              error: true,
            };
          });
        }
      }

      return result;
    };

    const processLinks = async () => {
      const status = await fetchStatus(giveawayIds);
      if (!active) return;

      const [finalizados, enCurso, errores] = links.reduce(
        (acc, url) => {
          const id = url.match(/giveaway\/([^\/?]+)/)?.[1] ?? '';
          const data = status[id];
          if (!data) return acc;

          const item: LinkItem = {
            ...data,
            url,
            displayText: getDisplayText(url),
          };

          const index = item.error ? 2 : item.hasEnded || item.remainingSeconds === 0 ? 0 : 1;
          acc[index].push(item);
          return acc;
        },
        [[], [], []] as LinkItem[][]
      );

      setItemsByState([finalizados, enCurso, errores]);
      setLoading(false);
    };

    processLinks();

    return () => {
      active = false;
    };
  }, [giveawayIds, links]);

  return { itemsByState, loading };
};