import React from 'react';
import PokemonCard from '@/components/pokemon/pokemon-card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { Pokemon } from '@/types/pokemon';

interface PokemonListProps {
  pokemon: Pokemon[];
  isGridView: boolean;
}

const PokemonList: React.FC<PokemonListProps> = ({ pokemon, isGridView }) => {
  if (!pokemon || pokemon.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No Pokémon found. Try adjusting your filters.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={isGridView ? 
      "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4" : 
      "space-y-2"
    }>
      {pokemon.map((p) => (
        <PokemonCard 
          key={`${p.pokedexNumber}-${p.name}`} 
          pokemon={p} 
          isListView={!isGridView} 
        />
      ))}
    </div>
  );
};

export default PokemonList;
