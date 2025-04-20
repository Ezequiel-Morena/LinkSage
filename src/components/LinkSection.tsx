import React from 'react';
import LinkButton from './LinkButton';

interface LinkSectionProps {
  title: string;
  sectionClass: string;
  items: {
    url: string;
    displayText: string;
    remainingSeconds: number | null;
    hasEnded: boolean;
    error: boolean;
  }[];
}

const LinkSection: React.FC<LinkSectionProps> = ({ title, sectionClass, items }) => {
  if (items.length === 0) return null;

  return (
    <div className="link-section">
      <h2 className={`section-title ${sectionClass}`}>{title}</h2>
      <div className="link-list">
        {items.map((item) => (
          <div key={item.url} className="link-item">
            <LinkButton
              fullUrl={item.url}
              displayText={item.displayText}
              remainingSeconds={item.remainingSeconds}
              hasEnded={item.hasEnded}
              giveawayStatus={{
                error: item.error ? 'Failed to load the giveaway' : undefined,
                isEnded: item.hasEnded,
                remainingSeconds: item.remainingSeconds ?? undefined,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkSection;