import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import FeatureButton from '@/components/home/feature-button';
import FeaturedTrainers from '@/components/home/featured-trainers';

const Home: React.FC = () => {
  const features = [
    { name: 'PokéDex', icon: 'book', description: 'Browse all Pokémon with detailed information', link: '/pokedex' },
    { name: 'Team Builder', icon: 'users', description: 'Create and analyze Pokémon teams', link: '/team-builder' },
    { name: 'Abilities', icon: 'bolt', description: 'Learn about Pokémon abilities and effects', link: '/abilities' },
    { name: 'Moves', icon: 'fist-raised', description: 'Comprehensive move database and analysis', link: '/moves' },
    { name: 'Type Chart', icon: 'table', description: 'Type effectiveness and weakness charts', link: '/type-chart' },
    { name: 'Items', icon: 'shopping-bag', description: 'Item database with effects and usage', link: '/items' },
    { name: 'Locations', icon: 'map-marker-alt', description: 'Pokémon habitats and finding locations', link: '/locations' },
    { name: 'Gym Leaders', icon: 'trophy', description: 'Information about gym leaders and Elite Four', link: '/gym-leaders' },
    { name: 'Account', icon: 'user', description: 'Manage your account and saved teams', link: '/account' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome to PokéDex Pro</h1>
        <p className="text-lg text-gray-600">Your comprehensive Pokémon database and analysis tool</p>
      </header>
      
      {/* Feature Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureButton key={index} feature={feature} />
        ))}
      </div>
    </div>
  );
};

export default Home;
