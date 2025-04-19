// src/components/LinkButton.tsx
import React, { useEffect, useRef, useState } from 'react';
import '../styles/LinkButton.css';
import { truncateText } from '../utils/truncateText';
import { formatTime } from '../utils/formatTime';
import CountdownTimer from './CountdownTimer';
import StatusMessage from './StatusMessage';
import ErrorMessage from './ErrorMessage';

interface LinkButtonProps {
  fullUrl: string;
  displayText?: string;
  remainingSeconds?: number | null;
  hasEnded?: boolean;
  giveawayStatus?: { error?: string; isEnded?: boolean; remainingSeconds?: number };
}

const useCountdown = (initialSeconds: number | null, initialEnded: boolean) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds ?? 0);
  const [finished, setFinished] = useState(initialEnded || initialSeconds === 0 || initialSeconds == null);

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

const useTextTruncation = (displayText: string) => {
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

const LinkButton: React.FC<LinkButtonProps> = ({
  fullUrl,
  displayText = 'Enlace',
  remainingSeconds,
  hasEnded,
  giveawayStatus
}) => {
  const { timeLeft, finished } = useCountdown(remainingSeconds ?? null, hasEnded ?? false);
  const spanRef = useTextTruncation(displayText);

  const isError = !!giveawayStatus?.error;
  const isFinalizado = !isError && (finished || giveawayStatus?.isEnded);

  const buttonClassName = `link-button-container${isError ? ' error' : isFinalizado ? ' finalizado' : ''}`;
  const buttonText = finished ? 'Finalizado' : displayText;

  return (
    <div className={buttonClassName}>
      {isError ? (
        <ErrorMessage error={giveawayStatus?.error || 'Unknown error'} />
      ) : isFinalizado ? (
        <StatusMessage message="Giveaway has ended" />
      ) : !finished && timeLeft > 0 ? (
        <CountdownTimer formattedTime={formatTime(timeLeft)} />
      ) : null}

      <a
        href={fullUrl}
        className="link-button"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={displayText}
      >
        <span ref={spanRef}>{buttonText}</span>
      </a>
    </div>
  );
};

export default LinkButton;