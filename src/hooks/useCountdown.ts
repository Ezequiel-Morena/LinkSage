import { useEffect, useState } from 'react';

/**
 * Hook que gestiona el contador regresivo de un sorteo.
 */
export const useCountdown = (initialSeconds: number | null, initialEnded: boolean) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds ?? 0);
  const [finished, setFinished] = useState(initialEnded || initialSeconds == null || initialSeconds === 0);

  useEffect(() => {
    if (finished || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          setFinished(true);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, finished]);

  return { timeLeft, finished };
};