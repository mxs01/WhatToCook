import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center -mt-20 px-4">
      <div className="w-full max-w-md bg-surface-container-lowest p-10 rounded-xl shadow-[0_20px_40px_rgba(26,28,28,0.06)] border border-outline-variant/15 text-center">
        <h1 className="text-4xl font-serif text-primary mb-2">Welcome Back</h1>
        <p className="text-secondary font-sans mb-8">Access your curated culinary journey.</p>
        
        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface-container-highest rounded-full px-6 py-4 font-sans text-sm outline-none placeholder:text-secondary focus:ring-2 focus:ring-primary/20"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-surface-container-highest rounded-full px-6 py-4 font-sans text-sm outline-none placeholder:text-secondary focus:ring-2 focus:ring-primary/20"
          />
          <button type="submit" className="w-full py-4 rounded-full primary-gradient font-medium shadow-md hover:shadow-lg transition-shadow mt-4">
            Sign In
          </button>
        </form>

        <p className="mt-8 text-on-surface-variant font-sans text-sm">
          Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Register now</Link>
        </p>
      </div>
    </div>
  );
}
