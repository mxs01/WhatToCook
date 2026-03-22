export default function HowItWorks() {
  return (
    <main className="pt-32">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 mb-32 md:mb-56">
        <div className="flex flex-col md:flex-row items-end gap-12">
          <div className="md:w-2/3">
            <h1 className="font-serif text-6xl md:text-8xl lg:text-[7rem] leading-[0.9] -tracking-[0.04em] text-primary">
              The Art of <br /><span className="italic font-normal">Artificial</span> <br />Intelligence
            </h1>
          </div>
          <div className="md:w-1/3 pb-4">
            <p className="font-sans text-xl text-secondary leading-relaxed max-w-sm">
              WhatToCook reimagines the culinary workflow, transforming chaotic kitchen inventories into curated epicurean experiences through a trio of proprietary AI modules.
            </p>
          </div>
        </div>
      </section>

      {/* Module 01: Vision Scan */}
      <section className="mb-32 md:mb-56 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2 order-2 md:order-1">
            <div className="space-y-8 max-w-md">
              <span className="font-sans text-xs tracking-[0.3em] uppercase text-secondary">Module 01</span>
              <h2 className="font-serif text-5xl text-primary tracking-tight">Vision Scan</h2>
              <p className="font-sans text-lg text-secondary leading-relaxed">
                Intelligent object recognition identifies every ingredient in real-time. Simply open your larder or refrigerator; our visual engine catalogs textures, quantities, and expiration states with surgical precision.
              </p>
              <div className="pt-4">
                <div className="w-12 h-[1px] bg-primary/20"></div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-xl -rotate-2 scale-105 group-hover:rotate-0 transition-transform duration-700"></div>
              <img
                alt="Sleek refrigerator interior"
                className="relative w-full aspect-[4/5] object-cover rounded-xl shadow-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsYLkGcRBoW5cNJVRWHQmyjVS84E9PDCEU6JmwI2P6Ab-UIrasvOSEjCfSTnLLA7oHbGsuX-rUgYoGVlxpbYDgVjacV5CYrAhVJ60rj0sEu8t-KAtPXvtfkr2d7GEGdcmK7-hC2ZL1-w_XpP-71_OSPr-zF81bD3gr8TqXjXBc06Rnq4XvQOKGadnq1S7ZVLvjTbJbrGeME9hj_MZlkVXjI2QHigbhyLu1bkCd_CnWCdHx8jY5rEhId1zvwojIy95XkWHX9LfMCAoR"
              />
              <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-md rounded-full px-6 py-2 border border-white/30 text-white font-sans text-xs tracking-widest uppercase">
                Active Scan: 98%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module 02: Chef Logic */}
      <section className="bg-surface-container-low py-32 md:py-56 mb-32 md:mb-56">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7">
              <div className="relative">
                <img
                  alt="Gourmet plating visual"
                  className="w-full aspect-video object-cover rounded-xl grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 shadow-xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3-FeBHSkeiF5CrnqlCQPWGETq8GwwRjfnkRkkJIQ99Hqc27xczIyhx5OY4JAmMv4HizJq2GAgrWHaSd1-6bhKJGA__bIuZGPjOc86scMgNhl87XW-XV69GcNeOCMrK51M26rbtFHLIjAElVMN4KT_Yu7H8ADZOhouFyIyDh_CCyUR8YT2SuXne5M4wN0fAWgLLXvXJzjXL_4WPnZQ4iNgGaoOL_qyQIMt3mrbYBfMi0eFDZXIlOL-nW5TzlB-1l520NUon8_MbQny"
                />
                <div className="absolute -bottom-12 -right-12 hidden lg:block">
                  <div className="bg-primary p-12 rounded-lg text-on-primary max-w-xs shadow-2xl">
                    <span className="material-symbols-outlined text-4xl mb-4 block">psychology</span>
                    <p className="font-serif italic text-xl">"Flavor profiles balanced against macro-economic nutritional data."</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-5 md:pl-16">
              <div className="space-y-8">
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-secondary">Module 02</span>
                <h2 className="font-serif text-5xl text-primary tracking-tight">Chef Logic</h2>
                <p className="font-sans text-lg text-secondary leading-relaxed">
                  Our AI agent crafts bespoke recipes based on your tastes, macros, and available ingredients. It doesn't just search a database—it synthesizes culinary physics to invent new possibilities tailored to your palate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module 03: Studio Visuals */}
      <section className="max-w-7xl mx-auto px-8 mb-32 md:mb-56">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="max-w-xl">
              <span className="font-sans text-xs tracking-[0.3em] uppercase text-secondary">Module 03</span>
              <h2 className="font-serif text-5xl md:text-6xl text-primary tracking-tight mt-6">Studio Visuals</h2>
            </div>
            <p className="md:max-w-md font-sans text-lg text-secondary leading-relaxed">
              Receive a professional cookbook-quality photo of your dish before you even turn on the stove. Our neural renderer predicts the final aesthetic result of your specific recipe.
            </p>
          </div>
          <div className="mt-12">
            <div className="relative h-[716px] w-full overflow-hidden rounded-xl">
              <img
                alt="Professional food photography"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGGpmn1yqlvJrEAjUpPxvl1nT8jhGupa-U3KVIcGD_s-rQmOqr8ta4NkJyf-ACXUispNoCuIMw-bCCuXRFt_3t0CLHd7IPTrZMkVdi6ATuYQtwnpFz-mNMuX_DK3Pv2XBqhkfHy_xRx1ZxsMXIjqwstP6zwIiXUHoTlwm_Z-sDS7pghVfza-nO_HUrCn346oThF2vYcmq0j8sgRnxg7Gz-KpAVFE1-hw3c5nBZYL0HPWJLH0ejioWLhkaCnbXtowNirdS37YZ5CH-N"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-12 md:p-20">
                <div className="text-on-primary">
                  <p className="font-sans text-xs tracking-[0.4em] uppercase opacity-70 mb-4">AI Prediction Render</p>
                  <h3 className="font-serif text-4xl italic">Smoked Aubergine with Velvet Reduction</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto px-8 text-center pb-32 md:pb-56">
        <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-16 md:p-24 flex flex-col items-center">
          <h2 className="font-serif text-4xl md:text-6xl text-primary mb-8 tracking-tight">Begin your curation.</h2>
          <p className="font-sans text-secondary text-xl mb-12 max-w-lg leading-relaxed">
            Elevate your daily ritual from necessity to artistry. The Digital Epicurean awaits your first scan.
          </p>
          <button className="bg-[linear-gradient(45deg,#061b0e_0%,#1b3022_100%)] text-on-primary px-12 py-5 rounded-full font-sans text-sm uppercase tracking-[0.2em] hover:opacity-90 transition-all duration-300 active:scale-95 shadow-2xl">
            Get Started
          </button>
        </div>
      </section>
    </main>
  );
}
