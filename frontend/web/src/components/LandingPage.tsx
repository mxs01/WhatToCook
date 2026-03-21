const LandingPage: React.FC = () => {
  return (
    <div className="bg-surface-container-low min-h-screen text-on-surface flex flex-col relative w-full overflow-hidden pt-28">

      {/* Hero Section */}
      <main className="flex-1 mt-28 px-10 pb-20 relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Typography Column - Asymmetrical Padding */}
        <div className="lg:col-span-5 pl-0 pr-12 z-10">
          <h2 className="text-6xl md:text-7xl font-serif text-primary leading-tight tracking-tight mb-8">
            The Digital<br />
            <span className="italic text-secondary">Epicurean</span>
          </h2>
          <p className="text-lg text-on-surface-variant mb-12 font-sans max-w-md leading-relaxed">
            Upload a photo of your fridge, and let our sophisticated AI curate an elevated culinary journey just for you. No boundaries, just pure taste.
          </p>
          
          <div className="flex gap-4 items-center">
            <button className="primary-gradient w-16 h-16 rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(26,28,28,0.06)] hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white stroke-[1.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <span className="font-serif text-xl tracking-tight text-primary">Scan your ingredients</span>
          </div>
        </div>

        {/* Right Imagery Column - Overlapping, Full-bleed feel */}
        <div className="lg:col-span-7 relative flex justify-end">
          <div className="w-[120%] h-[700px] relative rounded-l-[3rem] overflow-hidden shadow-2xl mr-[-20%] transform translate-x-12">
             {/* Using absolute absolute to break out of grid slightly for that 'composed' magazine feel */}
            <img 
              src="/hero_food.png" 
              alt="Gourmet dish showcasing sophisticated culinary aesthetic" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          {/* Floating UI Element (Glass Card) */}
          <div className="absolute bottom-16 left-0 bg-surface-container-lowest/80 backdrop-blur-md p-8 rounded-[2rem] border border-outline-variant/15 shadow-[0_20px_40px_rgba(26,28,28,0.08)] max-w-sm">
            <h3 className="font-serif text-2xl text-primary mb-2">Herb-Crusted Duck</h3>
            <p className="font-sans text-sm text-secondary mb-4">Detected in your fridge: Duck breast, sage, thyme, wild mushrooms</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-surface-container-highest rounded-full px-4 py-1.5 text-xs font-sans text-secondary">French</span>
              <span className="bg-surface-container-highest rounded-full px-4 py-1.5 text-xs font-sans text-secondary">45 min</span>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
};

export default LandingPage;
