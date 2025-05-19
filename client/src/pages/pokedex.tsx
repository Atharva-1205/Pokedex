import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import PokemonList from '@/components/pokemon/pokemon-list';
import PokemonFilters from '@/components/pokemon/pokemon-filters';
import ViewToggle from '@/components/ui/view-toggle';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useFilter } from '@/hooks/use-filter';
import type { Pokemon } from '@/types/pokemon';

const Pokedex: React.FC = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { filters, updateFilter, resetFilters, activeFilters } = useFilter();
  const [searchInput, setSearchInput] = useState('');

  const { data: pokemon, isLoading, error } = useQuery<Pokemon[]>({
    queryKey: ['/api/pokemon'],
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('search', searchInput);
  };

  const handleRemoveFilter = (type: string, value: string) => {
    if (type === 'search') {
      updateFilter('search', '');
      setSearchInput('');
    } else if (type === 'generation') {
      updateFilter('generation', filters.generation.filter(g => g !== value));
    } else if (type === 'types') {
      updateFilter('types', filters.types.filter(t => t !== value));
    } else if (type === 'eggGroups') {
      updateFilter('eggGroups', filters.eggGroups.filter(eg => eg !== value));
    }
  };

  const filteredPokemon = React.useMemo(() => {
    if (!pokemon) return [];

    return pokemon.filter(p => {
      // Search filter
      if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase()) && 
          !p.pokedexNumber.includes(filters.search)) {
        return false;
      }

      // Generation filter
      if (filters.generation.length > 0 && !filters.generation.includes(p.generation)) {
        return false;
      }

      // Type filter
      if (filters.types.length > 0 && 
          !filters.types.includes(p.primaryType) && 
          (!p.secondaryType || !filters.types.includes(p.secondaryType))) {
        return false;
      }

      // Egg Group filter
      if (filters.eggGroups.length > 0 && 
          !filters.eggGroups.includes(p.eggGroupI) && 
          (!p.eggGroupII || !filters.eggGroups.includes(p.eggGroupII))) {
        return false;
      }

      // Variant filters
      if (p.isVariant && !filters.showRegionalVariants) {
        return false;
      }

      // Mega Evolution filter (name contains "Mega")
      if (p.name.includes("Mega") && !filters.showMega) {
        return false;
      }

      // Gigantamax filter (name contains "Gigantamax")
      if (p.name.includes("Gigantamax") && !filters.showGigantamax) {
        return false;
      }

      return true;
    });
  }, [pokemon, filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">PokéDex</h1>
        <p className="text-gray-600">Browse through all Pokémon with detailed information</p>
      </header>
      
      {/* Search and Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search by name or number"
              className="pl-10 w-full"
              value={searchInput}
              onChange={handleSearchChange}
            />
          </form>
          
          {/* View Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm text-gray-600">List</span>
            <ViewToggle isChecked={isGridView} onToggle={() => setIsGridView(!isGridView)} />
            <span className="text-sm text-gray-600">Grid</span>
            
            <Button 
              onClick={() => setShowFilters(!showFilters)} 
              className="ml-4 bg-primary hover:bg-red-700 text-white"
            >
              <i className="fas fa-filter mr-1"></i> Filters
            </Button>
          </div>
        </div>
        
        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2 py-1">Active Filters:</span>
            {filters.search && (
              <Badge variant="outline" className="flex items-center gap-1">
                Search: {filters.search}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 p-0" 
                  onClick={() => handleRemoveFilter('search', filters.search)}
                >
                  <X size={12} />
                </Button>
              </Badge>
            )}
            
            {filters.generation.map(gen => (
              <Badge key={gen} variant="outline" className="flex items-center gap-1">
                Generation {gen}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 p-0" 
                  onClick={() => handleRemoveFilter('generation', gen)}
                >
                  <X size={12} />
                </Button>
              </Badge>
            ))}
            
            {filters.types.map(type => (
              <Badge key={type} variant="outline" className={`flex items-center gap-1 type-${type.toLowerCase()}`}>
                {type}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 p-0 text-white" 
                  onClick={() => handleRemoveFilter('types', type)}
                >
                  <X size={12} />
                </Button>
              </Badge>
            ))}
            
            {filters.eggGroups.map(group => (
              <Badge key={group} variant="outline" className="flex items-center gap-1">
                {group}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 p-0" 
                  onClick={() => handleRemoveFilter('eggGroups', group)}
                >
                  <X size={12} />
                </Button>
              </Badge>
            ))}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-2 py-1 h-auto text-xs text-gray-500"
              onClick={resetFilters}
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
      
      {/* Filter Sidebar Toggle for Mobile */}
      <div className="lg:hidden mb-4">
        <Button 
          onClick={() => setShowFilters(!showFilters)} 
          variant="outline" 
          className="w-full"
        >
          <i className="fas fa-sliders-h mr-2"></i> Advanced Filters
        </Button>
      </div>
      
      {/* Main Content with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <PokemonFilters 
          isVisible={showFilters || window.innerWidth >= 1024} 
          onClose={() => setShowFilters(false)}
          filters={filters}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
        />
        
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
            <PokemonList pokemon={filteredPokemon} isGridView={isGridView} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Pokedex;
