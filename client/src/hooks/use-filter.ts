import { useState } from 'react';
import type { PokemonFilters } from '@/types/pokemon';

export function useFilter() {
  const [filters, setFilters] = useState<PokemonFilters>({
    search: '',
    generation: [],
    types: [],
    eggGroups: [],
    showMega: false,
    showRegionalVariants: false,
    showAlternateForms: false
  });

  // Update a specific filter
  const updateFilter = <K extends keyof PokemonFilters>(
    key: K, 
    value: PokemonFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset all filters to default values
  const resetFilters = () => {
    setFilters({
      search: '',
      generation: [],
      types: [],
      eggGroups: [],
      showMega: false,
      showRegionalVariants: false,
      showAlternateForms: false
    });
  };

  // Get an array of active filter descriptions for display
  const activeFilters = [
    ...(filters.search ? ['search'] : []),
    ...filters.generation.map(gen => `generation-${gen}`),
    ...filters.types.map(type => `type-${type}`),
    ...filters.eggGroups.map(group => `eggGroup-${group}`),
    ...(!filters.showMega ? ['hideMega'] : []),
    ...(!filters.showRegionalVariants ? ['hideRegionalVariants'] : []),
    ...(!filters.showAlternateForms ? ['hideAlternateForms'] : [])
  ];

  return {
    filters,
    updateFilter,
    resetFilters,
    activeFilters
  };
}
