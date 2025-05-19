import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('pokemonFavorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Error parsing favorites from localStorage', e);
        localStorage.removeItem('pokemonFavorites');
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (pokemonName: string) => {
    setFavorites(prev => {
      if (prev.includes(pokemonName)) {
        return prev.filter(name => name !== pokemonName);
      } else {
        return [...prev, pokemonName];
      }
    });
  };

  const isFavorite = (pokemonName: string) => {
    return favorites.includes(pokemonName);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite
  };
}
