import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const getLinkClasses = ({ isActive }: { isActive: boolean }) => 
    isActive 
      ? "text-primary font-bold border-b-2 border-primary pb-1" 
      : "text-secondary font-medium border-b-2 border-transparent pb-1 hover:text-primary transition-colors";

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4 w-full">
        <div className="font-serif text-3xl font-extrabold tracking-tighter text-primary">
          <Link to="/">WhatToCook</Link>
        </div>
        {isAuthenticated && (
          <div className="hidden md:flex gap-10 items-center">
            <NavLink to="/" end className={getLinkClasses}>Home</NavLink>
            <NavLink to="/scan" className={getLinkClasses}>Scanner</NavLink>
            <NavLink to="/gallery" className={getLinkClasses}>Recipes</NavLink>
            <NavLink to="/settings" className={getLinkClasses}>About</NavLink>
          </div>
        )}
        <div className="flex items-center gap-6">
          {isAuthenticated && (
            <button className="text-secondary hover:opacity-80 transition-opacity duration-300">
              <span className="material-symbols-outlined">search</span>
            </button>
          )}
          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              className="bg-surface-container-highest text-secondary border border-outline-variant/20 px-6 py-2 rounded-full font-medium hover:opacity-90 transition-all duration-150 ease-in-out"
            >
              Sign Out
            </button>
          ) : (
            <Link to="/login" className="bg-primary text-on-primary px-6 py-2 rounded-full font-medium hover:opacity-90 transition-all active:scale-95 duration-150 ease-in-out">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
