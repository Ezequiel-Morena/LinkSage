import { useEffect, useRef } from 'react';
import { truncateText } from '../utils/truncateText';

/**
 * Hook que trunca texto en un span cuando no cabe en una línea.
 */
export const useTextTruncation = (displayText: string) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!spanRef.current) return;

    const truncate = () => truncateText(spanRef.current!, displayText);
    truncate();

    window.addEventListener('resize', truncate);
    return () => window.removeEventListener('resize', truncate);
  }, [displayText]);

  return spanRef;
};