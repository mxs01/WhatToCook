import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full overflow-hidden min-h-[calc(100vh-80px)] bg-surface text-on-surface font-body selection:bg-primary-fixed">
      {/* Visual Section: The Editorial Frame */}
      <section className="hidden md:flex md:w-7/12 lg:w-3/5 relative bg-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Artisanal pasta with dark herbs and moody lighting" 
            className="w-full h-full object-cover opacity-80 scale-105" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv4s-FOvBSrpHv2m072prP5yVcDWu0fPQRvyNtjEeEol70lnWoRI4cnNxjOGCL4Ps82Y0BMBhOrAROQblaNOr__qnLTk4LEq_tVSDcN4NLvN0aNbVzCmyC59v6ZeLuRDiPY7IGi0MwY9YTttD9sj88VwZqgi9GrcFcAJGQqlD8q_cr_P4XYeYQLLsWeS20_CmdAz6yL9t5QYmYo49X15604L5-3Q2MEtvmHUR7jk3HH8LIYr_G6iJbKK1sZPV3xnV2AXB5fOaw-U6D"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent"></div>
        </div>
        
        {/* Floating Brand Anchor */}
        <div className="relative z-10 p-16 flex flex-col justify-end h-full w-full pt-32">
          <div className="max-w-md">
            <h2 className="font-serif text-5xl lg:text-7xl text-white leading-[1.1] mb-8 tracking-tight">
              The Art of <br/><span className="italic">Curation.</span>
            </h2>
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-on-primary-container font-light">
              Elevating your daily culinary ritual with AI precision and bespoke editorial flair.
            </p>
          </div>
        </div>
      </section>

      {/* Functional Section: The Login Canvas */}
      <section className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 lg:p-24 bg-surface min-h-[calc(100vh-80px)] pt-32">
        <div className="w-full max-w-[400px]">
          <header className="mb-12">
            <h1 className="font-serif text-4xl text-on-surface mb-3">Welcome Back</h1>
            <p className="text-secondary font-sans">Enter your credentials to access your digital cellar.</p>
          </header>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="space-y-2">
              <label 
                className="font-sans text-xs uppercase tracking-widest text-on-surface-variant font-semibold px-2" 
                htmlFor="email"
              >
                Email Address
              </label>
              <input 
                className="w-full bg-surface-container-highest border-none rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-primary-container transition-all text-on-surface placeholder:text-outline-variant font-sans" 
                id="email" 
                placeholder="epicurean@studio.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label 
                  className="font-sans text-xs uppercase tracking-widest text-on-surface-variant font-semibold" 
                  htmlFor="password"
                >
                  Password
                </label>
                <a className="text-xs font-sans uppercase tracking-widest text-on-primary-container hover:text-primary transition-colors" href="#">
                  Forgot?
                </a>
              </div>
              <input 
                className="w-full bg-surface-container-highest border-none rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-primary-container transition-all text-on-surface placeholder:text-outline-variant font-sans" 
                id="password" 
                placeholder="••••••••" 
                type="password"
              />
            </div>

            {/* CTA Section */}
            <div className="pt-4 space-y-8">
              <button 
                className="w-full py-5 rounded-full text-white font-sans text-sm uppercase tracking-[0.2em] font-bold shadow-xl shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all bg-gradient-to-tr from-primary to-primary-container" 
                type="submit"
              >
                Sign In
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/30"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span className="bg-surface px-4 text-outline font-sans">or</span>
                </div>
              </div>

              <div className="text-center font-sans">
                <p className="text-secondary text-sm">
                  New to the studio? 
                  <Link to="/register" className="text-primary font-semibold underline decoration-primary/20 underline-offset-8 ml-1 hover:decoration-primary transition-all">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Minimalist Footer for Login */}
        <footer className="mt-24 md:mt-32 w-full max-w-[400px]">
          <div className="flex justify-between items-center text-[10px] font-sans uppercase tracking-widest text-outline">
            <span>© 2024 WhatToCook</span>
            <div className="flex gap-4">
              <a className="hover:text-on-surface transition-colors" href="#">Privacy</a>
              <a className="hover:text-on-surface transition-colors" href="#">Terms</a>
            </div>
          </div>
        </footer>
      </section>

      {/* Floating AI Suggestion Chip (from HTML) */}
      <div className="fixed bottom-8 right-8 hidden lg:flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/15 p-2 pr-6 rounded-full shadow-2xl">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        </div>
        <span className="font-sans text-xs uppercase tracking-widest text-secondary font-medium">Curating your experience...</span>
      </div>
    </div>
  );
}
