import React from 'react';
import { Link } from 'wouter';

interface FeatureProps {
  feature: {
    name: string;
    icon: string;
    description: string;
    link: string;
  };
}

const FeatureButton: React.FC<FeatureProps> = ({ feature }) => {
  return (
    <div className="pokeball-button">
      <Link href={feature.link}>
        <a className="block p-6 text-center h-full">
          <div className="bg-white p-2 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <i className={`fas fa-${feature.icon} text-primary text-3xl`}></i>
          </div>
          <h3 className="text-xl font-bold mb-2">{feature.name}</h3>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </a>
      </Link>
    </div>
  );
};

export default FeatureButton;
