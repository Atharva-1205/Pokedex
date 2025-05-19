import React from 'react';
import type { Pokemon } from '@/types/pokemon';

interface PokemonStatsProps {
  pokemon: Pokemon;
}

const PokemonStats: React.FC<PokemonStatsProps> = ({ pokemon }) => {
  // Calculate percentage for stat bars (relative to max stat values)
  const calculatePercentage = (stat: string) => {
    const value = parseInt(stat);
    const maxStat = 255; // Maximum possible stat value in Pokémon
    return Math.min(100, Math.round((value / maxStat) * 100));
  };

  return (
    <div>
      <h3 className="font-bold text-lg mb-3">Base Stats</h3>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">HP</span>
            <span className="text-sm font-medium">{pokemon.hp}</span>
          </div>
          <div className="stat-bar">
            <div className="hp h-full" style={{ width: `${calculatePercentage(pokemon.hp)}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Attack</span>
            <span className="text-sm font-medium">{pokemon.attack}</span>
          </div>
          <div className="stat-bar">
            <div className="attack h-full" style={{ width: `${calculatePercentage(pokemon.attack)}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Defense</span>
            <span className="text-sm font-medium">{pokemon.defense}</span>
          </div>
          <div className="stat-bar">
            <div className="defense h-full" style={{ width: `${calculatePercentage(pokemon.defense)}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Special Attack</span>
            <span className="text-sm font-medium">{pokemon.specialAttack}</span>
          </div>
          <div className="stat-bar">
            <div className="special-attack h-full" style={{ width: `${calculatePercentage(pokemon.specialAttack)}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Special Defense</span>
            <span className="text-sm font-medium">{pokemon.specialDefense}</span>
          </div>
          <div className="stat-bar">
            <div className="special-defense h-full" style={{ width: `${calculatePercentage(pokemon.specialDefense)}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Speed</span>
            <span className="text-sm font-medium">{pokemon.speed}</span>
          </div>
          <div className="stat-bar">
            <div className="speed h-full" style={{ width: `${calculatePercentage(pokemon.speed)}%` }}></div>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold">Total</span>
            <span className="text-sm font-bold">{pokemon.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonStats;
