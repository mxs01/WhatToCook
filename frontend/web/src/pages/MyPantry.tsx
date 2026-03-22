import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function MyPantry() {
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
              <Link className="flex items-center gap-4 px-6 py-3 bg-primary/5 text-primary rounded-full font-semibold transition-all" to="/pantry">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>kitchen</span>
                <span className="font-sans">My Pantry</span>
              </Link>
              <Link className="flex items-center gap-4 px-6 py-3 text-secondary hover:bg-surface-container-highest rounded-full transition-all" to="/journal">
                <span className="material-symbols-outlined text-lg">history</span>
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
        <div className="max-w-6xl mx-auto">
          <header className="mb-16">
            <h1 className="font-serif text-5xl font-bold tracking-tight text-on-surface mb-4">My Pantry</h1>
            <p className="text-secondary font-sans max-w-xl text-lg">Curate your inventory. Our AI uses this list to suggest bespoke recipes based on what you already have in your kitchen.</p>
          </header>

          {/* Search and Action Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div className="flex gap-4">
              <button className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-bold flex items-center gap-2 hover:bg-primary-container transition-colors shadow-md">
                <span className="material-symbols-outlined scale-75">add</span>
                Add New Ingredient
              </button>
              <button className="px-6 py-2.5 bg-surface-container-high text-on-surface rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined scale-75">filter_list</span>
                Filters
              </button>
            </div>
            <p className="text-sm text-secondary italic font-serif">Showing 24 ingredients</p>
          </div>

          {/* Pantry Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Category: Vegetables */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold italic border-b-2 border-primary/10 pb-2 flex-1 text-primary">Vegetables</h2>
                <span className="text-xs font-bold uppercase tracking-widest text-secondary ml-4">6 Items</span>
              </div>
              <div className="space-y-4">
                
                {/* Ingredient Card */}
                <div className="group flex items-center p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                    <img className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Fresh bunches of spinach" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbfifmiw06vdRHbH4qDuxWNu4n4LQehBi_ip6E0sgukGtwxYgJwQMcC_pLmWUIhRIhbYq0LxTNS3BfnpXANgqLq2x_tJu3J7DBnYtQ9pzPKaVHk_BQQzLsiQrhQPN0mh_piYMWLtp1GIs3hE1pOo5NaUHq3U7YRGV6Lzsj7tp6gQ8Xdyh2nn2L5-0RyZ7ns6CmYL_JyuXFBpnMEmbiVmcnewYOAChNpomhhhjobQ4ebt0pEHh3TNXkg7l8RDGiM3L0Svmf2Vdmn64t"/>
                  </div>
                  <div className="ml-6 flex-1">
                    <h4 className="font-bold text-on-surface font-sans">Baby Spinach</h4>
                    <p className="text-xs text-secondary font-medium mt-1 font-sans">Quantity: 250g • Added 2 days ago</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-stone-400 hover:text-error transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    <button className="p-2 text-stone-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </div>
                </div>

                <div className="group flex items-center p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                    <img className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Red and white onions" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-kN1XTUHF-ZHqXNNn47VcCAQF4-EiuTOMIeKYFTC8kUbCCYvv0N_KXC4i8xshcInBxFeqT1s9P2VP4-v1kK77NrFyNaQicsX2rX3T4gLDhG1IUYqnqcrQ0Q615n8e4oO1T2C59rZpGJxfWhYpsOjHXcWei4cdCAuKorb6feABXOY1bJGJQ4W8Ivougt8cipQfg4jtGKk5RhTdlFaE6MOo_AdLzAWWi2tSCEF_NLV1JtvbVn2XKFG2_lCgQTFC3g5AEw3vreKDXfxr"/>
                  </div>
                  <div className="ml-6 flex-1">
                    <h4 className="font-bold text-on-surface font-sans">Red Onions</h4>
                    <p className="text-xs text-secondary font-medium mt-1 font-sans">Quantity: 4 units • Added 1 week ago</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-stone-400 hover:text-error transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    <button className="p-2 text-stone-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </div>
                </div>

                <div className="group flex items-center p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                    <img className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Washed small potatoes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUXLWls32SjZX1Q6sOKgdKVJdVRwcE-yG1xiul_NCGy1BWdSivGDGfzEVVEVlHphO4UcL2p9KKQjGgcV-N30kQF9I0TVtMWj3LhfTAGnU_pfTxCSXjZZYuD3qCuqtS74fmY9EH674GAZjdnZX_3GR7P90AOUlcefJ6atZd65puMibUKLQAzZgMDGFbi7mO7aAj7eTwlvdE4eGCEUWOecURgrHcjLlJkMJF_fpCeAWJE51WDD6vULgfGbHXVutZKGDg8vaxJQ7dLowA"/>
                  </div>
                  <div className="ml-6 flex-1">
                    <h4 className="font-bold text-on-surface font-sans">Fingerling Potatoes</h4>
                    <p className="text-xs text-secondary font-medium mt-1 font-sans">Quantity: 1kg • Added 3 days ago</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-stone-400 hover:text-error transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    <button className="p-2 text-stone-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </div>
                </div>

              </div>
            </section>

            {/* Category: Proteins */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold italic border-b-2 border-primary/10 pb-2 flex-1 text-primary">Proteins</h2>
                <span className="text-xs font-bold uppercase tracking-widest text-secondary ml-4">3 Items</span>
              </div>
              <div className="space-y-4">
                
                <div className="group flex items-center p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                    <img className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Raw chicken breast on board" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDemof1yr3U3-Hw7v6VmQm2Pay753tLYpFPKb-TW38Nq1j38lhf25IrRYWLxVPJb7cZvWFQqkevh1sD7N2I7nSKJo1xbvN8mGyoJEVpLtAxBAYw0VHad9HQlRaO9KdnLr0Lh8uo8tja_xizmpPutfFhrHDCq4e2uzNQhvj27kNK3BAU54BtTKZlesW3VIQmfPaJxN3vWU7JkOBJvrcPeto7oum86V3GKfFqDhgmFoRKqQgUbzYuYH6dKD9rL_E669uFIZ6cYpwEeLxm"/>
                  </div>
                  <div className="ml-6 flex-1">
                    <h4 className="font-bold text-on-surface font-sans">Free-Range Chicken</h4>
                    <p className="text-xs text-secondary font-medium mt-1 font-sans">Quantity: 2 units • Added Today</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-stone-400 hover:text-error transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    <button className="p-2 text-stone-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </div>
                </div>

                <div className="group flex items-center p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                    <img className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Fresh salmon fillet" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkG_ulfIORH3kAtAzVAAodT-0AA8GNrpR8RE2qQD_6IMFRDhDwQnnx8RqAOUQMZ3JXkhodkhH5YELyBg9gIWxWQlVlKtcCE9QYXMc2bqWxIpU_rUq8tMo5aYUZdfdvAREHOsV1dxDwPCGvW_zXHFiNDeQTcPtIUgqMTB4j65XDvYr-llF-bNQFMhpK3j-IPdQX3-kudXOqwCgsB-SBDUwz_gTlBuKiklCMoDWX5KWjAAayP4OYJqnZOm_gAvmHcAJKl6rCSSYJURuZ"/>
                  </div>
                  <div className="ml-6 flex-1">
                    <h4 className="font-bold text-on-surface font-sans">Atlantic Salmon</h4>
                    <p className="text-xs text-secondary font-medium mt-1 font-sans">Quantity: 400g • Added 1 day ago</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-stone-400 hover:text-error transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    <button className="p-2 text-stone-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </div>
                </div>

              </div>
            </section>

            {/* Category: Spices & Herbs */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold italic border-b-2 border-primary/10 pb-2 flex-1 text-primary">Spices & Herbs</h2>
                <span className="text-xs font-bold uppercase tracking-widest text-secondary ml-4">12 Items</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                
                <div className="group p-4 bg-surface-container-lowest border border-outline-variant/10 rounded-lg flex items-center gap-3 hover:bg-surface-container-high transition-colors cursor-pointer shadow-sm hover:shadow-md">
                  <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary scale-75">eco</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold font-sans">Black Pepper</h5>
                    <p className="text-[10px] text-secondary font-sans uppercase tracking-widest">Whole Grain</p>
                  </div>
                  <button className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined scale-75 text-error">remove_circle</span>
                  </button>
                </div>

                <div className="group p-4 bg-surface-container-lowest border border-outline-variant/10 rounded-lg flex items-center gap-3 hover:bg-surface-container-high transition-colors cursor-pointer shadow-sm hover:shadow-md">
                  <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary scale-75">eco</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold font-sans">Smoked Paprika</h5>
                    <p className="text-[10px] text-secondary font-sans uppercase tracking-widest">La Vera</p>
                  </div>
                </div>

                <div className="group p-4 bg-surface-container-lowest border border-outline-variant/10 rounded-lg flex items-center gap-3 hover:bg-surface-container-high transition-colors cursor-pointer shadow-sm hover:shadow-md">
                  <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary scale-75">eco</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold font-sans">Cumin Seeds</h5>
                    <p className="text-[10px] text-secondary font-sans uppercase tracking-widest">Toasted</p>
                  </div>
                </div>

                <div className="group p-4 bg-surface-container-lowest border border-outline-variant/10 rounded-lg flex items-center gap-3 hover:bg-surface-container-high transition-colors cursor-pointer shadow-sm hover:shadow-md">
                  <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary scale-75">eco</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold font-sans">Kosher Salt</h5>
                    <p className="text-[10px] text-secondary font-sans uppercase tracking-widest">Fine Grain</p>
                  </div>
                </div>

              </div>
            </section>

            {/* Category: Dairy & Pantry Staples */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold italic border-b-2 border-primary/10 pb-2 flex-1 text-primary">Pantry Staples</h2>
                <span className="text-xs font-bold uppercase tracking-widest text-secondary ml-4">8 Items</span>
              </div>
              <div className="space-y-4">
                
                <div className="group flex items-center p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                    <img className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Bottle of olive oil" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvhI-JZM5gNdtm96J9emFixeJYGokY7AFIII_6tOGPfbYmtQQxd1ek5KhGLswO-VrSgN8NJeLQpScIKvxb2CqfpJb3aGUQDlCq15G5RXLEKzuIR-xfjIeHqsIXg7BBxMwdXvmmcuVadvR8akuMUUWUpz5UXAM2c3dlByIh61DqvUw1quEQZ6LtX5Rc24mDxqVwE_DB_pSyjPv3fPwPDeiyCWDujsyQ4D24pR1FYK6M188_zcV_qBeUyD1noGtkE46r6aTTGAXUmP2g"/>
                  </div>
                  <div className="ml-6 flex-1">
                    <h4 className="font-bold text-on-surface font-sans">Extra Virgin Olive Oil</h4>
                    <p className="text-xs text-secondary font-medium mt-1 font-sans">Quantity: 750ml • Added 2 weeks ago</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-stone-400 hover:text-error transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    <button className="p-2 text-stone-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </div>
                </div>

                <div className="group flex items-center p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                    <img className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt="White jasmine rice" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdXGAncLyU_a8f3yLXr21QSkER-f8sHulX9Pn8rGo51jKKYXsdmTx27oJTH6ggSaxON6EYPK49HTVArPFnVjv_P1Vtwwhh_cEuECvRZyJy7lWoF05hPxawGiPIPxul-GBuJ8EBao2DKwA0dq2Qv_7EusDvijvwxm8acoq45Cuj33EKV1ZZMWsL4UGEFuuXVsquAqOK_HkX3DfI6NVvSMM7ISLsIZ7xb3Hk3Os6bt1s8N4-eyvEyLXh8vsGjrF-lhBN2J_CFWFWMi8E"/>
                  </div>
                  <div className="ml-6 flex-1">
                    <h4 className="font-bold text-on-surface font-sans">Jasmine Rice</h4>
                    <p className="text-xs text-secondary font-medium mt-1 font-sans">Quantity: 2kg • Added 1 month ago</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-stone-400 hover:text-error transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    <button className="p-2 text-stone-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </div>
                </div>

              </div>
            </section>
          </div>

          {/* AI Recommendation Suggestion */}
          <div className="mt-20 p-10 bg-gradient-to-br from-primary to-primary-container rounded-xl text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h3 className="font-serif text-3xl font-bold mb-4 italic">Unlock Personalized Recipes</h3>
                <p className="font-sans text-on-primary-container text-lg">Your pantry is 85% complete. Add your preferred dairy and grains to get the most accurate AI-generated dinner suggestions.</p>
              </div>
              <button className="px-10 py-4 bg-white text-primary rounded-full font-bold shadow-2xl hover:bg-surface-container-low transition-colors whitespace-nowrap active:scale-95">
                Run Inventory Scan
              </button>
            </div>
            {/* Abstract Background Pattern */}
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none -translate-y-10 translate-x-10">
              <span className="material-symbols-outlined text-[300px]" style={{ fontVariationSettings: "'FILL' 1" }}>temp_preferences_custom</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
