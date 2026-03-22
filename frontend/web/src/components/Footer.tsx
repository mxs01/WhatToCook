import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-outline-variant/20 bg-surface-container-low/70 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-12 py-8 w-full gap-6">
        <div className="font-serif italic text-primary text-xl font-bold opacity-80">
          WhatToCook.
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <Link className="font-sans flex items-center text-xs tracking-wide uppercase text-secondary/70 hover:text-primary transition-colors" to="/impressum">Impressum</Link>
          <Link className="font-sans flex items-center text-xs tracking-wide uppercase text-secondary/70 hover:text-primary transition-colors" to="#">Privacy Policy</Link>
          <Link className="font-sans flex items-center text-xs tracking-wide uppercase text-secondary/70 hover:text-primary transition-colors" to="#">Terms of Service</Link>
          <Link className="font-sans flex items-center text-xs tracking-wide uppercase text-secondary/70 hover:text-primary transition-colors" to="/contact">Contact</Link>
        </div>
        <div className="font-sans text-xs tracking-wide uppercase text-secondary/60 border-t md:border-t-0 border-outline-variant/10 pt-4 md:pt-0">
          © 2024 WhatToCook. The Digital Epicurean.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
