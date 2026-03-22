import React from 'react';

const RecipeAnalytics: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 bg-surface font-sans text-on-surface antialiased overflow-x-hidden overflow-y-auto">
            {/* SideNavBar Anchor */}
            <aside className="fixed left-0 top-0 h-screen w-72 flex flex-col py-8 border-r-0 rounded-r-[3rem] bg-stone-50 dark:bg-zinc-950 shadow-[20px_0px_40px_rgba(26,28,28,0.03)] z-50 font-serif tracking-tight">
                <div className="px-8 mb-12">
                    <h1 className="text-2xl font-bold italic text-emerald-950 dark:text-emerald-100">WhatToCook</h1>
                    <p className="font-sans text-xs uppercase tracking-widest text-stone-400 mt-1">Admin Console</p>
                </div>
                <nav className="flex-1 space-y-2">
                    <a className="flex items-center gap-4 px-6 py-4 text-stone-500 dark:text-zinc-500 hover:text-emerald-900 dark:hover:text-emerald-400 hover:bg-stone-200/30 dark:hover:bg-zinc-800/30 transition-all duration-300" href="/admin/dashboard">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="font-sans">Dashboard</span>
                    </a>
                    <a className="flex items-center gap-4 px-6 py-4 text-emerald-950 dark:text-emerald-50 font-bold border-r-4 border-emerald-900 dark:border-emerald-500 bg-stone-200/50 dark:bg-zinc-800/50" href="#">
                        <span className="material-symbols-outlined">analytics</span>
                        <span className="font-sans">Recipe Analytics</span>
                    </a>
                    <a className="flex items-center gap-4 px-6 py-4 text-stone-500 dark:text-zinc-500 hover:text-emerald-900 dark:hover:text-emerald-400 hover:bg-stone-200/30 dark:hover:bg-zinc-800/30 transition-all duration-300" href="/admin/users">
                        <span className="material-symbols-outlined">group</span>
                        <span className="font-sans">User Management</span>
                    </a>
                    <a className="flex items-center gap-4 px-6 py-4 text-stone-500 dark:text-zinc-500 hover:text-emerald-900 dark:hover:text-emerald-400 hover:bg-stone-200/30 dark:hover:bg-zinc-800/30 transition-all duration-300" href="#">
                        <span className="material-symbols-outlined">settings</span>
                        <span className="font-sans">Settings</span>
                    </a>
                </nav>
                <div className="px-8 mt-auto flex items-center gap-3 font-sans">
                    <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden">
                        <img alt="Chef Administrator Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfLJ1qWFFq3P_eMw_49PCFIkzF9zVUMQcSTA_3i6G86b_57JfncFgPT6aqbHYFn5xCqDVCCEppqyLEg0Uv1e0arFziXuUTQ3QHzXvtNQrPFQSHf-EpUIjDEy2_HpTniQC3O07wattpaW-8D2an4XsfKogt6T3u8t-ll-A5cCdaKA0OkFUSpJKcGn3gArkAKpSEYhWXnTlljH93S3uTpAOK4JtRuXPMTrwky7J34V57svRo7asBO4STy68tLh8dm_Jm-6mrY7vcXe2f" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-emerald-950">Chef Admin</p>
                        <p className="text-xs text-stone-400 tracking-tight">System Overseer</p>
                    </div>
                </div>
            </aside>
            
            {/* Main Content Area */}
            <main className="pl-72 min-h-screen">
                {/* TopNavBar Anchor */}
                <header className="flex justify-between items-center w-full pl-12 pr-12 py-6 bg-stone-50/80 dark:bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <h2 className="font-serif text-2xl font-bold text-primary italic">Recipe Analytics</h2>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-400">search</span>
                            <input className="bg-surface-container-highest border-none rounded-full pl-12 pr-6 py-2 w-64 text-sm focus:ring-2 focus:ring-emerald-900/10 transition-all focus:outline-none" placeholder="Search insights..." type="text" />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">notifications</button>
                            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">help_outline</button>
                        </div>
                    </div>
                </header>
                
                {/* Analytics Content */}
                <div className="px-12 py-10 max-w-7xl mx-auto space-y-12">
                    {/* Hero Stats Bento */}
                    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2 bg-primary-container text-on-primary-container p-8 rounded-xl shadow-sm flex flex-col justify-between overflow-hidden relative">
                            <div className="z-10">
                                <p className="font-sans text-sm uppercase tracking-widest opacity-80">Generation Volume</p>
                                <h3 className="font-serif text-5xl font-bold mt-2">14,282</h3>
                                <p className="text-sm mt-4 font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">trending_up</span>
                                    +12.4% from last month
                                </p>
                            </div>
                            <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                                <span className="material-symbols-outlined text-[12rem]">restaurant_menu</span>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between border border-outline-variant/10">
                            <p className="font-sans text-xs uppercase tracking-widest text-secondary">Avg. Rating</p>
                            <div className="flex items-baseline gap-2 mt-4">
                                <h3 className="font-serif text-4xl font-bold">4.8</h3>
                                <span className="text-emerald-600 font-bold">/5</span>
                            </div>
                            <div className="flex gap-0.5 mt-2">
                                <span className="material-symbols-outlined text-sm text-emerald-800" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                                <span className="material-symbols-outlined text-sm text-emerald-800" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                                <span className="material-symbols-outlined text-sm text-emerald-800" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                                <span className="material-symbols-outlined text-sm text-emerald-800" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                                <span className="material-symbols-outlined text-sm text-emerald-800" style={{fontVariationSettings: '"FILL" 1'}}>star_half</span>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between border border-outline-variant/10">
                            <p className="font-sans text-xs uppercase tracking-widest text-secondary">Processing</p>
                            <div className="mt-4">
                                <h3 className="font-serif text-4xl font-bold">1.2<span className="text-lg">s</span></h3>
                                <p className="text-xs text-stone-400 mt-1 font-sans">Avg. generation time</p>
                            </div>
                            <div className="w-full bg-surface-container h-1 rounded-full mt-4 overflow-hidden">
                                <div className="bg-emerald-900 h-full w-[85%]"></div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Detailed Visualizations */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Recipe Generation Chart */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h4 className="font-serif text-2xl font-bold">Generation Volume Trends</h4>
                                    <p className="text-secondary text-sm font-sans">Monthly overview of AI-curated culinary requests.</p>
                                </div>
                                <div className="flex bg-surface-container rounded-full p-1 font-sans">
                                    <button className="px-4 py-1.5 text-xs font-bold bg-white rounded-full shadow-sm">Weekly</button>
                                    <button className="px-4 py-1.5 text-xs text-secondary">Monthly</button>
                                </div>
                            </div>
                            <div className="bg-surface-container-low rounded-xl h-[400px] w-full p-8 flex items-end justify-between gap-4 font-sans">
                                {/* Custom styled bars for chart visualization */}
                                <div className="flex-1 flex flex-col items-center gap-3">
                                    <div className="w-full bg-primary/20 rounded-t-lg relative group h-[40%]">
                                        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"></div>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-stone-400">Mon</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center gap-3">
                                    <div className="w-full bg-primary/20 rounded-t-lg relative group h-[65%]">
                                        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"></div>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-stone-400">Tue</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center gap-3">
                                    <div className="w-full bg-primary rounded-t-lg h-[85%] shadow-lg shadow-primary/20 relative">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-2 py-1 rounded">2.4k</div>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-primary">Wed</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center gap-3">
                                    <div className="w-full bg-primary/20 rounded-t-lg h-[55%]"></div>
                                    <span className="text-[10px] uppercase font-bold text-stone-400">Thu</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center gap-3">
                                    <div className="w-full bg-primary/20 rounded-t-lg h-[75%]"></div>
                                    <span className="text-[10px] uppercase font-bold text-stone-400">Fri</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center gap-3">
                                    <div className="w-full bg-primary/20 rounded-t-lg h-[45%]"></div>
                                    <span className="text-[10px] uppercase font-bold text-stone-400">Sat</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center gap-3">
                                    <div className="w-full bg-primary/20 rounded-t-lg h-[30%]"></div>
                                    <span className="text-[10px] uppercase font-bold text-stone-400">Sun</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Popular Ingredients Sidebar */}
                        <div className="space-y-6">
                            <h4 className="font-serif text-2xl font-bold">Trending Ingredients</h4>
                            <div className="space-y-4 font-sans">
                                <div className="bg-surface-container-lowest p-5 rounded-lg flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-emerald-900">eco</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm">Heirloom Basil</p>
                                        <p className="text-xs text-secondary">Used in 3.2k recipes</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-emerald-700">+18%</p>
                                    </div>
                                </div>
                                <div className="bg-surface-container-lowest p-5 rounded-lg flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-emerald-900">water_drop</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm">Cold Pressed Olive Oil</p>
                                        <p className="text-xs text-secondary">Used in 2.8k recipes</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-emerald-700">+12%</p>
                                    </div>
                                </div>
                                <div className="bg-surface-container-lowest p-5 rounded-lg flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-emerald-900">grain</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm">Pink Himalayan Salt</p>
                                        <p className="text-xs text-secondary">Used in 2.1k recipes</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-stone-400">-2%</p>
                                    </div>
                                </div>
                                <div className="bg-surface-container-lowest p-5 rounded-lg flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-emerald-900">local_fire_department</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm">Smoked Paprika</p>
                                        <p className="text-xs text-secondary">Used in 1.9k recipes</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-emerald-700">+24%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Bottom Row: Difficulty and Category Times */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-stone-900 text-stone-50 rounded-xl p-10 overflow-hidden relative">
                            <h4 className="font-serif text-2xl mb-8">Recipe Difficulty Breakdown</h4>
                            <div className="space-y-6 font-sans">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold tracking-widest uppercase opacity-60">
                                        <span>Beginner</span>
                                        <span>45%</span>
                                    </div>
                                    <div className="w-full bg-stone-800 h-2 rounded-full">
                                        <div className="h-full bg-emerald-500 w-[45%] rounded-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold tracking-widest uppercase opacity-60">
                                        <span>Intermediate</span>
                                        <span>35%</span>
                                    </div>
                                    <div className="w-full bg-stone-800 h-2 rounded-full">
                                        <div className="h-full bg-stone-400 w-[35%] rounded-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold tracking-widest uppercase opacity-60">
                                        <span>Expert</span>
                                        <span>20%</span>
                                    </div>
                                    <div className="w-full bg-stone-800 h-2 rounded-full">
                                        <div className="h-full bg-white w-[20%] rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10 pt-8 border-t border-stone-800 flex items-center gap-4">
                                <span className="material-symbols-outlined opacity-50">info</span>
                                <p className="text-xs text-stone-400 leading-relaxed italic font-sans">Most "Expert" recipes are generated for French and Japanese fusion categories.</p>
                            </div>
                        </div>
                        
                        <div className="bg-surface-container rounded-xl p-10 font-sans">
                            <h4 className="font-serif text-2xl mb-8">Generation Time by Category</h4>
                            <div className="space-y-6 font-sans">
                                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-secondary">lunch_dining</span>
                                        <span className="font-bold">Main Courses</span>
                                    </div>
                                    <span className="font-serif text-xl font-bold">1.8s</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-secondary">bakery_dining</span>
                                        <span className="font-bold">Desserts &amp; Pastry</span>
                                    </div>
                                    <span className="font-serif text-xl font-bold">2.4s</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-secondary">local_bar</span>
                                        <span className="font-bold">Cocktails &amp; Infusions</span>
                                    </div>
                                    <span className="font-serif text-xl font-bold">0.9s</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-secondary">egg_alt</span>
                                        <span className="font-bold">Quick Breakfasts</span>
                                    </div>
                                    <span className="font-serif text-xl font-bold">1.1s</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                
                {/* Footer Decoration */}
                <footer className="mt-20 px-12 pb-12 opacity-30 pointer-events-none select-none">
                    <div className="flex justify-between items-center border-t border-on-surface-variant/20 pt-8">
                        <span className="font-serif italic text-4xl font-bold">Curated Intelligence</span>
                        <span className="text-sm font-sans uppercase tracking-[0.5em]">Digital Epicurean • 2024</span>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default RecipeAnalytics;
