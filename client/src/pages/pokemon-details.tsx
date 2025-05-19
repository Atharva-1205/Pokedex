import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { Loader2, AlertCircle, Star, Users, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import TypeBadge from '@/components/pokemon/type-badge';
import PokemonStats from '@/components/pokemon/pokemon-stats';
import StatCalculator from '@/components/pokemon/stat-calculator';
import { useFavorites } from '@/hooks/use-favorites';
import type { Pokemon, TypeEffectiveness } from '@/types/pokemon';

const PokemonDetails: React.FC = () => {
  const [, params] = useRoute('/pokemon/:name');
  const name = params?.name ?? '';
  const [showShiny, setShowShiny] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  
  const { data: pokemon, isLoading, error } = useQuery<Pokemon>({
    queryKey: [`/api/pokemon/name/${name}`],
  });

  const isFavorite = favorites.includes(name);
  
  // Parse names to manage variants and forms
  const getPokemonForms = () => {
    if (!pokemon) return [];
    
    const baseName = pokemon.name.includes('Mega') 
      ? pokemon.name.split('Mega')[0].trim()
      : pokemon.name.includes('Alolan')
      ? pokemon.name.split('Alolan')[0].trim()
      : pokemon.name.includes('Galarian')
      ? pokemon.name.split('Galarian')[0].trim()
      : pokemon.name.includes('Hisuian')
      ? pokemon.name.split('Hisuian')[0].trim()
      : pokemon.name;
    
    const forms = [];
    
    // Add base form
    forms.push({ name: baseName, label: 'Normal Form', isCurrent: pokemon.name === baseName });
    
    // Add mega forms if relevant
    if (pokemon.name.includes('Mega') || ['Charizard', 'Mewtwo', 'Blastoise', 'Venusaur'].includes(baseName)) {
      forms.push({ 
        name: `Mega ${baseName}`, 
        label: 'Mega Form', 
        isCurrent: pokemon.name === `Mega ${baseName}` 
      });
      
      // Special cases for Pokemon with multiple mega forms
      if (baseName === 'Charizard') {
        forms.push({ 
          name: `Mega ${baseName} X`, 
          label: 'Mega Form X', 
          isCurrent: pokemon.name === `Mega ${baseName} X` 
        });
        forms.push({ 
          name: `Mega ${baseName} Y`, 
          label: 'Mega Form Y', 
          isCurrent: pokemon.name === `Mega ${baseName} Y` 
        });
      }
    }
    
    // Add regional variants
    if (pokemon.name.includes('Alolan') || ['Rattata', 'Raticate', 'Raichu', 'Sandshrew', 'Sandslash',
                                          'Vulpix', 'Ninetales', 'Diglett', 'Dugtrio', 'Meowth',
                                          'Persian', 'Geodude', 'Graveler', 'Golem', 'Grimer',
                                          'Muk', 'Exeggutor', 'Marowak'].includes(baseName)) {
      forms.push({ 
        name: `Alolan ${baseName}`, 
        label: 'Alolan Form', 
        isCurrent: pokemon.name === `Alolan ${baseName}` 
      });
    }
    
    if (pokemon.name.includes('Galarian') || ['Meowth', 'Ponyta', 'Rapidash', 'Farfetch\'d', 'Weezing',
                                            'Mr. Mime', 'Articuno', 'Zapdos', 'Moltres', 'Slowpoke',
                                            'Slowbro', 'Corsola', 'Zigzagoon', 'Linoone', 'Darumaka',
                                            'Darmanitan', 'Yamask', 'Stunfisk'].includes(baseName)) {
      forms.push({ 
        name: `Galarian ${baseName}`, 
        label: 'Galarian Form', 
        isCurrent: pokemon.name === `Galarian ${baseName}` 
      });
    }
    
    // Add Gigantamax forms
    if (['Charizard', 'Pikachu', 'Meowth', 'Eevee', 'Snorlax', 'Lapras', 'Gengar', 'Machamp',
         'Garbodor', 'Corviknight', 'Orbeetle', 'Drednaw', 'Coalossal', 'Alcremie', 'Copperajah',
         'Duraludon', 'Venusaur', 'Blastoise', 'Butterfree', 'Centiskorch'].includes(baseName)) {
      forms.push({ 
        name: `Gigantamax ${baseName}`, 
        label: 'Gigantamax Form', 
        isCurrent: pokemon.name === `Gigantamax ${baseName}` 
      });
    }
    
    return forms;
  };

  // Calculate type effectiveness
  const getTypeEffectiveness = (): TypeEffectiveness => {
    if (!pokemon) {
      return { weak: [], veryWeak: [], resistant: [], veryResistant: [], immune: [] };
    }
    
    // This is a simplified version. A full implementation would need a complete type chart.
    // Just as a demonstration, let's add some sample type relationships
    const typeEffectiveness: TypeEffectiveness = {
      weak: [],
      veryWeak: [],
      resistant: [],
      veryResistant: [],
      immune: []
    };
    
    // If Fire type
    if (pokemon.primaryType === 'Fire' || pokemon.secondaryType === 'Fire') {
      typeEffectiveness.weak.push('Ground', 'Rock', 'Water');
      typeEffectiveness.resistant.push('Bug', 'Steel', 'Grass', 'Ice', 'Fairy');
    }
    
    // If Water type
    if (pokemon.primaryType === 'Water' || pokemon.secondaryType === 'Water') {
      typeEffectiveness.weak.push('Electric', 'Grass');
      typeEffectiveness.resistant.push('Fire', 'Water', 'Ice', 'Steel');
    }
    
    // If Grass type
    if (pokemon.primaryType === 'Grass' || pokemon.secondaryType === 'Grass') {
      typeEffectiveness.weak.push('Flying', 'Poison', 'Bug', 'Fire', 'Ice');
      typeEffectiveness.resistant.push('Ground', 'Water', 'Grass', 'Electric');
    }
    
    // If Electric type
    if (pokemon.primaryType === 'Electric' || pokemon.secondaryType === 'Electric') {
      typeEffectiveness.weak.push('Ground');
      typeEffectiveness.resistant.push('Flying', 'Steel', 'Electric');
    }
    
    // If Flying type
    if (pokemon.primaryType === 'Flying' || pokemon.secondaryType === 'Flying') {
      typeEffectiveness.weak.push('Electric', 'Ice', 'Rock');
      typeEffectiveness.resistant.push('Fighting', 'Bug', 'Grass');
      typeEffectiveness.immune.push('Ground');
    }
    
    // If Dragon type
    if (pokemon.primaryType === 'Dragon' || pokemon.secondaryType === 'Dragon') {
      typeEffectiveness.weak.push('Ice', 'Dragon', 'Fairy');
      typeEffectiveness.resistant.push('Fire', 'Water', 'Grass', 'Electric');
    }
    
    return typeEffectiveness;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[70vh]">
        <Loader2 className="mr-2 h-10 w-10 animate-spin text-primary" />
        <span>Loading Pokémon data...</span>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load Pokémon data. Please try again later.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/pokedex">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to PokéDex
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const forms = getPokemonForms();
  const typeEffectiveness = getTypeEffectiveness();
  const backgroundClass = `bg-${pokemon.primaryType.toLowerCase()}`;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 mb-6 text-sm">
        <Link href="/">
          <a className="text-accent hover:underline flex items-center">
            <Home className="h-4 w-4 mr-1" /> Home
          </a>
        </Link>
        <span className="text-gray-500">/</span>
        <Link href="/pokedex">
          <a className="text-accent hover:underline">PokéDex</a>
        </Link>
        <span className="text-gray-500">/</span>
        <span className="text-gray-600">{pokemon.name}</span>
      </div>
      
      {/* Pokemon Header */}
      <div className={`${backgroundClass} bg-opacity-90 rounded-t-lg p-6 text-white flex flex-col md:flex-row items-center justify-between mb-1`}>
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-4">
            <span className="text-white/70 text-sm">#{pokemon.pokedexNumber}</span>
            <h1 className="text-3xl font-bold">{pokemon.name}</h1>
            <div className="flex space-x-2 mt-1">
              <TypeBadge type={pokemon.primaryType} />
              {pokemon.secondaryType && <TypeBadge type={pokemon.secondaryType} />}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => toggleFavorite(pokemon.name)}
            variant="secondary" 
            className="bg-white/20 hover:bg-white/30 text-white"
          >
            <Star className={`mr-1 ${isFavorite ? 'text-yellow-300 fill-yellow-300' : ''}`} /> 
            {isFavorite ? 'Favorited' : 'Favorite'}
          </Button>
          <Button 
            variant="secondary" 
            className="bg-white/20 hover:bg-white/30 text-white"
          >
            <Users className="mr-1" /> Add to Team
          </Button>
        </div>
      </div>
      
      {/* Pokemon Image and Stats */}
      <div className="bg-white rounded-b-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Pokemon Image */}
          <div className="w-full lg:w-1/3 flex flex-col items-center">
            <div className="h-64 w-64 bg-gray-100 rounded-lg flex items-center justify-center p-4 mb-4">
              <img 
                src={showShiny ? pokemon.shinySprite : pokemon.normalSprite} 
                alt={pokemon.name} 
                className="h-full w-auto object-contain"
              />
            </div>
            
            {forms.length > 1 && (
              <div className="grid grid-cols-2 gap-2 w-full mt-2">
                {forms.map((form, index) => (
                  <Link key={index} href={`/pokemon/${form.name}`}>
                    <Button 
                      variant={form.isCurrent ? "default" : "outline"}
                      className={form.isCurrent ? "bg-primary text-white" : ""}
                      size="sm"
                    >
                      {form.label}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
            
            <div className="mt-4 w-full text-center">
              <Button 
                onClick={() => setShowShiny(!showShiny)} 
                variant="outline" 
                size="sm"
                className="rounded-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> {showShiny ? "Show Normal" : "Show Shiny"}
              </Button>
            </div>
          </div>
          
          {/* Pokemon Stats */}
          <div className="w-full lg:w-2/3">
            <Tabs defaultValue="stats">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="evolution">Evolution</TabsTrigger>
                <TabsTrigger value="moves">Moves</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Base Stats */}
                  <PokemonStats pokemon={pokemon} />
                  
                  {/* Stat Calculator */}
                  <StatCalculator pokemon={pokemon} />
                </div>
              </TabsContent>
              
              <TabsContent value="details">
                <p className="py-4">Details content coming soon...</p>
              </TabsContent>
              
              <TabsContent value="evolution">
                <p className="py-4">Evolution chain coming soon...</p>
              </TabsContent>
              
              <TabsContent value="moves">
                <p className="py-4">Moves list coming soon...</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Pokemon Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">Basic Information</h3>
          
          <div className="space-y-3">
            <div className="flex">
              <div className="w-1/3 text-sm font-medium text-gray-600">Species</div>
              <div className="w-2/3 text-sm">{pokemon.species}</div>
            </div>
            
            <div className="flex">
              <div className="w-1/3 text-sm font-medium text-gray-600">Height</div>
              <div className="w-2/3 text-sm">{pokemon.height}</div>
            </div>
            
            <div className="flex">
              <div className="w-1/3 text-sm font-medium text-gray-600">Weight</div>
              <div className="w-2/3 text-sm">{pokemon.weight}</div>
            </div>
            
            <div className="flex">
              <div className="w-1/3 text-sm font-medium text-gray-600">Abilities</div>
              <div className="w-2/3 text-sm">
                <div className="mb-1">
                  <span className="font-medium">{pokemon.abilityI}</span>
                </div>
                {pokemon.abilityII && (
                  <div className="mb-1">
                    <span className="font-medium">{pokemon.abilityII}</span>
                  </div>
                )}
                {pokemon.hiddenAbility && (
                  <div className="mb-1">
                    <span className="font-medium">{pokemon.hiddenAbility}</span>
                    <span className="text-xs text-gray-500 ml-1">(Hidden)</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex">
              <div className="w-1/3 text-sm font-medium text-gray-600">Generation</div>
              <div className="w-2/3 text-sm">Generation {pokemon.generation}</div>
            </div>
            
            <div className="flex">
              <div className="w-1/3 text-sm font-medium text-gray-600">EV Yield</div>
              <div className="w-2/3 text-sm">{pokemon.evYield}</div>
            </div>
            
            <div className="flex">
              <div className="w-1/3 text-sm font-medium text-gray-600">Base Experience</div>
              <div className="w-2/3 text-sm">{pokemon.baseExp}</div>
            </div>
            
            <div className="flex">
              <div className="w-1/3 text-sm font-medium text-gray-600">Egg Groups</div>
              <div className="w-2/3 text-sm">
                {pokemon.eggGroupI}
                {pokemon.eggGroupII && `, ${pokemon.eggGroupII}`}
              </div>
            </div>
          </div>
        </div>
        
        {/* Type Matchups */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">Type Effectiveness</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-red-600 mb-2">Weak to (2x)</h4>
              <div className="flex flex-wrap gap-1">
                {typeEffectiveness.weak.length > 0 ? (
                  typeEffectiveness.weak.map(type => (
                    <TypeBadge key={type} type={type} />
                  ))
                ) : (
                  <span className="text-sm text-gray-500">None</span>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-red-800 mb-2">Very weak to (4x)</h4>
              <div className="flex flex-wrap gap-1">
                {typeEffectiveness.veryWeak.length > 0 ? (
                  typeEffectiveness.veryWeak.map(type => (
                    <TypeBadge key={type} type={type} />
                  ))
                ) : (
                  <span className="text-sm text-gray-500">None</span>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-green-600 mb-2">Resistant to (½×)</h4>
              <div className="flex flex-wrap gap-1">
                {typeEffectiveness.resistant.length > 0 ? (
                  typeEffectiveness.resistant.map(type => (
                    <TypeBadge key={type} type={type} />
                  ))
                ) : (
                  <span className="text-sm text-gray-500">None</span>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-green-800 mb-2">Very resistant to (¼×)</h4>
              <div className="flex flex-wrap gap-1">
                {typeEffectiveness.veryResistant.length > 0 ? (
                  typeEffectiveness.veryResistant.map(type => (
                    <TypeBadge key={type} type={type} />
                  ))
                ) : (
                  <span className="text-sm text-gray-500">None</span>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-purple-600 mb-2">Immune to (0×)</h4>
              <div className="flex flex-wrap gap-1">
                {typeEffectiveness.immune.length > 0 ? (
                  typeEffectiveness.immune.map(type => (
                    <TypeBadge key={type} type={type} />
                  ))
                ) : (
                  <span className="text-sm text-gray-500">None</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
