import { useQuery } from '@tanstack/react-query';
import type { Pokemon } from '@/types/pokemon';

export function usePokemon() {
  const { data: allPokemon, isLoading, error } = useQuery<Pokemon[]>({
    queryKey: ['/api/pokemon'],
  });

  const getPokemonByNumber = (pokedexNumber: string) => {
    return allPokemon?.find(p => p.pokedexNumber === pokedexNumber);
  };

  const getPokemonByName = (name: string) => {
    return allPokemon?.find(p => p.name.toLowerCase() === name.toLowerCase());
  };

  const getMegaEvolutions = (baseName: string) => {
    return allPokemon?.filter(p => p.name.includes(`Mega ${baseName}`)) || [];
  };

  const getRegionalVariants = (baseName: string) => {
    return allPokemon?.filter(p => 
      p.name.includes(`Alolan ${baseName}`) || 
      p.name.includes(`Galarian ${baseName}`) || 
      p.name.includes(`Hisuian ${baseName}`)
    ) || [];
  };

  const getGigantamaxForms = (baseName: string) => {
    return allPokemon?.filter(p => p.name.includes(`Gigantamax ${baseName}`)) || [];
  };

  const getPokemonByGeneration = (generation: string) => {
    return allPokemon?.filter(p => p.generation === generation) || [];
  };

  const getPokemonByType = (type: string) => {
    return allPokemon?.filter(p => 
      p.primaryType === type || p.secondaryType === type
    ) || [];
  };

  const getPokemonByEggGroup = (eggGroup: string) => {
    return allPokemon?.filter(p => 
      p.eggGroupI === eggGroup || p.eggGroupII === eggGroup
    ) || [];
  };

  return {
    allPokemon,
    isLoading,
    error,
    getPokemonByNumber,
    getPokemonByName,
    getMegaEvolutions,
    getRegionalVariants,
    getGigantamaxForms,
    getPokemonByGeneration,
    getPokemonByType,
    getPokemonByEggGroup
  };
}
