import React from 'react';

const AdminDashboard: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 bg-background font-sans text-on-surface antialiased overflow-x-hidden overflow-y-auto">
            {/* SideNavBar Shell */}
            <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-stone-50 border-r border-stone-200/50 z-50">
                <div className="p-8 pb-4">
                    <h1 className="font-serif text-xl font-bold text-emerald-950">WhatToCook</h1>
                    <p className="text-xs font-sans tracking-widest text-secondary mt-1">Admin Control</p>
                </div>
                <nav className="mt-8 flex-1 space-y-1 px-4">
                    {/* Active: Dashboard */}
                    <a className="flex items-center gap-3 px-4 py-3 text-emerald-900 font-bold border-r-4 border-emerald-900 hover:bg-stone-100 transition-colors" href="#">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm tracking-tight">Dashboard</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-stone-500 hover:text-emerald-800 hover:bg-stone-100 transition-colors" href="/admin/analytics">
                        <span className="material-symbols-outlined">analytics</span>
                        <span className="text-sm tracking-tight">Recipe Analytics</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-stone-500 hover:text-emerald-800 hover:bg-stone-100 transition-colors" href="/admin/users">
                        <span className="material-symbols-outlined">group</span>
                        <span className="text-sm tracking-tight">User Management</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-stone-500 hover:text-emerald-800 hover:bg-stone-100 transition-colors" href="#">
                        <span className="material-symbols-outlined">settings</span>
                        <span className="text-sm tracking-tight">Settings</span>
                    </a>
                </nav>
                <div className="p-8 mt-auto space-y-4">
                    <button className="w-full py-3 bg-primary text-on-primary rounded-full font-sans text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
                        Generate Report
                    </button>
                    <div className="pt-4 border-t border-stone-200/50 space-y-2">
                        <a className="flex items-center gap-3 text-stone-500 text-sm hover:text-emerald-800" href="#">
                            <span className="material-symbols-outlined text-lg">help</span> Help Center
                        </a>
                        <a className="flex items-center gap-3 text-stone-500 text-sm hover:text-emerald-800" href="/">
                            <span className="material-symbols-outlined text-lg">logout</span> Sign Out
                        </a>
                    </div>
                </div>
            </aside>
            
            {/* Main Content Canvas */}
            <main className="ml-64 min-h-screen">
                {/* TopNavBar Shell */}
                <header className="sticky top-0 z-40 flex justify-between items-center h-16 px-8 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 shadow-sm">
                    <div className="flex items-center bg-surface-container-low rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-emerald-500/20 w-96">
                        <span className="material-symbols-outlined text-secondary mr-2">search</span>
                        <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-stone-400 focus:outline-none" placeholder="Search culinary data..." type="text" />
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 text-emerald-900">
                            <button className="hover:text-emerald-700 transition-all">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <button className="hover:text-emerald-700 transition-all">
                                <span className="material-symbols-outlined">dark_mode</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs font-bold leading-none">Admin User</p>
                                <p className="text-[10px] text-secondary">System Architect</p>
                            </div>
                            <img className="w-8 h-8 rounded-full object-cover" alt="Admin User Profile Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6-O3-eqwzWqO3qTXLTV2YZBEYmLW-lCxhifvyH1KSQgOHloCWxXtQ50mbZqUpcw7Niz3K8QG041r8u--_NTAZNcVzDk6G1d8r43bgJiJZOwVJL6wBShEJ3fd2vz6bOjBuD3yNBgziHbKmicHxFJEzqx3xN4kJlD60t48doSeOSq26DULtd7dLF8mZ_ckyIG2IuYbq5NEvHGxS9pbbsz5KpYjNZdzwsz9AHJ39TWwPaM-jEpVbWVMBVKXP2BB7AI_SFE69tvrrt3Qz" />
                        </div>
                    </div>
                </header>
                
                <div className="p-10 space-y-12">
                    {/* Hero Header Section */}
                    <section className="flex justify-between items-end">
                        <div>
                            <h2 className="font-serif text-4xl font-bold tracking-tight text-primary">Intelligence Hub</h2>
                            <p className="text-secondary mt-2 max-w-lg">Monitoring the pulse of our AI-driven culinary engine. Real-time metrics for global recipe generation and system integrity.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-outline-variant/20 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-xs font-bold uppercase tracking-widest text-secondary">System Online</span>
                            </div>
                        </div>
                    </section>
                    
                    {/* Recipe Generation Stats Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Stat Card */}
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-outline-variant/10 group hover:shadow-md transition-shadow">
                            <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">Last 60 Min</p>
                            <h3 className="font-serif text-5xl font-bold text-primary tracking-tighter">482</h3>
                            <p className="text-emerald-600 text-xs font-bold mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">trending_up</span> +5.2%
                            </p>
                        </div>
                        {/* Stat Card */}
                        <div className="bg-primary p-8 rounded-lg shadow-sm text-on-primary">
                            <p className="text-xs font-bold text-primary-fixed uppercase tracking-widest mb-4">Last 24h</p>
                            <h3 className="font-serif text-5xl font-bold tracking-tighter">11.4k</h3>
                            <p className="text-emerald-300 text-xs font-bold mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">trending_up</span> +12.4%
                            </p>
                        </div>
                        {/* Stat Card */}
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-outline-variant/10">
                            <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">This Week</p>
                            <h3 className="font-serif text-5xl font-bold text-primary tracking-tighter">82.9k</h3>
                            <p className="text-emerald-600 text-xs font-bold mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">trending_up</span> +8.1%
                            </p>
                        </div>
                        {/* Stat Card */}
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-outline-variant/10">
                            <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">This Month</p>
                            <h3 className="font-serif text-5xl font-bold text-primary tracking-tighter">342k</h3>
                            <p className="text-emerald-600 text-xs font-bold mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">trending_up</span> +15.3%
                            </p>
                        </div>
                    </section>
                    
                    {/* Main Insights Section (Bento Style) */}
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* User Growth Trend Card (8 cols) */}
                        <div className="lg:col-span-8 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <div className="p-8 border-b border-surface-container">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-serif text-2xl font-bold text-primary">User Growth Trend</h4>
                                        <p className="text-sm text-secondary">Cohort acquisition vs retention performance</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-bold text-primary">+12.4%</span>
                                        <p className="text-[10px] text-secondary font-bold uppercase tracking-tighter">Vs Last Week</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 min-h-[300px] relative p-8 flex items-end gap-2 overflow-hidden">
                                {/* Simulated Line Chart with SVG */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                                    <span className="font-serif text-[10rem] font-black italic">GROWTH</span>
                                </div>
                                <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 180C50 170 100 120 150 110C200 100 250 140 300 130C350 120 400 60 450 50C500 40 550 80 600 70C650 60 700 20 800 10" stroke="currentColor" strokeLinecap="round" strokeWidth="4"></path>
                                    <path d="M0 180C50 170 100 120 150 110C200 100 250 140 300 130C350 120 400 60 450 50C500 40 550 80 600 70C650 60 700 20 800 10V200H0V180Z" fill="url(#gradient-growth)" fillOpacity="0.1"></path>
                                    <defs>
                                        <linearGradient gradientUnits="userSpaceOnUse" id="gradient-growth" x1="400" x2="400" y1="0" y2="200">
                                            <stop stopColor="currentColor"></stop>
                                            <stop offset="1" stopColor="currentColor" stopOpacity="0"></stop>
                                        </linearGradient>
                                    </defs>
                                </svg>
                                {/* Chart Tooltip */}
                                <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] px-3 py-1.5 rounded-full font-bold shadow-lg">
                                    Peak Active: 1,429 Users
                                </div>
                            </div>
                        </div>
                        
                        {/* LLM Performance & System Health (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <h4 className="font-serif text-xl font-bold text-primary leading-tight">System Performance</h4>
                                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">Healthy</span>
                                    </div>
                                    <div className="space-y-8">
                                        <div>
                                            <div className="flex justify-between items-end mb-2">
                                                <p className="text-xs font-bold text-secondary uppercase tracking-widest">Avg LLM Latency</p>
                                                <p className="text-lg font-bold text-primary">1.8s</p>
                                            </div>
                                            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-900 w-[75%] rounded-full"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-end mb-2">
                                                <p className="text-xs font-bold text-secondary uppercase tracking-widest">Token Efficiency</p>
                                                <p className="text-lg font-bold text-primary">94.2%</p>
                                            </div>
                                            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-900 w-[94%] rounded-full"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-end mb-2">
                                                <p className="text-xs font-bold text-secondary uppercase tracking-widest">Error Rate</p>
                                                <p className="text-lg font-bold text-primary">0.02%</p>
                                            </div>
                                            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-900 w-[2%] rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-surface-container">
                                    <button className="flex items-center gap-2 text-xs font-bold text-primary hover:gap-3 transition-all">
                                        VIEW COMPLETE DIAGNOSTICS <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Recent Activity Table */}
                    <section className="bg-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
                        <div className="p-8 border-b border-surface-container flex justify-between items-center">
                            <h4 className="font-serif text-2xl font-bold text-primary">Recent Recipe Generation</h4>
                            <button className="text-xs font-bold text-secondary flex items-center gap-2 hover:text-primary">
                                <span className="material-symbols-outlined text-lg">filter_list</span> FILTER
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-surface-container-low">
                                        <th className="px-8 py-4 text-[10px] font-black text-secondary uppercase tracking-widest">Timestamp</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-secondary uppercase tracking-widest">User Identity</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-secondary uppercase tracking-widest">Recipe Concept</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-secondary uppercase tracking-widest">Processing Time</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-secondary uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-container">
                                    <tr className="hover:bg-surface-container-low transition-colors group">
                                        <td className="px-8 py-6 text-sm font-medium text-stone-400">2 mins ago</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-bold text-primary">JD</div>
                                                <span className="text-sm font-bold text-primary">Julian de Silva</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-serif italic text-primary">Saffron-Infused Risotto with Wild Mushrooms</span>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-medium text-primary">1.4s</td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">COMPLETED</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-surface-container-low transition-colors group">
                                        <td className="px-8 py-6 text-sm font-medium text-stone-400">14 mins ago</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-primary">ML</div>
                                                <span className="text-sm font-bold text-primary">Marcus Laurent</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-serif italic text-primary">Deconstructed Duck Confit with Cherry Reduction</span>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-medium text-primary">2.1s</td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">COMPLETED</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-surface-container-low transition-colors group">
                                        <td className="px-8 py-6 text-sm font-medium text-stone-400">22 mins ago</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <img className="w-8 h-8 rounded-full object-cover" alt="User Avatar Small" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyvyZLGQUs5j8M6M6VRc1XDmr2CEOy45z3KoWhVRNz6pXwNxyfXpW1rOyzF34v9PjkZugGGf88uk29I0hg3YEwCKvvJd6J_mYJ7EbazMgzGi84zX8hGqTdGqGnhxS2n36es9inWENK1JwzVy7iLfhdUl97wvKx1D-N5EXQfBwACfj7exEOG09uNwgauLK0sihninBpYJ7ZHLcQfmiUbS2VAa99u7scI1mZga2HJclUfShOS2nSOES-OA2JYh7x1tBTg924XbtLE5L_" />
                                                <span className="text-sm font-bold text-primary">Elena Rodriguez</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-serif italic text-primary">Truffle-Glazed Cauliflower Steak</span>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-medium text-primary">1.8s</td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">COMPLETED</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-surface-container-low transition-colors group">
                                        <td className="px-8 py-6 text-sm font-medium text-stone-400">31 mins ago</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-primary">SC</div>
                                                <span className="text-sm font-bold text-primary">Sarah Chen</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-serif italic text-primary">Midnight Sea Bass with Charcoal Emulsion</span>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-medium text-primary">4.5s</td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">RETRIED</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 bg-surface-container-lowest text-center">
                            <button className="text-xs font-bold text-secondary hover:text-primary transition-colors uppercase tracking-widest">
                                View all activity log
                            </button>
                        </div>
                    </section>
                </div>
                
                {/* Floating Quick Action Button */}
                <button className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all z-50">
                    <span className="material-symbols-outlined text-3xl">add</span>
                </button>
            </main>
        </div>
    );
};

export default AdminDashboard;
