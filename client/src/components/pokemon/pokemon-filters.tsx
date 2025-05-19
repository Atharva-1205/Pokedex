import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import TypeBadge from '@/components/pokemon/type-badge';
import type { PokemonFilters } from '@/types/pokemon';

interface PokemonFiltersProps {
  isVisible: boolean;
  onClose: () => void;
  filters: PokemonFilters;
  updateFilter: (key: keyof PokemonFilters, value: any) => void;
  resetFilters: () => void;
}

const PokemonFiltersComponent: React.FC<PokemonFiltersProps> = ({ 
  isVisible, 
  onClose, 
  filters, 
  updateFilter, 
  resetFilters 
}) => {
  const generations = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  const types = [
    'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison',
    'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark',
    'Steel', 'Fairy'
  ];
  
  const eggGroups = [
    'Monster', 'Human-Like', 'Water 1', 'Water 2', 'Water 3', 'Bug',
    'Mineral', 'Flying', 'Amorphous', 'Field', 'Fairy', 'Ditto', 'Dragon', 'Undiscovered'
  ];

  if (!isVisible) return null;

  const handleGenClick = (gen: string) => {
    if (filters.generation.includes(gen)) {
      updateFilter('generation', filters.generation.filter(g => g !== gen));
    } else {
      updateFilter('generation', [...filters.generation, gen]);
    }
  };

  const handleTypeClick = (type: string) => {
    if (filters.types.includes(type)) {
      updateFilter('types', filters.types.filter(t => t !== type));
    } else {
      updateFilter('types', [...filters.types, type]);
    }
  };

  const mobileFilters = (
    <div className="fixed inset-0 bg-background z-50 lg:hidden flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-bold text-lg">Advanced Filters</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X />
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {/* Mobile filters content - same as desktop but with scrollable area */}
        {/* Dex Filter */}
        <div className="mb-4">
          <Label className="font-medium mb-2">PokéDex</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="National Dex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="national">National Dex</SelectItem>
              <SelectItem value="kanto">Kanto Dex</SelectItem>
              <SelectItem value="johto">Johto Dex</SelectItem>
              <SelectItem value="hoenn">Hoenn Dex</SelectItem>
              <SelectItem value="sinnoh">Sinnoh Dex</SelectItem>
              <SelectItem value="unova">Unova Dex</SelectItem>
              <SelectItem value="kalos">Kalos Dex</SelectItem>
              <SelectItem value="alola">Alola Dex</SelectItem>
              <SelectItem value="galar">Galar Dex</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Generation Filter */}
        <div className="mb-4">
          <Label className="font-medium mb-2">Generation</Label>
          <div className="grid grid-cols-3 gap-2">
            {generations.map(gen => (
              <Button
                key={gen} 
                variant={filters.generation.includes(gen) ? "default" : "outline"}
                className={filters.generation.includes(gen) ? "bg-primary text-white" : ""}
                onClick={() => handleGenClick(gen)}
              >
                Gen {gen}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Type Filter */}
        <div className="mb-4">
          <Label className="font-medium mb-2">Type</Label>
          <div className="grid grid-cols-3 gap-2">
            {types.map(type => (
              <Button
                key={type}
                variant="outline"
                className={`justify-center ${filters.types.includes(type) ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                onClick={() => handleTypeClick(type)}
              >
                <TypeBadge type={type} small />
              </Button>
            ))}
          </div>
        </div>
        
        {/* Special Forms Filter */}
        <div className="mb-4">
          <Label className="font-medium mb-2">Special Forms</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mega-mobile" 
                checked={filters.showMega}
                onCheckedChange={() => updateFilter('showMega', !filters.showMega)}
              />
              <Label htmlFor="mega-mobile">Mega Evolutions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="regional-mobile" 
                checked={filters.showRegionalVariants}
                onCheckedChange={() => updateFilter('showRegionalVariants', !filters.showRegionalVariants)}
              />
              <Label htmlFor="regional-mobile">Regional Forms</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="alternate-mobile" 
                checked={filters.showAlternateForms}
                onCheckedChange={() => updateFilter('showAlternateForms', !filters.showAlternateForms)}
              />
              <Label htmlFor="alternate-mobile">Alternate Forms</Label>
            </div>
          </div>
        </div>
        
        {/* Egg Group Filter */}
        <div className="mb-4">
          <Label className="font-medium mb-2">Egg Group</Label>
          <Select 
            value={filters.eggGroups[0] || "all"}
            onValueChange={(value) => updateFilter('eggGroups', value && value !== "all" ? [value] : [])}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Egg Groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Egg Groups</SelectItem>
              {eggGroups.map(group => (
                <SelectItem key={group} value={group}>{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="p-4 border-t flex gap-2">
        <Button className="flex-1" onClick={() => { resetFilters(); onClose(); }}>
          Reset
        </Button>
        <Button className="flex-1" variant="default" onClick={onClose}>
          Apply
        </Button>
      </div>
    </div>
  );

  const desktopFilters = (
    <div className="hidden lg:block lg:w-1/4 sticky top-24 h-fit">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-bold text-lg mb-4">Advanced Filters</h3>
          
          {/* Dex Filter */}
          <div className="mb-4">
            <Label className="font-medium mb-2">PokéDex</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="National Dex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="national">National Dex</SelectItem>
                <SelectItem value="kanto">Kanto Dex</SelectItem>
                <SelectItem value="johto">Johto Dex</SelectItem>
                <SelectItem value="hoenn">Hoenn Dex</SelectItem>
                <SelectItem value="sinnoh">Sinnoh Dex</SelectItem>
                <SelectItem value="unova">Unova Dex</SelectItem>
                <SelectItem value="kalos">Kalos Dex</SelectItem>
                <SelectItem value="alola">Alola Dex</SelectItem>
                <SelectItem value="galar">Galar Dex</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Generation Filter */}
          <div className="mb-4">
            <Label className="font-medium mb-2">Generation</Label>
            <div className="grid grid-cols-3 gap-2">
              {generations.map(gen => (
                <Button
                  key={gen} 
                  variant={filters.generation.includes(gen) ? "default" : "outline"}
                  className={filters.generation.includes(gen) ? "bg-primary text-white" : ""}
                  onClick={() => handleGenClick(gen)}
                  size="sm"
                >
                  Gen {gen}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Type Filter */}
          <div className="mb-4">
            <Label className="font-medium mb-2">Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {types.map(type => (
                <Button
                  key={type}
                  variant="outline"
                  className={`justify-center ${filters.types.includes(type) ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  onClick={() => handleTypeClick(type)}
                  size="sm"
                >
                  <TypeBadge type={type} small />
                </Button>
              ))}
            </div>
          </div>
          
          {/* Special Forms Filter */}
          <div className="mb-4">
            <Label className="font-medium mb-2">Special Forms</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="mega" 
                  checked={filters.showMega}
                  onCheckedChange={() => updateFilter('showMega', !filters.showMega)}
                />
                <Label htmlFor="mega">Mega Evolutions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="regional" 
                  checked={filters.showRegionalVariants}
                  onCheckedChange={() => updateFilter('showRegionalVariants', !filters.showRegionalVariants)}
                />
                <Label htmlFor="regional">Regional Forms</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="alternate" 
                  checked={filters.showAlternateForms}
                  onCheckedChange={() => updateFilter('showAlternateForms', !filters.showAlternateForms)}
                />
                <Label htmlFor="alternate">Alternate Forms</Label>
              </div>
            </div>
          </div>
          
          {/* Egg Group Filter */}
          <div className="mb-4">
            <Label className="font-medium mb-2">Egg Group</Label>
            <Select 
              value={filters.eggGroups[0] || "all"}
              onValueChange={(value) => updateFilter('eggGroups', value && value !== "all" ? [value] : [])}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Egg Groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Egg Groups</SelectItem>
                {eggGroups.map(group => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="default" 
              className="flex-1"
              onClick={resetFilters}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      {desktopFilters}
      {mobileFilters}
    </>
  );
};

export default PokemonFiltersComponent;
