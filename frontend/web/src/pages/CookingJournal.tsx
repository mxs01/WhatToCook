import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function CookingJournal() {
  const { user } = useAuth();
  const displayName = user?.name || "Alexander";

  return (
    <div className="pt-32 pb-20 px-12 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] text-on-surface">
      <div className="grid grid-cols-12 gap-16">
        
        {/* Sidebar / Left Column */}
        <aside className="col-span-12 md:col-span-4 lg:col-span-3">
          <div className="sticky top-32 flex flex-col items-center text-center space-y-12">
            <div className="w-48 h-48 rounded-full p-1 bg-gradient-to-tr from-primary-container to-primary shadow-xl mb-8">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-surface-container-lowest">
                <img 
                  className="w-full h-full object-cover" 
                  alt={`Profile avatar of ${displayName}`}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn7s_fSgwJXc4OgyNd_ALXrtdHVLhqomIpxdOnBDMZc-jwayCoJV7JdzPMRVwRj2RFNOZRXoHEoWSsPPHBKl1haRVV6oD-SoQ6CKnCozRBO6qUB2D5_yv0Ikl-IjVdDQ-eVxs7W9fveC5fQoy_qis8zhWiJGMU0G0xGHbJQqT7OrTMcr0DoMG43yzbX0lJrgEZfp3VCMj-mYGvl6eGUs2TmszBJKyubmQ1BVuMYF-Fip6OgcyyzygsT6H4z1jLsOQx-Z32p0RhV0NU"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-serif text-primary font-bold tracking-tight">{displayName}</h1>
              <p className="text-secondary font-sans">{user?.email || "lukas@cook.ai"}</p>
            </div>
            
            <div className="mt-6">
              <span className="px-4 py-1.5 bg-primary text-white dark:bg-stone-50 dark:text-primary text-xs font-bold uppercase tracking-widest rounded-full shadow-sm">
                Pro Member
              </span>
            </div>
            
            <nav className="w-full mt-16 space-y-4">
              <Link className="flex items-center gap-4 px-6 py-3 text-secondary hover:bg-surface-container-highest rounded-full transition-all" to="/settings">
                <span className="material-symbols-outlined text-lg">person</span>
                <span className="font-sans">Profile Details</span>
              </Link>
              <Link className="flex items-center gap-4 px-6 py-3 text-secondary hover:bg-surface-container-highest rounded-full transition-all" to="/pantry">
                <span className="material-symbols-outlined text-lg">kitchen</span>
                <span className="font-sans">My Pantry</span>
              </Link>
              <Link className="flex items-center gap-4 px-6 py-3 bg-primary/5 text-primary rounded-full font-semibold transition-all" to="/journal">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
                <span className="font-sans">Cooking Journal</span>
              </Link>
              <Link className="flex items-center gap-4 px-6 py-3 text-secondary hover:bg-surface-container-highest rounded-full transition-all" to="/billing">
                <span className="material-symbols-outlined text-lg">credit_card</span>
                <span className="font-sans">Billing History</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content / Right Column */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-16">
        
        {/* Cover Image/Header Section */}
        <div className="h-64 md:h-80 w-full relative bg-surface-container-high overflow-hidden">
          <img 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            alt="Rustic kitchen setting with ingredients"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0499Qn3X84-0Q2P249Y2j20-7981L7-Y02029Z4-5Z7M95J9y-Q25O2J5x_Y5wE_QZ0F43U5R6_W4M7X66wM527O5r02wM214Q0O_U2xM-007V8J2N48X4L0N7-5q06V9S0g0g3z2F2v52N46L4A0xQ5M01vP9M9A4_5N2V9Q3yX9P78W3Y6uM6Q_F_7s"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex items-end justify-between">
            <div>
              <nav className="flex items-center gap-2 text-sm text-secondary font-sans font-bold uppercase tracking-widest mb-4">
                <Link to="/settings" className="hover:text-primary transition-colors">Account</Link>
                <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                <span className="text-on-surface">Journal</span>
              </nav>
              <h1 className="font-serif text-5xl md:text-6xl font-black tracking-tighter text-on-surface">Cooking Journal</h1>
            </div>
            
            {/* Stats Block */}
            <div className="hidden md:flex gap-8 bg-surface/80 backdrop-blur-md p-6 rounded-2xl border border-outline-variant/20 shadow-xl">
              <div className="text-center">
                <p className="font-serif text-3xl font-bold text-primary italic">24</p>
                <p className="font-sans text-xs uppercase tracking-widest text-secondary font-bold mt-1">Meals Logged</p>
              </div>
              <div className="w-px bg-outline-variant/30"></div>
              <div className="text-center">
                <p className="font-serif text-3xl font-bold text-primary italic">12</p>
                <p className="font-sans text-xs uppercase tracking-widest text-secondary font-bold mt-1">AI Recipes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="max-w-4xl mx-auto px-6 md:px-16 py-12">
          
          <div className="flex items-center justify-between mb-12 border-b border-outline-variant/10 pb-6">
            <h2 className="font-serif text-2xl font-bold italic text-on-surface">Recent Culinary Adventures</h2>
            <button className="flex items-center gap-2 text-sm font-sans font-bold text-primary hover:text-primary-container transition-colors bg-primary/5 px-4 py-2 rounded-full">
              <span className="material-symbols-outlined text-lg">add_circle</span>
              New Entry
            </button>
          </div>

          <div className="relative border-l-2 border-primary/20 pl-8 md:pl-12 space-y-16">
            
            {/* Journal Entry 1 */}
            <article className="relative bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-outline-variant/10 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[35px] md:-left-[51px] top-8 w-4 h-4 rounded-full bg-primary border-4 border-surface shadow-sm group-hover:scale-125 transition-transform"></div>
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Image Gallery */}
                <div className="w-full md:w-1/3 space-y-3">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-inner bg-surface-container">
                    <img 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      alt="Gourmet pasta dish plated beautifully"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2yPz_8QvYvL4r4_Q94wT8192r_6KzW8lXJ062qY6Z0P6N-2_O8lY7wX94U4P_97-T_w4v4_RzT0L0K-_0U186M9pX0uW-R90yT2z_xO72-005wQ5h94O84z1x0s-9Q9K8pT3Z2Z9X64X7wZ0Y_S2wT2n8z9m5Q793R73w2T_S_l5X_8M_F_8C_12xT0_8I2wUqP-R"
                    />
                  </div>
                  <div className="flex gap-2 text-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-2/3 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest font-sans">AI Suggested</span>
                    <time className="text-secondary text-sm font-medium font-sans">October 12, 2023</time>
                  </div>
                  
                  <h3 className="font-serif text-3xl font-bold text-on-surface mb-4 leading-tight group-hover:text-primary transition-colors">Truffle Infused Wild Mushroom Risotto</h3>
                  
                  <p className="font-sans text-secondary leading-relaxed mb-6 text-base text-pretty">
                    The AI nailed the texture recommendation. Searing the royal trumpet mushrooms before folding them into the arborio rice made all the difference. Added an extra splash of white wine than suggested.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className="px-3 py-1.5 bg-surface-container-high text-on-surface-variant rounded-md text-xs font-bold font-sans">#DinnerGuests</span>
                    <span className="px-3 py-1.5 bg-surface-container-high text-on-surface-variant rounded-md text-xs font-bold font-sans">#Italian</span>
                    <span className="px-3 py-1.5 bg-surface-container-high text-on-surface-variant rounded-md text-xs font-bold font-sans">#Vegetarian</span>
                  </div>
                </div>
              </div>
            </article>

            {/* Journal Entry 2 */}
            <article className="relative bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-outline-variant/10 group">
              <div className="absolute -left-[35px] md:-left-[51px] top-8 w-4 h-4 rounded-full bg-surface-container-highest border-4 border-surface shadow-sm group-hover:scale-125 group-hover:bg-primary transition-all"></div>
              
              <div className="flex flex-col md:flex-row gap-8">
                
                <div className="w-full md:w-1/3 space-y-3">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-inner bg-surface-container">
                    <img 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      alt="Fresh vibrant salad bowl"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2yPz_8QvYvL4r4_Q94wT8192r_6KzW8lXJ062qY6Z0P6N-2_O8lY7wX94U4P_97-T_w4v4_RzT0L0K-_0U186M9pX0uW-R90yT2z_xO72-005wQ5h94O84z1x0s-9Q9K8pT3Z2Z9X64X7wZ0Y_S2wT2n8z9m5Q793R73w2T_S_l5X_8M_F_8C_12xT0_8I2wUqP-R"
                    />
                  </div>
                  <div className="flex gap-2 text-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>star</span>
                  </div>
                </div>

                <div className="w-full md:w-2/3 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-[10px] font-bold uppercase tracking-widest font-sans">Custom Recipe</span>
                    <time className="text-secondary text-sm font-medium font-sans">October 08, 2023</time>
                  </div>
                  
                  <h3 className="font-serif text-3xl font-bold text-on-surface mb-4 leading-tight group-hover:text-primary transition-colors">Summer Citrus & Quinoa Bowl</h3>
                  
                  <p className="font-sans text-secondary leading-relaxed mb-6 text-base text-pretty">
                    A quick lunch thrown together. The grapefruit segments were a bit too tart against the vinaigrette. Need to balances next time with a touch of honey or maple syrup.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className="px-3 py-1.5 bg-surface-container-high text-on-surface-variant rounded-md text-xs font-bold font-sans">#QuickLunch</span>
                    <span className="px-3 py-1.5 bg-surface-container-high text-on-surface-variant rounded-md text-xs font-bold font-sans">#Healthy</span>
                  </div>
                </div>
              </div>
            </article>

          </div>

          <div className="mt-16 text-center">
            <button className="px-8 py-3 rounded-full border-2 border-primary text-primary font-bold font-sans hover:bg-primary hover:text-white transition-colors">
              Load Older Entries
            </button>
          </div>

        </div>
        </div>
      </div>
    </div>
  );
}
