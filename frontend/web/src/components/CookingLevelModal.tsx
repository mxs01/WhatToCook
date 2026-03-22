import { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CookingLevelModal({ isOpen, onClose }: Props) {
  const [level, setLevel] = useState("beginner");

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] h-[100vh] overflow-hidden flex items-center justify-center bg-zinc-100/50 dark:bg-zinc-900/50 backdrop-blur-xl p-6 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl animate-in fade-in zoom-in duration-300 cursor-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-surface-container-lowest shadow-[0px_20px_40px_rgba(26,28,28,0.06)] rounded-xl overflow-hidden border border-outline-variant/15 relative">
          
          <div className="px-12 pt-12 pb-8 text-center relative">
            <h2 className="font-serif text-4xl font-bold text-on-surface tracking-tight leading-tight">Cooking Level</h2>
            <p className="font-sans text-secondary mt-2 tracking-wide text-sm uppercase">Adjust your AI baseline.</p>
          </div>
          
          <div className="px-12 space-y-4">
            {[
              { id: 'never', title: 'NEVER COOKED', tier: 'Tier 01', icon: 'restaurant' },
              { id: 'beginner', title: 'BEGINNER', tier: 'Tier 02', icon: 'skillet' },
              { id: 'advanced', title: 'ADVANCED', tier: 'Tier 03', icon: 'cooking' },
              { id: 'chef', title: 'CHEF', tier: 'Tier 04', icon: 'outdoor_grill' }
            ].map((opt) => (
              <label key={opt.id} className="group relative flex items-center justify-between p-6 bg-surface-container-low rounded-lg cursor-pointer transition-all duration-300 hover:bg-surface-container-high border border-transparent hover:border-outline-variant/30">
                <input 
                  type="radio" 
                  name="cooking_level" 
                  value={opt.id}
                  checked={level === opt.id}
                  onChange={(e) => setLevel(e.target.value)}
                  className="hidden peer" 
                />
                <div className="flex items-center gap-6">
                  <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">{opt.icon}</span>
                  <div>
                    <span className="block font-sans text-xs tracking-widest text-secondary uppercase mb-1">{opt.tier}</span>
                    <span className="block font-sans text-lg font-semibold text-on-surface">{opt.title}</span>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-outline-variant flex items-center justify-center peer-checked:border-primary peer-checked:bg-primary transition-all">
                  <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                </div>
              </label>
            ))}
          </div>

          <div className="px-12 py-10 flex flex-col items-center gap-4">
            <button onClick={onClose} className="w-full py-5 rounded-full bg-primary text-on-primary font-sans font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 bg-[linear-gradient(45deg,#061b0e_0%,#1b3022_100%)]">
              Save Preference
            </button>
            <button onClick={onClose} className="px-8 py-2 text-stone-400 hover:text-on-surface font-sans text-xs tracking-widest uppercase transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
