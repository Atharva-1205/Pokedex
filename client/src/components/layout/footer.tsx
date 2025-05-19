import React from 'react';
import { Link } from 'wouter';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 mr-3 bg-white rounded-full flex items-center justify-center">
                <div className="h-6 w-6 bg-primary rounded-full border-2 border-gray-900"></div>
              </div>
              <h2 className="text-xl font-bold">PokéDex Pro</h2>
            </div>
            <p className="text-gray-400 max-w-md">Your comprehensive Pokémon database and team building tool with detailed information on all Pokémon, moves, abilities, and more.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-3">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/pokedex"><a className="hover:text-white transition duration-200">PokéDex</a></Link></li>
                <li><Link href="/team-builder"><a className="hover:text-white transition duration-200">Team Builder</a></Link></li>
                <li><Link href="/moves"><a className="hover:text-white transition duration-200">Move Database</a></Link></li>
                <li><Link href="/type-chart"><a className="hover:text-white transition duration-200">Type Chart</a></Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition duration-200">API</a></li>
                <li><a href="#" className="hover:text-white transition duration-200">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition duration-200">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition duration-200">About Us</a></li>
                <li><a href="#" className="hover:text-white transition duration-200">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition duration-200">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition duration-200">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} PokéDex Pro. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition duration-200">
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-200">
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-200">
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-200">
              <i className="fab fa-github text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
