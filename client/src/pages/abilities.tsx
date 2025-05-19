import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import type { Pokemon } from '@/types/pokemon';

interface Ability {
  Name: string;
  Pokémon: string;
  Description: string;
  Generation: string;
}

const Abilities: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
  const [relatedPokemon, setRelatedPokemon] = useState<Pokemon[]>([]);

  // Fetch abilities data
  const { data: abilities, isLoading } = useQuery({
    queryKey: ['/api/abilities'],
    queryFn: async () => {
      const res = await fetch('/attached_assets/Abilities.json');
      const data = await res.json();
      return data as Ability[];
    }
  });

  // Fetch all Pokemon data
  const { data: allPokemon } = useQuery({
    queryKey: ['/api/pokemon'],
    queryFn: async () => {
      const res = await apiRequest('/api/pokemon');
      return res as Pokemon[];
    }
  });

  // Find Pokemon with the selected ability
  useEffect(() => {
    if (selectedAbility && allPokemon) {
      // Filter Pokemon with the selected ability (primary, secondary, or hidden)
      const pokemon = allPokemon.filter(p => 
        p.abilityI === selectedAbility.Name || 
        p.abilityII === selectedAbility.Name || 
        p.hiddenAbility === selectedAbility.Name
      );
      setRelatedPokemon(pokemon);
    } else {
      setRelatedPokemon([]);
    }
  }, [selectedAbility, allPokemon]);

  // Filter abilities based on search
  const filteredAbilities = abilities?.filter(ability => 
    ability.Name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  // Handle selecting an ability
  const handleSelectAbility = (ability: Ability) => {
    setSelectedAbility(ability);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pokémon Abilities</h1>
      
      {/* Search bar */}
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder="Search abilities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Abilities list */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">All Abilities</h2>
          {isLoading ? (
            <p>Loading abilities...</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 max-h-[600px] overflow-y-auto pr-2">
              {filteredAbilities.map((ability) => (
                <Button
                  key={ability.Name}
                  variant={selectedAbility?.Name === ability.Name ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => handleSelectAbility(ability)}
                >
                  {ability.Name}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {/* Ability details and related Pokemon */}
        <div className="md:col-span-2">
          {selectedAbility ? (
            <>
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-2">{selectedAbility.Name}</h2>
                  <Badge className="mb-4">Generation {selectedAbility.Generation}</Badge>
                  <p className="text-gray-700 dark:text-gray-300">{selectedAbility.Description}</p>
                </CardContent>
              </Card>
              
              <h3 className="text-xl font-semibold mb-4">Pokémon with this Ability</h3>
              {relatedPokemon.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedPokemon.map((pokemon) => (
                    <a 
                      key={pokemon.id} 
                      href={`/pokemon/${pokemon.name}`} 
                      className="flex items-center p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <img 
                        src={pokemon.normalSprite} 
                        alt={pokemon.name} 
                        className="w-12 h-12 mr-3" 
                      />
                      <div>
                        <p className="font-medium">{pokemon.name}</p>
                        <div className="text-xs text-gray-500">
                          {pokemon.abilityI === selectedAbility.Name && <span>Primary</span>}
                          {pokemon.abilityII === selectedAbility.Name && <span>Secondary</span>}
                          {pokemon.hiddenAbility === selectedAbility.Name && <span>Hidden</span>}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p>No Pokémon found with this ability.</p>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <p className="text-gray-500">Select an ability to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Abilities;