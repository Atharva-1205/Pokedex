import React from 'react';

interface TypeBadgeProps {
  type: string;
  small?: boolean;
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ type, small = false }) => {
  // Map Pokémon types to their corresponding colors based on the image
  const getTypeColor = (type: string): string => {
    const typeColors: Record<string, string> = {
      normal: 'bg-gray-400 text-white',
      fire: 'bg-orange-500 text-white',
      water: 'bg-blue-400 text-white',
      electric: 'bg-yellow-400 text-white',
      grass: 'bg-green-500 text-white',
      ice: 'bg-blue-300 text-white',
      fighting: 'bg-red-700 text-white',
      poison: 'bg-purple-500 text-white',
      ground: 'bg-yellow-600 text-white',
      flying: 'bg-blue-300 text-white',
      psychic: 'bg-pink-500 text-white',
      bug: 'bg-lime-500 text-white',
      rock: 'bg-yellow-700 text-white',
      ghost: 'bg-indigo-600 text-white',
      dragon: 'bg-indigo-500 text-white',
      dark: 'bg-yellow-900 text-white',
      steel: 'bg-gray-500 text-white',
      fairy: 'bg-pink-300 text-white',
    };
    
    return typeColors[type.toLowerCase()] || 'bg-gray-500 text-white';
  };
  
  const typeColor = getTypeColor(type);
  const sizeClass = small ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  
  return (
    <span className={`rounded-md font-medium uppercase ${typeColor} ${sizeClass} inline-block`}>
      {type}
    </span>
  );
};

export default TypeBadge;
