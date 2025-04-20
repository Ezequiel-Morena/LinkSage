import React from 'react';
import '../styles/LinkButton.css';
import { formatTime } from '../utils/formatTime';
import { useCountdown } from '../hooks/useCountdown';
import { useTextTruncation } from '../hooks/useTextTruncation';
import CountdownTimer from './CountdownTimer';
import StatusMessage from './StatusMessage';
import ErrorMessage from './ErrorMessage';

interface GiveawayStatus {
  error?: string;
  isEnded?: boolean;
  remainingSeconds?: number;
}

interface LinkButtonProps {
  fullUrl: string;
  displayText?: string;
  remainingSeconds?: number | null;
  hasEnded?: boolean;
  giveawayStatus?: GiveawayStatus;
}

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