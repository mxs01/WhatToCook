// Using some placeholder data
const MOCK_RECIPES = [
  { id: 1, title: 'Wild Truffle Risotto', time: '40 min', tags: ['Italian', 'Vegetarian'], image: '/hero_food.png' },
  { id: 2, title: 'Charred Heirloom Tomatoes', time: '15 min', tags: ['Starter', 'Vegan'], image: '/hero_food.png' },
  { id: 3, title: 'Seared Scallops', time: '25 min', tags: ['Seafood', 'Keto'], image: '/hero_food.png' },
];

const RecipeGallery: React.FC = () => {
  return (
    <section id="gallery" className="bg-surface py-32 px-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Gallery Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-5xl font-serif text-primary mb-4 tracking-tight">Curated Collection</h2>
            <p className="font-sans text-secondary text-lg">Inspired by your recent scans and seasonal ingredients.</p>
          </div>
          
          {/* Minimalist Input */}
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search recipes..." 
              className="w-full bg-surface-container-highest rounded-full px-6 py-4 font-sans text-sm text-on-surface outline-none placeholder:text-secondary focus:ring-2 focus:ring-primary/20 transition-shadow"
            />
            <svg className="w-5 h-5 absolute right-6 top-1/2 -translate-y-1/2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {MOCK_RECIPES.map((recipe) => (
            <div key={recipe.id} className="group cursor-pointer">
              {/* The Epicurean Card */}
              <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 shadow-md group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay */}
                <div className="absolute inset-0 card-overlay flex flex-col justify-end p-8 opacity-90 group-hover:opacity-100 transition-opacity">
                   <h3 className="text-white font-serif text-2xl mb-2">{recipe.title}</h3>
                   <div className="flex flex-wrap gap-2">
                     <span className="text-white/80 font-sans text-sm">{recipe.time}</span>
                   </div>
                </div>
              </div>

              {/* Outside Card Metadata */}
              <div className="px-2">
                <div className="flex gap-2">
                   {recipe.tags.map(tag => (
                     <span key={tag} className="text-secondary font-sans tracking-wide text-xs uppercase">{tag}</span>
                   ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default RecipeGallery;
