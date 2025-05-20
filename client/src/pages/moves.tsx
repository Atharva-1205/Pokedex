import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import TypeBadge from '@/components/pokemon/type-badge';

interface Move {
  Name: string;
  Type: string;
  Category: string;
  Power: string;
  Accuracy: string;
  PP: string;
  Effect: string;
  "Probability (%)": string;
}

const Moves: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);

  // Fetch moves data
  const { data: moves, isLoading } = useQuery({
    queryKey: ['/api/moves'],
    queryFn: async () => {
      try {
        const res = await fetch('/Moves.json');
        if (!res.ok) {
          throw new Error(`Failed to fetch moves: ${res.status}`);
        }
        const data = await res.json();
        return data as Move[];
      } catch (error) {
        console.error("Error fetching moves:", error);
        return [] as Move[];
      }
    }
  });

  // Get unique types and categories
  const types = moves ? Array.from(new Set(moves.map(move => move.Type))).sort() : [];
  const categories = moves ? Array.from(new Set(moves.map(move => move.Category))).sort() : [];

  // Filter moves based on search, type, and category
  const filteredMoves = moves?.filter(move => {
    const matchesSearch = move.Name.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType ? move.Type === selectedType : true;
    const matchesCategory = selectedCategory ? move.Category === selectedCategory : true;
    return matchesSearch && matchesType && matchesCategory;
  }) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pokémon Moves</h1>
      
      {/* Search bar */}
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder="Search moves..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-medium mb-2">Type</h3>
          <div className="flex flex-wrap gap-1">
            {selectedType && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedType(null)}
                className="mb-1"
              >
                Clear
              </Button>
            )}
            {types.map(type => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type === selectedType ? null : type)}
                className="mb-1"
              >
                <TypeBadge type={type} small />
              </Button>
            ))}
          </div>
        </div>
        
        <div className="ml-4">
          <h3 className="text-sm font-medium mb-2">Category</h3>
          <div className="flex flex-wrap gap-1">
            {selectedCategory && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedCategory(null)}
                className="mb-1"
              >
                Clear
              </Button>
            )}
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                className="mb-1"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Moves list */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">All Moves</h2>
          {isLoading ? (
            <p>Loading moves...</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 max-h-[600px] overflow-y-auto pr-2">
              {filteredMoves.map((move) => (
                <Button
                  key={move.Name}
                  variant={selectedMove?.Name === move.Name ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setSelectedMove(move)}
                >
                  {move.Name}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {/* Move details */}
        <div className="md:col-span-2">
          {selectedMove ? (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-2">{selectedMove.Name}</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Type</h3>
                    <TypeBadge type={selectedMove.Type} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p>{selectedMove.Category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Power</h3>
                    <p>{selectedMove.Power}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Accuracy</h3>
                    <p>{selectedMove.Accuracy}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">PP</h3>
                    <p>{selectedMove.PP}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Probability</h3>
                    <p>{selectedMove["Probability (%)"]}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Effect</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedMove.Effect}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <p className="text-gray-500">Select a move to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Moves;