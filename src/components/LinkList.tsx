import React, { useMemo } from 'react';
import { getGiveawayText } from '../data/instantGamingLinks';
import '../styles/LinkList.css';
import LoadingSpinner from './LoadingSpinner';
import { useGiveawayItems } from '../hooks/useGiveawayItems';
import LinkSection from './LinkSection';

const LinkList: React.FC<{ links: string[] }> = ({ links }) => {
  const giveawayIds = useMemo(
    () => links.map(url => url.match(/giveaway\/([^\/?]+)/)?.[1]).filter((id): id is string => !!id),
    [links]
  );

  const { itemsByState, loading } = useGiveawayItems(links, giveawayIds, getGiveawayText);

  if (loading) return <LoadingSpinner />;

  const [finalizados, enCurso, errores] = itemsByState;

  return (
    <div className="link-list-container">
      <LinkSection title="In Progress" items={enCurso} sectionClass="en-curso" />
      <LinkSection title="Completed" items={finalizados} sectionClass="finalizados" />
      <LinkSection title="Errors" items={errores} sectionClass="errores" />
    </div>
  );
};

export default LinkList;