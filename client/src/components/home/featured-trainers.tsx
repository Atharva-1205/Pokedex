import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import TypeBadge from '@/components/pokemon/type-badge';

const FeaturedTrainers: React.FC = () => {
  const trainers = [
    {
      name: 'Sophia',
      specialty: 'Electric Type Specialist',
      types: ['Electric'],
      image: 'https://pixabay.com/get/g3fa94deaf1f11206c693a366501140f90336341610eb89065f5d033d5717d407c361de3552457ad47b5d103cbc9d8e407369c41b053a6a227a21a05cf3e7d77a_1280.jpg'
    },
    {
      name: 'Marcus',
      specialty: 'Fire Type Master',
      types: ['Fire'],
      image: 'https://pixabay.com/get/g2e02263970c3da2ed389edc2e5948ec3484631938b80b5022a347542871bd40bd6873172fcecdc6b617dd18c06a30097b86f0b0818b3078691a991b774fa1f73_1280.jpg'
    },
    {
      name: 'Marina',
      specialty: 'Water Type Expert',
      types: ['Water'],
      image: 'https://pixabay.com/get/g388312eb75d2f1bfdce20228a209411719f86b0e70026f3eb850b9fbc7fa3f1ec03b4e5ed272166ee070190ad74f4590bad0fe4aa8272497e37e25fc75cf0f9a_1280.jpg'
    },
    {
      name: 'Prof. Oak',
      specialty: 'Pokémon Researcher',
      types: ['Normal', 'Psychic'],
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300'
    }
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Featured Trainers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {trainers.map((trainer, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="h-48 w-full overflow-hidden">
              <img 
                src={trainer.image} 
                alt={`${trainer.name} - ${trainer.specialty}`} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg">{trainer.name}</h3>
              <p className="text-sm text-gray-600">{trainer.specialty}</p>
              <div className="mt-2 flex space-x-1">
                {trainer.types.map(type => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturedTrainers;
