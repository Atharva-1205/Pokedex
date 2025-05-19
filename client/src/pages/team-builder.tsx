import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, X, Plus, Save, Download, Upload, Trash } from 'lucide-react';
import TypeBadge from '@/components/pokemon/type-badge';
import type { Pokemon } from '@/types/pokemon';

// Types for team analysis
interface TeamMember {
  pokemon: Pokemon;
  slot: number;
}

interface TeamAnalysis {
  weaknesses: Record<string, number>;
  resistances: Record<string, number>;
  immunities: string[];
  types: Record<string, number>;
}

const TeamBuilder: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [teamName, setTeamName] = useState('My Team');
  const [savedTeams, setSavedTeams] = useState<Record<string, TeamMember[]>>({});
  
  // Fetch all Pokemon
  const { data: allPokemon, isLoading } = useQuery({
    queryKey: ['/api/pokemon'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/pokemon');
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        return data as Pokemon[];
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
        return [] as Pokemon[];
      }
    }
  });

  // Load saved teams from localStorage on mount
  useEffect(() => {
    const savedTeamsData = localStorage.getItem('savedTeams');
    if (savedTeamsData) {
      try {
        setSavedTeams(JSON.parse(savedTeamsData));
      } catch (e) {
        console.error('Error loading saved teams', e);
      }
    }
  }, []);
  
  // Save teams to localStorage when they change
  useEffect(() => {
    if (Object.keys(savedTeams).length > 0) {
      localStorage.setItem('savedTeams', JSON.stringify(savedTeams));
    }
  }, [savedTeams]);

  // Filter Pokemon based on search, generation, and type
  const filteredPokemon = allPokemon ? allPokemon.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pokemon.pokedexNumber.includes(searchTerm);
    const matchesGeneration = selectedGeneration === 'all' || pokemon.generation === selectedGeneration;
    const matchesType = selectedType === 'all' || 
                       pokemon.primaryType === selectedType || 
                       pokemon.secondaryType === selectedType;
    
    return matchesSearch && matchesGeneration && matchesType;
  }) : [];

  // Get unique generations and types for filtering
  const generations = allPokemon ? 
    Array.from(new Set(allPokemon.map(p => p.generation))).sort() : [];
  
  const types = allPokemon ? 
    Array.from(new Set(allPokemon.flatMap(p => 
      p.secondaryType ? [p.primaryType, p.secondaryType] : [p.primaryType]
    ))).sort() : [];

  // Add a Pokemon to the team
  const addToTeam = (pokemon: Pokemon) => {
    if (team.length >= 6) {
      alert("Your team already has 6 Pokémon!");
      return;
    }
    
    if (team.some(member => member.pokemon.id === pokemon.id)) {
      alert("This Pokémon is already in your team!");
      return;
    }
    
    const newSlot = team.length + 1;
    setTeam([...team, { pokemon, slot: newSlot }]);
  };

  // Remove a Pokemon from the team
  const removeFromTeam = (slot: number) => {
    const newTeam = team.filter(member => member.slot !== slot);
    // Recalculate slots
    const updatedTeam = newTeam.map((member, index) => ({
      ...member,
      slot: index + 1
    }));
    setTeam(updatedTeam);
  };

  // Clear the entire team
  const clearTeam = () => {
    if (window.confirm("Are you sure you want to clear your team?")) {
      setTeam([]);
    }
  };

  // Save the current team
  const saveTeam = () => {
    if (team.length === 0) {
      alert("Cannot save an empty team!");
      return;
    }
    
    const name = window.prompt("Enter a name for your team:", teamName);
    if (!name) return;
    
    setSavedTeams({
      ...savedTeams,
      [name]: team
    });
    setTeamName(name);
  };

  // Load a saved team
  const loadTeam = (name: string) => {
    if (savedTeams[name]) {
      setTeam(savedTeams[name]);
      setTeamName(name);
    }
  };

  // Delete a saved team
  const deleteTeam = (name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const { [name]: _, ...remaining } = savedTeams;
      setSavedTeams(remaining);
      
      if (teamName === name) {
        setTeamName('My Team');
      }
    }
  };

  // Calculate team analysis (weaknesses, resistances, etc.)
  const analyzeTeam = (): TeamAnalysis => {
    // Type effectiveness chart (simplified)
    const typeChart: Record<string, { weakTo: string[], resistantTo: string[], immuneTo: string[] }> = {
      normal: {
        weakTo: ['fighting'],
        resistantTo: [],
        immuneTo: ['ghost']
      },
      fire: {
        weakTo: ['water', 'ground', 'rock'],
        resistantTo: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
        immuneTo: []
      },
      water: {
        weakTo: ['electric', 'grass'],
        resistantTo: ['fire', 'water', 'ice', 'steel'],
        immuneTo: []
      },
      electric: {
        weakTo: ['ground'],
        resistantTo: ['electric', 'flying', 'steel'],
        immuneTo: []
      },
      grass: {
        weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'],
        resistantTo: ['water', 'electric', 'grass', 'ground'],
        immuneTo: []
      },
      ice: {
        weakTo: ['fire', 'fighting', 'rock', 'steel'],
        resistantTo: ['ice'],
        immuneTo: []
      },
      fighting: {
        weakTo: ['flying', 'psychic', 'fairy'],
        resistantTo: ['bug', 'rock', 'dark'],
        immuneTo: []
      },
      poison: {
        weakTo: ['ground', 'psychic'],
        resistantTo: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
        immuneTo: []
      },
      ground: {
        weakTo: ['water', 'grass', 'ice'],
        resistantTo: ['poison', 'rock'],
        immuneTo: ['electric']
      },
      flying: {
        weakTo: ['electric', 'ice', 'rock'],
        resistantTo: ['grass', 'fighting', 'bug'],
        immuneTo: ['ground']
      },
      psychic: {
        weakTo: ['bug', 'ghost', 'dark'],
        resistantTo: ['fighting', 'psychic'],
        immuneTo: []
      },
      bug: {
        weakTo: ['fire', 'flying', 'rock'],
        resistantTo: ['grass', 'fighting', 'ground'],
        immuneTo: []
      },
      rock: {
        weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'],
        resistantTo: ['normal', 'fire', 'poison', 'flying'],
        immuneTo: []
      },
      ghost: {
        weakTo: ['ghost', 'dark'],
        resistantTo: ['poison', 'bug'],
        immuneTo: ['normal', 'fighting']
      },
      dragon: {
        weakTo: ['ice', 'dragon', 'fairy'],
        resistantTo: ['fire', 'water', 'electric', 'grass'],
        immuneTo: []
      },
      dark: {
        weakTo: ['fighting', 'bug', 'fairy'],
        resistantTo: ['ghost', 'dark'],
        immuneTo: ['psychic']
      },
      steel: {
        weakTo: ['fire', 'fighting', 'ground'],
        resistantTo: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'],
        immuneTo: ['poison']
      },
      fairy: {
        weakTo: ['poison', 'steel'],
        resistantTo: ['fighting', 'bug', 'dark'],
        immuneTo: ['dragon']
      }
    };
    
    // Initialize analysis
    const analysis: TeamAnalysis = {
      weaknesses: {},
      resistances: {},
      immunities: [],
      types: {}
    };
    
    // Analyze each team member
    team.forEach(member => {
      const { primaryType, secondaryType } = member.pokemon;
      
      // Count types in the team
      analysis.types[primaryType] = (analysis.types[primaryType] || 0) + 1;
      if (secondaryType) {
        analysis.types[secondaryType] = (analysis.types[secondaryType] || 0) + 1;
      }
      
      // Get type interactions for primary type
      const primaryTypeData = typeChart[primaryType.toLowerCase()];
      
      // Get type interactions for secondary type (if any)
      const secondaryTypeData = secondaryType ? 
        typeChart[secondaryType.toLowerCase()] : null;
      
      // Calculate weaknesses, resistances, and immunities
      if (primaryTypeData) {
        primaryTypeData.weakTo.forEach(type => {
          // If secondary type is immune, pokemon isn't weak to this type
          if (secondaryTypeData && secondaryTypeData.immuneTo.includes(type)) {
            return;
          }
          // If secondary type resists, it cancels out weakness
          if (secondaryTypeData && secondaryTypeData.resistantTo.includes(type)) {
            return;
          }
          analysis.weaknesses[type] = (analysis.weaknesses[type] || 0) + 1;
        });
        
        primaryTypeData.resistantTo.forEach(type => {
          // If secondary type is weak, it cancels out resistance
          if (secondaryTypeData && secondaryTypeData.weakTo.includes(type)) {
            return;
          }
          analysis.resistances[type] = (analysis.resistances[type] || 0) + 1;
        });
        
        primaryTypeData.immuneTo.forEach(type => {
          if (!analysis.immunities.includes(type)) {
            analysis.immunities.push(type);
          }
        });
      }
      
      if (secondaryTypeData) {
        secondaryTypeData.weakTo.forEach(type => {
          // If primary type is immune, pokemon isn't weak to this type
          if (primaryTypeData.immuneTo.includes(type)) {
            return;
          }
          // If primary type resists, it cancels out weakness
          if (primaryTypeData.resistantTo.includes(type)) {
            return;
          }
          analysis.weaknesses[type] = (analysis.weaknesses[type] || 0) + 1;
        });
        
        secondaryTypeData.resistantTo.forEach(type => {
          // If primary type is weak, it cancels out resistance
          if (primaryTypeData.weakTo.includes(type)) {
            return;
          }
          analysis.resistances[type] = (analysis.resistances[type] || 0) + 1;
        });
        
        secondaryTypeData.immuneTo.forEach(type => {
          if (!analysis.immunities.includes(type)) {
            analysis.immunities.push(type);
          }
        });
      }
    });
    
    return analysis;
  };
  
  // Calculate analysis if team has members
  const teamAnalysis = team.length > 0 ? analyzeTeam() : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Team Builder</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pokemon Selection Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-bold mb-4">Pokémon Selection</h2>
              
              {/* Search and Filters */}
              <div className="mb-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search by name or number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Select
                      value={selectedGeneration}
                      onValueChange={setSelectedGeneration}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Generation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Generations</SelectItem>
                        {generations.map(gen => (
                          <SelectItem key={gen} value={gen}>Generation {gen}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {types.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Pokemon List */}
              <div className="h-96 overflow-y-auto border rounded-md p-2">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <p>Loading Pokémon...</p>
                  </div>
                ) : filteredPokemon.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <p>No Pokémon found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                    {filteredPokemon.map(pokemon => (
                      <div 
                        key={pokemon.id} 
                        className="flex items-center p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => addToTeam(pokemon)}
                      >
                        <img 
                          src={pokemon.normalSprite} 
                          alt={pokemon.name} 
                          className="w-10 h-10 mr-2"
                        />
                        <div className="flex-grow">
                          <div className="text-sm font-medium">{pokemon.name}</div>
                          <div className="flex mt-1 space-x-1">
                            <TypeBadge type={pokemon.primaryType} small />
                            {pokemon.secondaryType && <TypeBadge type={pokemon.secondaryType} small />}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="ml-auto">
                          <Plus size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Team Display and Analysis Panel */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="team">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="saved">Saved Teams</TabsTrigger>
              </TabsList>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={clearTeam}>
                  <Trash className="mr-1 h-4 w-4" />
                  Clear
                </Button>
                <Button variant="outline" size="sm" onClick={saveTeam}>
                  <Save className="mr-1 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
            
            <TabsContent value="team" className="space-y-4">
              <h2 className="text-xl font-bold">{teamName}</h2>
              
              {/* Team Members */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(slot => {
                  const member = team.find(m => m.slot === slot);
                  
                  return (
                    <Card key={slot} className={`${!member ? 'border-dashed' : ''}`}>
                      <CardContent className="p-4 flex">
                        {member ? (
                          <>
                            <div className="flex-grow flex items-center">
                              <img 
                                src={member.pokemon.normalSprite} 
                                alt={member.pokemon.name} 
                                className="w-16 h-16 mr-3"
                              />
                              <div>
                                <h3 className="font-medium">{member.pokemon.name}</h3>
                                <div className="flex mt-1 space-x-1">
                                  <TypeBadge type={member.pokemon.primaryType} small />
                                  {member.pokemon.secondaryType && 
                                    <TypeBadge type={member.pokemon.secondaryType} small />
                                  }
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeFromTeam(slot)}
                              className="h-8 w-8 ml-2 self-start"
                            >
                              <X size={16} />
                            </Button>
                          </>
                        ) : (
                          <div className="h-16 w-full flex items-center justify-center text-gray-400">
                            Empty Slot
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="analysis">
              {team.length === 0 ? (
                <div className="text-center py-8">
                  <p>Add Pokémon to your team to see analysis</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Type Coverage */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Type Coverage</h3>
                    <div className="flex flex-wrap gap-2">
                      {types.map(type => (
                        <div 
                          key={type} 
                          className="relative"
                        >
                          <TypeBadge type={type} />
                          {teamAnalysis?.types[type] && (
                            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                              {teamAnalysis.types[type]}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Weaknesses */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Team Weaknesses</h3>
                    {Object.keys(teamAnalysis?.weaknesses || {}).length === 0 ? (
                      <p>No common weaknesses found</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(teamAnalysis!.weaknesses)
                          .sort((a, b) => b[1] - a[1])
                          .map(([type, count]) => (
                            <div key={type} className="relative">
                              <TypeBadge type={type} />
                              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                                {count}
                              </Badge>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                  
                  {/* Resistances */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Team Resistances</h3>
                    {Object.keys(teamAnalysis?.resistances || {}).length === 0 ? (
                      <p>No common resistances found</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(teamAnalysis!.resistances)
                          .sort((a, b) => b[1] - a[1])
                          .map(([type, count]) => (
                            <div key={type} className="relative">
                              <TypeBadge type={type} />
                              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-green-500">
                                {count}
                              </Badge>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                  
                  {/* Immunities */}
                  {teamAnalysis?.immunities.length ? (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Team Immunities</h3>
                      <div className="flex flex-wrap gap-2">
                        {teamAnalysis.immunities.map(type => (
                          <TypeBadge key={type} type={type} />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="saved">
              {Object.keys(savedTeams).length === 0 ? (
                <div className="text-center py-8">
                  <p>No saved teams yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(savedTeams).map(([name, teamData]) => (
                    <Card key={name}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{name}</h3>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => loadTeam(name)}
                            >
                              Load
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteTeam(name)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {teamData.map(member => (
                            <div 
                              key={member.pokemon.id} 
                              className="flex items-center p-1 border rounded"
                            >
                              <img 
                                src={member.pokemon.normalSprite} 
                                alt={member.pokemon.name}
                                className="w-8 h-8"
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TeamBuilder;