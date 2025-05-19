import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Pokemon, Nature, StatCalculatorState } from '@/types/pokemon';

interface StatCalculatorProps {
  pokemon: Pokemon;
}

const StatCalculator: React.FC<StatCalculatorProps> = ({ pokemon }) => {
  const [calculatorState, setCalculatorState] = useState<StatCalculatorState>({
    level: 50,
    nature: 'Adamant',
    ivs: {
      hp: 31,
      attack: 31,
      defense: 31,
      specialAttack: 31,
      specialDefense: 31,
      speed: 31
    },
    evs: {
      hp: 0,
      attack: 252,
      defense: 0,
      specialAttack: 0,
      specialDefense: 4,
      speed: 252
    }
  });

  const { data: natures } = useQuery<Nature[]>({
    queryKey: ['/api/natures'],
  });

  // Calculate the total EVs currently assigned
  const totalEVs = Object.values(calculatorState.evs).reduce((sum, ev) => sum + ev, 0);

  // Function to handle EV changes with validation
  const handleEVChange = (stat: keyof typeof calculatorState.evs, value: number) => {
    const newValue = Math.max(0, Math.min(252, value));
    const otherEVs = Object.entries(calculatorState.evs)
      .filter(([key]) => key !== stat)
      .reduce((sum, [, val]) => sum + val, 0);
    
    // Ensure we don't exceed the 510 EV limit
    if (newValue + otherEVs <= 510) {
      setCalculatorState(prev => ({
        ...prev,
        evs: {
          ...prev.evs,
          [stat]: newValue
        }
      }));
    }
  };

  // Function to calculate the final stats
  const calculateStats = () => {
    const { level, nature, ivs, evs } = calculatorState;
    const baseStats = {
      hp: parseInt(pokemon.hp),
      attack: parseInt(pokemon.attack),
      defense: parseInt(pokemon.defense),
      specialAttack: parseInt(pokemon.specialAttack),
      specialDefense: parseInt(pokemon.specialDefense),
      speed: parseInt(pokemon.speed)
    };

    // Nature modifiers
    const natureModifiers: Record<string, number> = {
      attack: 1,
      defense: 1,
      specialAttack: 1,
      specialDefense: 1,
      speed: 1
    };

    if (natures) {
      const selectedNature = natures.find(n => n.nature === nature);
      if (selectedNature) {
        if (selectedNature.increases && selectedNature.increases !== selectedNature.decreases) {
          const increaseStat = selectedNature.increases.toLowerCase().replace(/ /g, '');
          const decreaseStat = selectedNature.decreases.toLowerCase().replace(/ /g, '');
          
          // Convert stat names to match our keys
          const increaseKey = increaseStat === 'sp.atk' ? 'specialAttack' :
                              increaseStat === 'sp.def' ? 'specialDefense' :
                              increaseStat.toLowerCase();
          
          const decreaseKey = decreaseStat === 'sp.atk' ? 'specialAttack' :
                              decreaseStat === 'sp.def' ? 'specialDefense' :
                              decreaseStat.toLowerCase();
          
          if (increaseKey in natureModifiers) natureModifiers[increaseKey] = 1.1;
          if (decreaseKey in natureModifiers) natureModifiers[decreaseKey] = 0.9;
        }
      }
    }

    // HP calculation is different from other stats
    const hpStat = Math.floor(((2 * baseStats.hp + ivs.hp + Math.floor(evs.hp / 4)) * level) / 100) + level + 10;
    
    // Calculate other stats
    const finalStats = {
      hp: hpStat,
      attack: calculateOtherStat(baseStats.attack, ivs.attack, evs.attack, natureModifiers.attack),
      defense: calculateOtherStat(baseStats.defense, ivs.defense, evs.defense, natureModifiers.defense),
      specialAttack: calculateOtherStat(baseStats.specialAttack, ivs.specialAttack, evs.specialAttack, natureModifiers.specialAttack),
      specialDefense: calculateOtherStat(baseStats.specialDefense, ivs.specialDefense, evs.specialDefense, natureModifiers.specialDefense),
      speed: calculateOtherStat(baseStats.speed, ivs.speed, evs.speed, natureModifiers.speed)
    };
    
    return finalStats;

    function calculateOtherStat(base: number, iv: number, ev: number, natureModifier: number) {
      return Math.floor((Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5) * natureModifier);
    }
  };

  const finalStats = calculateStats();

  return (
    <div className="dark:text-white">
      <h3 className="font-bold text-lg mb-3">Stat Calculator</h3>
      
      <div className="space-y-4">
        {/* Level Slider - Full Width */}
        <div className="space-y-1 w-full">
          <Label className="dark:text-white">Level: {calculatorState.level}</Label>
          <Slider 
            min={1} 
            max={100} 
            step={1} 
            value={[calculatorState.level]} 
            onValueChange={([value]) => setCalculatorState(prev => ({ ...prev, level: value }))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>1</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
        
        {/* Nature and Ability Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="dark:text-white">Nature</Label>
            <Select 
              value={calculatorState.nature} 
              onValueChange={(value) => setCalculatorState(prev => ({ ...prev, nature: value }))}
            >
              <SelectTrigger className="dark:text-white dark:border-gray-600 dark:bg-gray-700">
                <SelectValue placeholder="Select Nature" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-white">
                {natures?.map((nature) => (
                  <SelectItem key={nature.nature} value={nature.nature} className="dark:text-white dark:focus:bg-gray-700">
                    {nature.nature} 
                    {nature.increases !== nature.decreases && 
                      `(+${nature.increases}, -${nature.decreases})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="dark:text-white">Ability</Label>
            <Select defaultValue={pokemon.abilityI}>
              <SelectTrigger className="dark:text-white dark:border-gray-600 dark:bg-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-white">
                <SelectItem value={pokemon.abilityI} className="dark:text-white dark:focus:bg-gray-700">
                  {pokemon.abilityI}
                </SelectItem>
                {pokemon.abilityII && (
                  <SelectItem value={pokemon.abilityII} className="dark:text-white dark:focus:bg-gray-700">
                    {pokemon.abilityII}
                  </SelectItem>
                )}
                {pokemon.hiddenAbility && (
                  <SelectItem value={pokemon.hiddenAbility} className="dark:text-white dark:focus:bg-gray-700">
                    {pokemon.hiddenAbility} (Hidden)
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* IV and EV Tables Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* IVs */}
          <div>
            <Label className="mb-2 block dark:text-white">IVs (0-31)</Label>
            <div className="space-y-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {Object.entries(calculatorState.ivs).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm dark:text-white">{formatStatName(key)}</span>
                  <Input
                    type="number"
                    min={0}
                    max={31}
                    value={value}
                    onChange={(e) => {
                      const val = Math.max(0, Math.min(31, parseInt(e.target.value) || 0));
                      setCalculatorState(prev => ({
                        ...prev,
                        ivs: {
                          ...prev.ivs,
                          [key]: val
                        }
                      }));
                    }}
                    className="w-16 px-2 py-1 text-center text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* EVs */}
          <div>
            <Label className="mb-2 block dark:text-white">EVs (0-252)</Label>
            <div className="space-y-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {Object.entries(calculatorState.evs).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm dark:text-white">{formatStatName(key)}</span>
                  <Input
                    type="number"
                    min={0}
                    max={252}
                    value={value}
                    onChange={(e) => handleEVChange(key as keyof typeof calculatorState.evs, parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-center text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  />
                </div>
              ))}
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-300">EV Total:</span>
                <span className={`text-xs font-medium ${totalEVs > 510 ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
                  {totalEVs}/510
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Calculated Stats in a Single Row */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium mb-2 dark:text-white">Calculated Stats</h4>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-2 flex-1">
              <span className="text-xs mr-1 dark:text-gray-300">HP:</span>
              <div className="text-base font-bold dark:text-white">{finalStats.hp}</div>
            </div>
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-2 flex-1">
              <span className="text-xs mr-1 dark:text-gray-300">Atk:</span>
              <div className="text-base font-bold dark:text-white">{finalStats.attack}</div>
            </div>
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-2 flex-1">
              <span className="text-xs mr-1 dark:text-gray-300">Def:</span>
              <div className="text-base font-bold dark:text-white">{finalStats.defense}</div>
            </div>
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-2 flex-1">
              <span className="text-xs mr-1 dark:text-gray-300">SpA:</span>
              <div className="text-base font-bold dark:text-white">{finalStats.specialAttack}</div>
            </div>
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-2 flex-1">
              <span className="text-xs mr-1 dark:text-gray-300">SpD:</span>
              <div className="text-base font-bold dark:text-white">{finalStats.specialDefense}</div>
            </div>
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-2 flex-1">
              <span className="text-xs mr-1 dark:text-gray-300">Spe:</span>
              <div className="text-base font-bold dark:text-white">{finalStats.speed}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format stat names
function formatStatName(key: string): string {
  switch (key) {
    case 'hp': return 'HP';
    case 'attack': return 'Attack';
    case 'defense': return 'Defense';
    case 'specialAttack': return 'Sp. Attack';
    case 'specialDefense': return 'Sp. Defense';
    case 'speed': return 'Speed';
    default: return key;
  }
}

export default StatCalculator;
