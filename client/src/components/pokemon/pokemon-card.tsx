import React from 'react';
import { Link } from 'wouter';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TypeBadge from '@/components/pokemon/type-badge';
import { useFavorites } from '@/hooks/use-favorites';
import type { Pokemon } from '@/types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  isListView?: boolean;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, isListView = false }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(pokemon.name);

  if (isListView) {
    return (
      <div className="pokemon-card flex items-center hover:shadow-md cursor-pointer" onClick={() => window.location.href = `/pokemon/${pokemon.name}`}>
        <div className="h-16 w-16 bg-gray-100 flex-shrink-0 flex items-center justify-center p-1">
          <img src={pokemon.normalSprite} alt={pokemon.name} className="h-full w-auto object-contain" />
        </div>
        
        <div className="p-3 flex-grow flex justify-between items-center">
          <div>
            <div className="flex items-center mb-1">
              <span className="text-gray-500 text-xs mr-2">#{pokemon.pokedexNumber}</span>
              <h3 className="font-bold">{pokemon.name}</h3>
            </div>
            <div className="flex space-x-1">
              <TypeBadge type={pokemon.primaryType} />
              {pokemon.secondaryType && <TypeBadge type={pokemon.secondaryType} />}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:block text-right text-sm">
              <div>HP: {pokemon.hp}</div>
              <div>Atk: {pokemon.attack}</div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(pokemon.name);
              }}
              className="text-gray-400 hover:text-yellow-500"
            >
              <Star className={isFavorite ? 'fill-yellow-400 text-yellow-400' : ''} size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pokemon-card block cursor-pointer" onClick={() => window.location.href = `/pokemon/${pokemon.name}`}>
      <div className="h-36 bg-gray-100 flex items-center justify-center p-2">
        <img src={pokemon.normalSprite} alt={pokemon.name} className="h-full w-auto object-contain" />
      </div>
      <div className="p-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-500 text-xs">#{pokemon.pokedexNumber}</span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(pokemon.name);
            }}
            className="h-6 w-6 text-gray-400 hover:text-yellow-500"
          >
            <Star className={isFavorite ? 'fill-yellow-400 text-yellow-400' : ''} size={16} />
          </Button>
        </div>
        <h3 className="font-bold text-lg truncate">{pokemon.name}</h3>
        <div className="flex space-x-1 mt-1">
          <TypeBadge type={pokemon.primaryType} />
          {pokemon.secondaryType && <TypeBadge type={pokemon.secondaryType} />}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
