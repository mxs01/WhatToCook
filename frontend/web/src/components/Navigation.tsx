import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 glass px-10 py-6 flex justify-between items-center">
      <Link to="/" className="text-3xl font-serif text-primary hover:opacity-80 transition-opacity">
        WhatToCook
      </Link>
      <div className="flex gap-8 items-center font-sans tracking-wide">
        <Link to="/#gallery" className="text-on-surface-variant hover:text-primary transition-colors">Recipes</Link>
        <Link to="/scan" className="text-on-surface-variant hover:text-primary transition-colors">Scan Fridge</Link>
        <Link to="/login" className="px-6 py-2 rounded-full primary-gradient font-medium cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
