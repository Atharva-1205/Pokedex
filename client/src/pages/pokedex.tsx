import React from 'react';
import { useQuery } from '@tanstack/react-query';
import PokemonList from '@/components/pokemon/pokemon-list';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import type { Pokemon } from '@/types/pokemon';

const Pokedex: React.FC = () => {
  const [isGridView] = React.useState(true);

  const { data: pokemon, isLoading, error } = useQuery<Pokemon[]>({
    queryKey: ['/api/pokemon'],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">PokéDex</h1>
        <p className="text-gray-600">All Pokémon in a single page</p>
      </header>

      {/* Main Content */}
      <div className="flex flex-col gap-6">
        
        {/* Pokémon List */}
        <div className="flex-grow">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="mr-2 h-10 w-10 animate-spin text-primary" />
              <span>Loading Pokémon data...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load Pokémon data. Please try again later.
              </AlertDescription>
            </Alert>
          ) : (
            <PokemonList pokemon={pokemon || []} isGridView={isGridView} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Pokedex;
