import RecipeGallery from '../components/RecipeGallery';

export default function ScanPage() {
  return (
    <div className="w-full bg-surface font-body text-on-surface antialiased pt-32 pb-24 max-w-7xl mx-auto px-8 min-h-[calc(100vh-80px)]">
      {/* Scanner Section: High Impact Editorial Layout */}
      <section className="mb-24">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="w-full lg:w-2/3">
            <div className="relative group">
              {/* Camera Preview Canvas */}
              <div className="aspect-[16/9] w-full bg-surface-container-highest rounded-xl overflow-hidden shadow-2xl relative">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Gourmet fresh vegetables and ingredients on a kitchen counter" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDotUP3EDlRb4lTkLvb4hpoQVvhnW4epIOSoYzw607X--IuYehjy0F0qD7VxXSQ4TLJCHESVeCbjFftfgE8tHU3qoGh6qXL68p6Ns_oeCBrte1uemF9Zi9lBBAn9e5Qco22L9xBfWcNes8jyXaPbT0InIGLDcWpbd9vMhBvDyMHkAfBgQSViophOnTD-6u18beF8b9nXxdNYULG-In917janz9GpuXFu7NWW4KhffS5AcdWQYvjjkHU2CrESQ1got-ynQKus9XTvkjL"
                />
                
                {/* AI Scanning Overlays */}
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center" style={{ backdropFilter: 'brightness(0.75)' }}>
                  <div className="absolute top-8 left-8 flex items-center space-x-3 bg-white/90 px-4 py-2 rounded-full border border-white/20" style={{ backdropFilter: 'blur(20px)' }}>
                    <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                    <span className="text-xs font-bold tracking-widest uppercase text-primary font-sans">AI Scanning Active</span>
                  </div>
                  
                  {/* Scanning Reticle */}
                  <div className="w-64 h-64 border-2 border-white/40 border-dashed rounded-xl flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Contextual AI Chips */}
                <div className="absolute bottom-8 left-8 flex flex-wrap gap-2 max-w-md">
                  <div className="bg-surface-container-lowest/90 border border-outline-variant/15 px-4 py-2 rounded-full flex items-center space-x-2" style={{ backdropFilter: 'blur(12px)' }}>
                    <span className="material-symbols-outlined text-xs text-primary">restaurant</span>
                    <span className="text-xs font-semibold text-primary font-sans">Zucchini detected</span>
                  </div>
                  <div className="bg-surface-container-lowest/90 border border-outline-variant/15 px-4 py-2 rounded-full flex items-center space-x-2" style={{ backdropFilter: 'blur(12px)' }}>
                    <span className="material-symbols-outlined text-xs text-primary">restaurant</span>
                    <span className="text-xs font-semibold text-primary font-sans">Bell Pepper</span>
                  </div>
                </div>
              </div>
              
              {/* Scan Trigger (Main CTA) */}
              <div className="absolute -bottom-8 right-12">
                <button className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0px_20px_40px_rgba(26,28,28,0.2)] flex items-center justify-center transform hover:scale-105 active:scale-95 transition-all duration-300">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>camera</span>
                </button>
              </div>
            </div>
          </div>

          {/* Editorial Sidebar */}
          <div className="w-full lg:w-1/3 flex flex-col justify-center pt-8">
            <h1 className="font-serif text-5xl font-bold text-on-surface leading-[1.1] tracking-tight mb-6">
              Reveal the <span className="italic text-primary">Flavor</span> Hidden in Your Pantry.
            </h1>
            <p className="text-secondary leading-relaxed mb-8 max-w-sm font-sans">
              Our advanced neural network identifies ingredients in real-time, curating bespoke recipes tailored to your nutrition profile.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-highest overflow-hidden">
                  <img className="w-full h-full object-cover" alt="User 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbKzmq88UkVtF0cDDZiCGnCklH4imhpwqesKPS75tai9p6nud7naSC1H9nN4UO0AmU4v_DYDhia2pzsooFjGU_NayJbxElwOaxbhMpkS2RY7doHIK-d3mdIxNtpfBGCvFKH7sB9j5ULeu2y62cmLdnDlxQowXY6DTnHccIXj9U67ZOH4r4D0cOATGCSJCA3zHjIpDA-IXY1Zwa2lacou9JznGTe87nTsk-zX8Te0Ob_q-c4eTitn1ntLy_CsyQU3Ie_vaFLtuPjf_2" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-highest overflow-hidden">
                  <img className="w-full h-full object-cover" alt="User 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsDEsB9sVExfezxMsitbQJJIub2ai8wTqpbsW_2zWbbHhi6Wtr-cpy7GHiC64cgx2WYJObp2GUrjnOXj5EadQ53FDm6a6ae4Qt1UGYL3EHs6cMkmxik4kwc5qhgVmzg5ONgCL4u23QvQx_P0MKkzfzewKBbe6o7VeRUQCmv8_4fo2tn9K_-axwKry4fBTTZ6fkBp-bsW9jPvuNU73BPp54_WCVrEpxZEsx4C9IMPtroDgeUNgkQq29TpGN_0O1UCFlPRfPt15QN_8F" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-highest overflow-hidden">
                  <img className="w-full h-full object-cover" alt="User 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWGCFm3GFkbpBg_hw2UwQHrz8-N5oui_0RPKZ0YtQ_7pDIb93CaREA65K7LiD-qMHI9QgwGzdhR6sVpd-B3YzRIDduFNpGMInluFOLHCKMGLc4Fp13XbvmSx8Z3bsYPi_1olhDgHoW3-3XQ9ddHFylZ-dTk2_4sOYhyWadGy95xz3OEA72msqHHqmeeUWsqxqt_ssq7UeivyaiYsT2waCHg-FS2_hnlGdWGpyigBoltf8VeE-NQ2OpLB--NuJdO0OpJ-z9URyKOg9t" />
                </div>
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-outline font-sans">Joined by 12k+ Foodies</span>
            </div>
          </div>
        </div>
      </section>

      {/* Embed the standard RecipeGallery for the lower section */}
      <RecipeGallery />
    </div>
  );
}
