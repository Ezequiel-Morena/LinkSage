// src/components/LinkList.tsx
import React, { useEffect, useState, useMemo } from 'react';
import LinkButton from './LinkButton';
import { getGiveawayText } from '../data/instantGamingLinks';
import '../styles/LinkList.css';
import LoadingSpinner from './LoadingSpinner';
import { useGiveawayCache } from '../hooks/useGiveawayCache';

interface LinkItem {
  url: string;
  displayText: string;
  remainingSeconds: number | null;
  hasEnded: boolean;
  error: boolean;
}

const useGiveawayItems = (links: string[], giveawayIds: string[]) => {
  const [itemsByState, setItemsByState] = useState<LinkItem[][]>([[], [], []]);
  const [loading, setLoading] = useState(true);
  const { getCachedData, setCachedData, calculateCurrentRemaining } = useGiveawayCache(giveawayIds);

  useEffect(() => {
    let active = true;

    const fetchStatus = async (ids: string[]): Promise<Record<string, Omit<LinkItem, 'url' | 'displayText'>>> => {
      // Primero verificar caché
      const cachedData = getCachedData();
      const idsToFetch: string[] = [];
      const result: Record<string, Omit<LinkItem, 'url' | 'displayText'>> = {};

      // Procesar datos en caché
      if (cachedData) {
        ids.forEach(id => {
          if (cachedData[id]) {
            const remaining = calculateCurrentRemaining(cachedData[id]);
            result[id] = {
              remainingSeconds: remaining,
              hasEnded: remaining <= 0,
              error: false
            };
          } else {
            idsToFetch.push(id);
          }
        });
      } else {
        idsToFetch.push(...ids);
      }

      // Si hay IDs que no están en caché o necesitan actualización
      if (idsToFetch.length > 0) {
        try {
          const res = await fetch(`/api/giveaway-timer/${idsToFetch.join(',')}`);
          if (!res.ok) throw new Error('Fetch error');
          
          const freshData = await res.json();
          
          // Procesar datos frescos y actualizar caché
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
            displayText: getGiveawayText(url),
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

const LinkList: React.FC<{ links: string[] }> = ({ links }) => {
  const giveawayIds = useMemo(
    () => links
      .map((url) => url.match(/giveaway\/([^\/?]+)/)?.[1])
      .filter((id): id is string => id !== undefined),
    [links]
  );

  const { itemsByState, loading } = useGiveawayItems(links, giveawayIds);

  if (loading) return <LoadingSpinner />;

  const [finalizados, enCurso, errores] = itemsByState;

  return (
    <div className="link-list-container">
      {/* Sección En Curso */}
      {enCurso.length > 0 && (
        <div className="link-section">
          <h2 className="section-title en-curso">En Curso</h2>
          <div className="link-list">
            {enCurso.map((item) => (
              <div key={item.url} className="link-item">
                <LinkButton
                  fullUrl={item.url}
                  displayText={item.displayText}
                  remainingSeconds={item.remainingSeconds}
                  hasEnded={item.hasEnded}
                  giveawayStatus={{
                    error: item.error ? 'Error al cargar el sorteo' : undefined,
                    isEnded: item.hasEnded,
                    remainingSeconds: item.remainingSeconds ?? undefined,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección Finalizados */}
      {finalizados.length > 0 && (
        <div className="link-section">
          <h2 className="section-title finalizados">Finalizados</h2>
          <div className="link-list">
            {finalizados.map((item) => (
              <div key={item.url} className="link-item">
                <LinkButton
                  fullUrl={item.url}
                  displayText={item.displayText}
                  remainingSeconds={item.remainingSeconds}
                  hasEnded={item.hasEnded}
                  giveawayStatus={{
                    error: item.error ? 'Error al cargar el sorteo' : undefined,
                    isEnded: item.hasEnded,
                    remainingSeconds: item.remainingSeconds ?? undefined,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección Errores */}
      {errores.length > 0 && (
        <div className="link-section">
          <h2 className="section-title errores">Errores</h2>
          <div className="link-list">
            {errores.map((item) => (
              <div key={item.url} className="link-item">
                <LinkButton
                  fullUrl={item.url}
                  displayText={item.displayText}
                  remainingSeconds={item.remainingSeconds}
                  hasEnded={item.hasEnded}
                  giveawayStatus={{
                    error: item.error ? 'Error al cargar el sorteo' : undefined,
                    isEnded: item.hasEnded,
                    remainingSeconds: item.remainingSeconds ?? undefined,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkList;