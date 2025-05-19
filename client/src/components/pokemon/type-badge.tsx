import React from 'react';

interface TypeBadgeProps {
  type: string;
  small?: boolean;
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ type, small = false }) => {
  const typeClass = `type-${type.toLowerCase()}`;
  const sizeClass = small ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1';
  
  return (
    <span className={`pokemon-type ${typeClass} ${sizeClass}`}>
      {type}
    </span>
  );
};

export default TypeBadge;
