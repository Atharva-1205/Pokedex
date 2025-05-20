import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface Item {
  Name: string;
  Category: string;
  Effect: string;
}

const Items: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Fetch items data
  const { data: items, isLoading } = useQuery({
    queryKey: ['/api/items'],
    queryFn: async () => {
      try {
        const res = await fetch('/Items.json');
        if (!res.ok) {
          throw new Error(`Failed to fetch items: ${res.status}`);
        }
        const data = await res.json();
        return data as Item[];
      } catch (error) {
        console.error("Error fetching items:", error);
        return [] as Item[];
      }
    }
  });

  // Get unique categories
  const categories = items 
    ? Array.from(new Set(items.map(item => item.Category))).sort() 
    : [];

  // Filter items based on search and category
  const filteredItems = items?.filter(item => {
    const matchesSearch = item.Name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? item.Category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pokémon Items</h1>
      
      {/* Search bar */}
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
      
      {/* Category filter */}
      <div className="mb-6">
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items list */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">All Items</h2>
          {isLoading ? (
            <p>Loading items...</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 max-h-[600px] overflow-y-auto pr-2">
              {filteredItems.map((item) => (
                <Button
                  key={item.Name}
                  variant={selectedItem?.Name === item.Name ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setSelectedItem(item)}
                >
                  {item.Name.trim()}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {/* Item details */}
        <div className="md:col-span-2">
          {selectedItem ? (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-2">{selectedItem.Name.trim()}</h2>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p>{selectedItem.Category}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Effect</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedItem.Effect}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <p className="text-gray-500">Select an item to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Items;