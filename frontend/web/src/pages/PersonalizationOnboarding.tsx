import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PersonalizationOnboarding() {
  const navigate = useNavigate();
  const [cookingLevel, setCookingLevel] = useState('Anfänger');
  
  const [diets, setDiets] = useState<string[]>(['Vegetarisch', 'Vegan', 'Pesketarisch', 'Flexitarisch', 'Paleo', 'Keto']);
  const [focuses, setFocuses] = useState<string[]>(['High Protein', 'Low Carb', 'Kalorienarm']);
  const [allergies, setAllergies] = useState<string[]>(['Erdnüsse', 'Gluten', 'Laktose', 'Meeresfrüchte', 'Soja']);
  
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedFocuses, setSelectedFocuses] = useState<string[]>(['Low Carb']);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  
  const [addingCategory, setAddingCategory] = useState<'diets' | 'focuses' | 'allergies' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addingCategory && inputRef.current) {
      inputRef.current.focus();
    }
  }, [addingCategory]);

  const toggleSelection = (item: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleRemoveItem = (item: string, categoryKey: 'diets' | 'focuses' | 'allergies') => {
    if (categoryKey === 'diets') {
      setDiets(diets.filter(i => i !== item));
      setSelectedDiets(selectedDiets.filter(i => i !== item));
    } else if (categoryKey === 'focuses') {
      setFocuses(focuses.filter(i => i !== item));
      setSelectedFocuses(selectedFocuses.filter(i => i !== item));
    } else if (categoryKey === 'allergies') {
      setAllergies(allergies.filter(i => i !== item));
      setSelectedAllergies(selectedAllergies.filter(i => i !== item));
    }
  };

  const handleAddSubmit = () => {
    const val = inputValue.trim();
    if (val) {
      if (addingCategory === 'diets' && !diets.includes(val)) {
        setDiets([...diets, val]);
        setSelectedDiets([...selectedDiets, val]);
      } else if (addingCategory === 'focuses' && !focuses.includes(val)) {
        setFocuses([...focuses, val]);
        setSelectedFocuses([...selectedFocuses, val]);
      } else if (addingCategory === 'allergies' && !allergies.includes(val)) {
        setAllergies([...allergies, val]);
        setSelectedAllergies([...selectedAllergies, val]);
      }
    }
    setAddingCategory(null);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddSubmit();
    if (e.key === 'Escape') {
      setAddingCategory(null);
      setInputValue('');
    }
  };
  
  const renderSection = (
    title: string, 
    items: string[], 
    selectedItems: string[], 
    setSelectionState: (list: string[]) => void,
    categoryKey: 'diets' | 'focuses' | 'allergies'
  ) => {
    return (
      <div className="space-y-4">
        <h4 className="text-xs font-sans uppercase tracking-widest text-stone-500 font-bold">{title}</h4>
        <div className="flex flex-wrap items-center gap-3">
          {items.map(item => {
            const isSelected = selectedItems.includes(item);
            return (
              <div 
                key={item}
                onClick={() => toggleSelection(item, selectedItems, setSelectionState)}
                className={`group flex items-center pl-5 pr-2 py-1.5 rounded-full font-sans text-sm font-semibold cursor-pointer transition-colors ${isSelected ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-lowest text-secondary border border-outline-variant/30 hover:bg-surface-container-high'}`}
              >
                <span>{item}</span>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleRemoveItem(item, categoryKey); 
                  }}
                  className={`w-6 h-6 flex items-center justify-center rounded-full ml-1 opacity-0 group-hover:opacity-100 transition-all focus:outline-none ${isSelected ? 'hover:bg-white/20 text-on-primary' : 'hover:bg-stone-500/10 text-stone-500 hover:text-stone-800'}`}
                  title="Remove"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            );
          })}
          
          {addingCategory === categoryKey ? (
            <input 
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleAddSubmit}
              onKeyDown={handleKeyDown}
              placeholder="Eintippen..."
              className="px-6 py-2.5 w-32 bg-surface-container-highest border-none rounded-full font-sans text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-stone-500 transition-all outline-none animate-[fadeIn_0.2s_ease-out]"
            />
          ) : (
            <button 
              onClick={() => setAddingCategory(categoryKey)}
              className="px-4 py-2.5 flex items-center justify-center rounded-full bg-surface-container-lowest text-secondary border border-outline-variant/30 hover:bg-surface-container-high hover:text-primary transition-colors cursor-pointer shadow-sm"
              title="Add New"
            >
              <span className="material-symbols-outlined text-sm font-bold">add</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="pt-24 lg:pt-32 pb-24 px-6 md:px-12 flex justify-center min-h-[calc(100vh-80px)]">
      <div className="max-w-6xl w-full">
        {/* Title & Subtitle Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="font-serif text-5xl md:text-6xl text-on-surface font-bold tracking-tight italic">
            Personalisiere deine kulinarische Reise
          </h1>
          <p className="font-sans text-lg text-secondary max-w-2xl mx-auto">
            Wir passen die KI-Rezeptvorschläge an dein Niveau und deine Bedürfnisse an.
          </p>
        </div>

        {/* Main Content Container (Asymmetric Bento-ish Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Dein Kochlevel */}
          <div className="lg:col-span-5 bg-surface-container-low p-10 rounded-xl space-y-8">
            <h2 className="font-serif text-2xl font-bold italic border-b border-outline-variant/20 pb-4">Dein Kochlevel</h2>
            <div className="grid grid-cols-1 gap-4">
              
              {/* Card 1: Nie gekocht */}
              <div 
                onClick={() => setCookingLevel('Nie gekocht')}
                className={`group flex items-center gap-6 p-6 rounded-lg border transition-all cursor-pointer shadow-sm hover:shadow-md ${cookingLevel === 'Nie gekocht' ? 'bg-primary text-on-primary border-primary shadow-xl' : 'bg-surface-container-lowest border-transparent hover:border-primary/20'}`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${cookingLevel === 'Nie gekocht' ? 'bg-white/10' : 'bg-surface-container-high group-hover:bg-primary group-hover:text-white'}`}>
                  <span className="material-symbols-outlined text-3xl">egg_alt</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">Nie gekocht</h3>
                  <p className={`text-sm ${cookingLevel === 'Nie gekocht' ? 'text-on-primary/70' : 'text-secondary'}`}>Ich kann Wasser kochen... meistens.</p>
                </div>
              </div>

              {/* Card 2: Anfänger */}
              <div 
                onClick={() => setCookingLevel('Anfänger')}
                className={`group flex items-center gap-6 p-6 rounded-lg border transition-all cursor-pointer shadow-sm hover:shadow-md ${cookingLevel === 'Anfänger' ? 'bg-primary text-on-primary border-primary shadow-xl' : 'bg-surface-container-lowest border-transparent hover:border-primary/20'}`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${cookingLevel === 'Anfänger' ? 'bg-white/10' : 'bg-surface-container-high group-hover:bg-primary group-hover:text-white'}`}>
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: cookingLevel === 'Anfänger' ? "'FILL' 1" : undefined }}>skillet</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">Anfänger</h3>
                  <p className={`text-sm ${cookingLevel === 'Anfänger' ? 'text-on-primary/70' : 'text-secondary'}`}>Ich kenne die Grundlagen und einfache Rezepte.</p>
                </div>
              </div>

              {/* Card 3: Fortgeschritten */}
              <div 
                onClick={() => setCookingLevel('Fortgeschritten')}
                className={`group flex items-center gap-6 p-6 rounded-lg border transition-all cursor-pointer shadow-sm hover:shadow-md ${cookingLevel === 'Fortgeschritten' ? 'bg-primary text-on-primary border-primary shadow-xl' : 'bg-surface-container-lowest border-transparent hover:border-primary/20'}`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${cookingLevel === 'Fortgeschritten' ? 'bg-white/10' : 'bg-surface-container-high group-hover:bg-primary group-hover:text-white'}`}>
                  <span className="material-symbols-outlined text-3xl">cooking</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">Fortgeschritten</h3>
                  <p className={`text-sm ${cookingLevel === 'Fortgeschritten' ? 'text-on-primary/70' : 'text-secondary'}`}>Ich experimentiere gerne mit Aromen.</p>
                </div>
              </div>

              {/* Card 4: Chef */}
              <div 
                onClick={() => setCookingLevel('Chef')}
                className={`group flex items-center gap-6 p-6 rounded-lg border transition-all cursor-pointer shadow-sm hover:shadow-md ${cookingLevel === 'Chef' ? 'bg-primary text-on-primary border-primary shadow-xl' : 'bg-surface-container-lowest border-transparent hover:border-primary/20'}`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${cookingLevel === 'Chef' ? 'bg-white/10' : 'bg-surface-container-high group-hover:bg-primary group-hover:text-white'}`}>
                  <span className="material-symbols-outlined text-3xl">restaurant_menu</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">Chef</h3>
                  <p className={`text-sm ${cookingLevel === 'Chef' ? 'text-on-primary/70' : 'text-secondary'}`}>Die Küche ist mein Atelier.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Vorlieben & Allergien */}
          <div className="lg:col-span-7 bg-surface-container-low p-10 rounded-xl space-y-8">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
              <h2 className="font-serif text-2xl font-bold italic">Vorlieben & Allergien</h2>
              <span className="text-xs font-sans uppercase tracking-widest text-stone-400">Mehrfachauswahl</span>
            </div>
            
            <div className="space-y-10">
              {renderSection('Ernährungsweise', diets, selectedDiets, setSelectedDiets, 'diets')}
              {renderSection('Fokus', focuses, selectedFocuses, setSelectedFocuses, 'focuses')}
              {renderSection('Allergien', allergies, selectedAllergies, setSelectedAllergies, 'allergies')}
            </div>
          </div>
          
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-outline-variant/20">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-stone-400 font-sans uppercase tracking-widest text-xs hover:text-on-surface transition-colors group"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Zurück
          </button>
          
          <button 
            onClick={() => navigate('/')} 
            className="bg-gradient-to-tr from-primary-container to-primary text-on-primary px-16 py-6 rounded-full font-sans uppercase tracking-widest text-sm font-extrabold shadow-2xl hover:opacity-90 transition-all active:scale-95 duration-200"
          >
            Speichern & Weiter
          </button>
          
          <div className="hidden md:block w-24"></div>
        </div>
      </div>
    </div>
  );
}
