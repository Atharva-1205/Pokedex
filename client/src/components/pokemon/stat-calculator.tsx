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
    <div>
      <h3 className="font-bold text-lg mb-3">Stat Calculator</h3>
      
      <div className="space-y-4">
        <div className="space-y-1">
          <Label>Level: {calculatorState.level}</Label>
          <Slider 
            min={1} 
            max={100} 
            step={1} 
            value={[calculatorState.level]} 
            onValueChange={([value]) => setCalculatorState(prev => ({ ...prev, level: value }))}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <Label>Nature</Label>
            <Select 
              value={calculatorState.nature} 
              onValueChange={(value) => setCalculatorState(prev => ({ ...prev, nature: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Nature" />
              </SelectTrigger>
              <SelectContent>
                {natures?.map((nature) => (
                  <SelectItem key={nature.nature} value={nature.nature}>
                    {nature.nature} 
                    {nature.increases !== nature.decreases && 
                      `(+${nature.increases}, -${nature.decreases})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Ability</Label>
            <Select defaultValue={pokemon.abilityI}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={pokemon.abilityI}>{pokemon.abilityI}</SelectItem>
                {pokemon.abilityII && (
                  <SelectItem value={pokemon.abilityII}>{pokemon.abilityII}</SelectItem>
                )}
                {pokemon.hiddenAbility && (
                  <SelectItem value={pokemon.hiddenAbility}>{pokemon.hiddenAbility} (Hidden)</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label className="mb-2 block">IVs (0-31)</Label>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {Object.entries(calculatorState.ivs).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs">{formatStatName(key)}</span>
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
                  className="w-16 px-2 py-1 text-center text-sm"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="mb-2 block">EVs (0-252)</Label>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {Object.entries(calculatorState.evs).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs">{formatStatName(key)}</span>
                <Input
                  type="number"
                  min={0}
                  max={252}
                  value={value}
                  onChange={(e) => handleEVChange(key as keyof typeof calculatorState.evs, parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-center text-sm"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">EV Total:</span>
            <span className={`text-xs font-medium ${totalEVs > 510 ? 'text-red-500' : 'text-gray-700'}`}>
              {totalEVs}/510
            </span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <h4 className="text-sm font-medium mb-2">Calculated Stats</h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-100 rounded-md p-2">
              <span className="text-xs">HP</span>
              <div className="text-lg font-bold">{finalStats.hp}</div>
            </div>
            <div className="bg-gray-100 rounded-md p-2">
              <span className="text-xs">Attack</span>
              <div className="text-lg font-bold">{finalStats.attack}</div>
            </div>
            <div className="bg-gray-100 rounded-md p-2">
              <span className="text-xs">Defense</span>
              <div className="text-lg font-bold">{finalStats.defense}</div>
            </div>
            <div className="bg-gray-100 rounded-md p-2">
              <span className="text-xs">Sp. Atk</span>
              <div className="text-lg font-bold">{finalStats.specialAttack}</div>
            </div>
            <div className="bg-gray-100 rounded-md p-2">
              <span className="text-xs">Sp. Def</span>
              <div className="text-lg font-bold">{finalStats.specialDefense}</div>
            </div>
            <div className="bg-gray-100 rounded-md p-2">
              <span className="text-xs">Speed</span>
              <div className="text-lg font-bold">{finalStats.speed}</div>
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
