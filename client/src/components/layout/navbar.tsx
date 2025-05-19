import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'PokéDex', path: '/pokedex' },
    { name: 'Team Builder', path: '/team-builder' },
    { name: 'Account', path: '/account' }
  ];

  return (
    <nav className={`bg-primary text-white shadow-md sticky top-0 z-50 transition-all ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 mr-3 bg-white rounded-full flex items-center justify-center">
            <div className="h-6 w-6 bg-primary rounded-full border-2 border-gray-900"></div>
          </div>
          <Link href="/">
            <a className="text-2xl font-bold">PokéDex Pro</a>
          </Link>
        </div>
        
        <div className="flex items-center md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
        
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row w-full md:w-auto md:items-center md:space-x-6 mt-3 md:mt-0`}>
          {navLinks.map((link, index) => (
            <Link key={index} href={link.path}>
              <a className={`py-2 md:py-0 hover:text-yellow-300 transition duration-200 ${location === link.path ? 'text-yellow-300' : ''}`}>
                {link.name}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
