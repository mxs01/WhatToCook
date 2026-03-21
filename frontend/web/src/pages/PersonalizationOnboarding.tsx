import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PREFERENCES = ['Vegan', 'Vegetarian', 'Pescatarian', 'Keto', 'Paleo', 'Gluten-Free', 'High Protein'];

export default function PersonalizationOnboarding() {
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggle = (pref: string) => {
    setSelected(prev => prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]);
  };

  return (
    <div className="min-h-screen bg-surface pt-32 pb-20 px-8 flex justify-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-5xl font-serif text-primary mb-6">Tell us your tastes.</h1>
        <p className="font-sans text-secondary text-lg mb-12">
          Select any dietary preferences or restrictions. Our AI will curate recipes perfectly suited for you.
        </p>

        <div className="flex flex-wrap gap-4 mb-16">
          {PREFERENCES.map(pref => {
            const isSelected = selected.includes(pref);
            return (
              <button
                key={pref}
                onClick={() => toggle(pref)}
                className={`px-8 py-4 rounded-xl font-sans text-lg border transition-all duration-300 ${isSelected ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'bg-surface-container-lowest text-secondary border-outline-variant/30 hover:border-outline-variant'}`}
              >
                {pref}
              </button>
            );
          })}
        </div>

        <div className="flex justify-end pr-4">
          <button 
            onClick={() => navigate('/')}
            className="px-10 py-4 rounded-full primary-gradient font-medium text-lg hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Complete Setup
          </button>
        </div>
      </div>
    </div>
  );
}
