import { useEffect, useRef, useState } from 'react';

type TimerOpts = { initialSeconds?: number | null; initialEnded?: boolean };

export const useGiveawayTimer = (
  giveawayIds: string[] | null,
  { initialSeconds, initialEnded }: TimerOpts = {}
) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(initialSeconds ?? null);
  const [hasEnded, setHasEnded] = useState(initialEnded ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clear = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const start = (sec: number) => {
    if (sec <= 0) {
      setRemainingSeconds(0);
      setHasEnded(true);
      return;
    }
    clear();
    setRemainingSeconds(sec);
    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev && prev > 1) return prev - 1;
        clear();
        setHasEnded(true);
        return 0;
      });
    }, 1000);
  };

  useEffect(() => {
    clear();

    if (typeof initialSeconds === 'number' && typeof initialEnded === 'boolean') {
      if (!initialEnded && initialSeconds > 0) start(initialSeconds);
      return;
    }

    if (!giveawayIds || giveawayIds.length === 0) return;

    setIsLoading(true);
    const clientStartTime = performance.now();

    fetch(`/api/giveaway-timer/${giveawayIds.join(',')}`)
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok || typeof data !== 'object' || Array.isArray(data)) {
          throw new Error('Respuesta no válida de la API');
        }

        let earliestSeconds: number | null = null;
        let anyEnded = false;
        let allErrored = true;
        const roundTripLatency = performance.now() - clientStartTime;

        for (const id of giveawayIds) {
          const result = data[id];

          if (!result || typeof result !== 'object') {
            console.warn(`Resultado inválido para ${id}`);
            continue;
          }

          if (result.error) {
            console.warn(`Error en ${id}: ${result.message ?? 'sin detalles'}`);
            continue;
          }

          allErrored = false;

          if (result.hasEnded || result.result?.remainingSeconds === 0) {
            anyEnded = true;
            continue;
          }

          let sec = result.result?.remainingSeconds;
          if (typeof sec === 'number') {
            // Usar el mínimo entre la latencia redondo y el tiempo desde el servidor
            const serverTimeDelta = result.serverTimestamp
              ? Date.now()/1000 - result.serverTimestamp
              : roundTripLatency/1000;
            
            const adjustment = Math.min(
              roundTripLatency/1000,
              serverTimeDelta
            ) * 0.6; // Compensar solo el 60% del retraso

            sec = Math.max(0, sec - Math.floor(adjustment));
          }

          if (typeof sec === 'number' && sec > 0 && (earliestSeconds === null || sec < earliestSeconds)) {
            earliestSeconds = sec;
          }
        }

        if (allErrored) {
          setError('No se pudo obtener información de ningún sorteo');
          setRemainingSeconds(null);
          setHasEnded(false);
        } else if (anyEnded && earliestSeconds === null) {
          setRemainingSeconds(0);
          setHasEnded(true);
          setError(null);
        } else if (earliestSeconds != null) {
          start(earliestSeconds);
          setError(null);
        }
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setRemainingSeconds(null);
        setHasEnded(false);
      })
      .finally(() => setIsLoading(false));

    return clear;
  }, [giveawayIds, initialSeconds, initialEnded]);

  return { remainingSeconds, hasEnded, isLoading, error };
};