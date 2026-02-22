import React from 'react';

const speedFactor = {
  slow: 40,
  normal: 25,
  fast: 15
};

export const InfiniteMovingCards = ({ items, direction = 'right', speed = 'slow', children }) => {
  const duration = speedFactor[speed] ?? speedFactor.slow;
  const animationDirection = direction === 'right' ? 'reverse' : 'normal';
  const list = items.length ? [...items, ...items] : [];

  return (
    <div className="infinite-cards-container pb-4">
      <div
        className="infinite-cards-track"
        style={{
          animationDuration: `${duration}s`,
          animationDirection
        }}
      >
        {list.map((item, index) => (
          <div key={`${item.id || index}-${index}`} className="shrink-0 snap-start w-[108%] md:w-[912px]">
            {children(item)}
          </div>
        ))}
      </div>
    </div>
  );
};
