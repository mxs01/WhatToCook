import { useParams } from 'react-router-dom';

export default function RecipeDetails() {
  useParams(); // currently unused, will be used with real API

  // Mock Data
  const recipe = {
    title: 'Herb-Crusted Duck Breast',
    time: '45 mins',
    difficulty: 'Intermediate',
    macros: { calories: 640, protein: '42g', carbs: '12g', fat: '45g' },
    ingredients: [
      '2 Duck breasts, skin on',
      '1 tbsp fresh sage, finely chopped',
      '1 tbsp fresh thyme',
      '2 cups wild mushrooms (chanterelle or morel)',
      '1/2 cup red wine reduction',
      'Sea salt and cracked black pepper'
    ]
  };

  return (
    <div className="min-h-screen bg-surface-container-low pb-24">
      {/* Full Bleed Hero Image */}
      <div className="w-full h-[60vh] relative mb-16">
        <img src="/hero_food.png" className="w-full h-full object-cover" alt="Recipe Hero" />
        <div className="absolute inset-0 card-overlay"></div>
        <div className="absolute bottom-16 left-16 z-10 max-w-3xl">
          <h1 className="text-7xl font-serif text-white mb-6 leading-tight tracking-tight">{recipe.title}</h1>
          <div className="flex gap-4">
            <span className="bg-surface/20 backdrop-blur-md text-white px-6 py-2 rounded-full font-sans text-sm border border-white/20">
              {recipe.time}
            </span>
            <span className="bg-surface/20 backdrop-blur-md text-white px-6 py-2 rounded-full font-sans text-sm border border-white/20">
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Ingredients & Prep */}
        <div className="lg:col-span-4">
          <h2 className="text-3xl font-serif text-primary mb-8 border-b-2 border-primary pb-4 inline-block">Ingredients</h2>
          <ul className="flex flex-col gap-6">
            {recipe.ingredients.map((item, i) => (
              <li key={i} className="flex gap-4 items-center">
                <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                <span className="font-sans text-lg text-on-surface">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions & Macros */}
        <div className="lg:col-span-8">
           <h2 className="text-3xl font-serif text-primary mb-8 border-b-2 border-primary pb-4 inline-block">Macro Analysis</h2>
           <div className="grid grid-cols-4 gap-4 mb-16">
             <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 text-center shadow-sm">
               <div className="text-secondary font-sans text-sm uppercase tracking-wider mb-1">Calories</div>
               <div className="text-3xl font-serif text-primary">{recipe.macros.calories}</div>
             </div>
             <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 text-center shadow-sm">
               <div className="text-secondary font-sans text-sm uppercase tracking-wider mb-1">Protein</div>
               <div className="text-3xl font-serif text-primary">{recipe.macros.protein}</div>
             </div>
             <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 text-center shadow-sm">
               <div className="text-secondary font-sans text-sm uppercase tracking-wider mb-1">Carbs</div>
               <div className="text-3xl font-serif text-primary">{recipe.macros.carbs}</div>
             </div>
             <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 text-center shadow-sm">
               <div className="text-secondary font-sans text-sm uppercase tracking-wider mb-1">Fat</div>
               <div className="text-3xl font-serif text-primary">{recipe.macros.fat}</div>
             </div>
           </div>

           <h2 className="text-3xl font-serif text-primary mb-8 border-b-2 border-primary pb-4 inline-block">Method</h2>
           <div className="glass p-10 rounded-3xl space-y-8">
              <p className="font-sans text-lg text-on-surface leading-relaxed">
                <strong className="font-serif text-xl mr-4 text-primary">01.</strong> Score the duck breast skin in a crosshatch pattern without piercing the flesh. Season generously with sea salt.
              </p>
              <p className="font-sans text-lg text-on-surface leading-relaxed">
                <strong className="font-serif text-xl mr-4 text-primary">02.</strong> Place skin-side down in a cold pan, then turn the heat to medium-low to render the fat slowly for 12-15 minutes until crispy.
              </p>
              <p className="font-sans text-lg text-on-surface leading-relaxed">
                <strong className="font-serif text-xl mr-4 text-primary">03.</strong> Flip and cook for 2-3 minutes for medium-rare. Rest for 10 minutes before slicing. Serve with pan-seared wild mushrooms.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
