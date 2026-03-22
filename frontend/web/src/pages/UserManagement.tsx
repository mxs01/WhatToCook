import React from 'react';

const UserManagement: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 bg-background font-sans antialiased overflow-x-hidden overflow-y-auto text-on-surface">
            {/* SideNavBar Anchor */}
            <aside className="fixed left-0 top-0 h-screen flex flex-col py-8 bg-stone-50 dark:bg-zinc-950 w-72 border-r-0 rounded-r-[3rem] shadow-[20px_0px_40px_rgba(26,28,28,0.03)] z-50 font-serif antialiased tracking-tight">
                <div className="px-8 mb-12">
                    <h1 className="text-2xl font-bold italic text-emerald-950 dark:text-emerald-100">WhatToCook</h1>
                    <p className="text-xs font-sans uppercase tracking-widest text-stone-400 mt-1">Admin Console</p>
                </div>
                <nav className="flex-1 flex flex-col gap-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    <a className="flex items-center gap-4 px-6 py-4 text-stone-500 dark:text-zinc-500 hover:text-emerald-900 dark:hover:text-emerald-400 hover:bg-stone-200/30 dark:hover:bg-zinc-800/30 transition-all duration-300" href="/admin/dashboard">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="font-sans text-sm">Dashboard</span>
                    </a>
                    <a className="flex items-center gap-4 px-6 py-4 text-stone-500 dark:text-zinc-500 hover:text-emerald-900 dark:hover:text-emerald-400 hover:bg-stone-200/30 dark:hover:bg-zinc-800/30 transition-all duration-300" href="/admin/analytics">
                        <span className="material-symbols-outlined">analytics</span>
                        <span className="font-sans text-sm">Recipe Analytics</span>
                    </a>
                    <a className="flex items-center gap-4 px-6 py-4 text-emerald-950 dark:text-emerald-50 font-bold border-r-4 border-emerald-900 dark:border-emerald-500 bg-stone-200/50 dark:bg-zinc-800/50 transition-all duration-300" href="#">
                        <span className="material-symbols-outlined">group</span>
                        <span className="font-sans text-sm">User Management</span>
                    </a>
                    <a className="flex items-center gap-4 px-6 py-4 text-stone-500 dark:text-zinc-500 hover:text-emerald-900 dark:hover:text-emerald-400 hover:bg-stone-200/30 dark:hover:bg-zinc-800/30 transition-all duration-300" href="#">
                        <span className="material-symbols-outlined">settings</span>
                        <span className="font-sans text-sm">Settings</span>
                    </a>
                </nav>
                <div className="px-8 mt-auto flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden">
                        <img className="w-full h-full object-cover" alt="Chef Administrator Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkX4Nty4W0bAjpF3GCB0BlnOxtsSqpXFA3hIgzL7MMcv4RpKcHjqX3lLJIhhrbhaWPKRP4uRmfzQrlFSdmz8ngm-U50a_UppvihzQkDuOEmexUyg6jCrXd9o9tL-dbRlARtdZy9sdicUEusFufaSrO9qjH59FNwI1djhXBJyfyCA1yPwIqWedNEqCXWBeH41v2HxXUyypu4dp5-QzK6AOlHn6uMKhou7YIITafxz7yz_Qy-fO9ztegBN5Re1-isUtLp9_3zbQwrCdR" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-on-surface">Admin User</p>
                        <p className="text-[10px] text-secondary">Head Curator</p>
                    </div>
                </div>
            </aside>
            
            {/* TopNavBar Anchor */}
            <header className="fixed top-0 left-0 w-full pl-80 pr-12 py-6 bg-stone-50/80 dark:bg-zinc-950/80 backdrop-blur-xl flex justify-between items-center z-40 font-sans font-medium text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-stone-400">Pages</span>
                    <span className="text-stone-300">/</span>
                    <span className="text-emerald-900 font-semibold">User Management</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative focus-within:ring-2 focus-within:ring-emerald-900/10 transition-all rounded-full">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-lg">search</span>
                        <input className="bg-surface-container-highest border-none rounded-full pl-12 pr-6 py-2 w-72 text-sm focus:ring-0 placeholder:text-stone-400 focus:outline-none" placeholder="Search curated users..." type="text" />
                    </div>
                    <div className="flex items-center gap-4 text-stone-400">
                        <button className="hover:text-emerald-800 transition-colors"><span className="material-symbols-outlined">notifications</span></button>
                        <button className="hover:text-emerald-800 transition-colors"><span className="material-symbols-outlined">help_outline</span></button>
                    </div>
                </div>
            </header>
            
            {/* Main Content Canvas */}
            <main className="ml-72 pt-32 px-12 pb-20">
                {/* Header Stats Section */}
                <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="col-span-2">
                        <h2 className="text-5xl font-serif font-bold text-primary tracking-tight mb-2">User Registry</h2>
                        <p className="text-secondary text-lg font-sans max-w-xl">Oversee the growth and health of your culinary community through deep behavioral insights.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1 bg-surface-container-low p-6 rounded-xl border-none">
                            <p className="text-stone-500 text-xs font-sans uppercase tracking-widest mb-1">Total Curators</p>
                            <p className="text-3xl font-serif font-bold text-primary">12,482</p>
                            <p className="text-xs text-emerald-700 mt-2 flex items-center gap-1 font-bold">
                                <span className="material-symbols-outlined text-sm">trending_up</span> +14% this month
                            </p>
                        </div>
                        <div className="flex-1 bg-primary text-white p-6 rounded-xl border-none">
                            <p className="text-emerald-200/70 text-xs font-sans uppercase tracking-widest mb-1">New Signups</p>
                            <p className="text-3xl font-serif font-bold">84</p>
                            <p className="text-xs text-emerald-300 mt-2 font-medium">Joined today</p>
                        </div>
                    </div>
                </section>
                
                {/* Filters & Table Section */}
                <section className="bg-surface-container-lowest rounded-xl shadow-[0px_20px_40px_rgba(26,28,28,0.03)] overflow-hidden">
                    {/* Filter Bar */}
                    <div className="p-8 border-b-0 bg-stone-50/50 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-sans text-stone-400 uppercase tracking-widest">Tier:</span>
                                <div className="flex bg-surface-container rounded-full p-1">
                                    <button className="px-4 py-1.5 text-xs font-bold bg-white rounded-full shadow-sm text-primary">All</button>
                                    <button className="px-4 py-1.5 text-xs font-medium text-stone-500 hover:text-primary transition-colors">Basic</button>
                                    <button className="px-4 py-1.5 text-xs font-medium text-stone-500 hover:text-primary transition-colors">Pro</button>
                                    <button className="px-4 py-1.5 text-xs font-medium text-stone-500 hover:text-primary transition-colors">Unlimited</button>
                                </div>
                            </div>
                            <div className="h-6 w-[1px] bg-stone-200"></div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-sans text-stone-400 uppercase tracking-widest">Status:</span>
                                <select className="bg-transparent border-none text-xs font-bold text-primary focus:ring-0 p-0 pr-8">
                                    <option>Active</option>
                                    <option>Inactive</option>
                                    <option>Suspended</option>
                                </select>
                            </div>
                        </div>
                        <button className="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                            <span className="material-symbols-outlined text-lg">person_add</span>
                            Add New User
                        </button>
                    </div>
                    
                    {/* Detailed Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-50/50 border-b-0">
                                    <th className="px-8 py-5 text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest">Name &amp; Identity</th>
                                    <th className="px-8 py-5 text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest">Subscription Tier</th>
                                    <th className="px-8 py-5 text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest">Registration Date</th>
                                    <th className="px-8 py-5 text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest">Account Status</th>
                                    <th className="px-8 py-5 text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {/* Row 1 */}
                                <tr className="hover:bg-stone-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden ring-2 ring-transparent group-hover:ring-emerald-900/10 transition-all">
                                                <img className="w-full h-full object-cover" alt="User Avatar Portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdEplLqpLLvSteh4GfhH3yTEF5fVpIB4GP5LzDpK81DSCy-6sAhrZ3rcl0Rn3CU-tXdwWvhKFS3IIoIKzXAo_WyOUptkj17jEzN0EcQJoJGXRy4lJg6G3LcdLLrK77_xwMjVJIi-9-0eaefgRgCT4pnOcdqNPySaYQQGJeOlDACF-5O8lOYn06mdzodzJBdcxh3LYQ3ReTim02wvRg9jY75rICktChUI5ZxuRGttvYVsGmG9qj2Tn5--MM4Sz6g33RduAAvHT9krYo" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-primary">Julian Thorne</p>
                                                <p className="text-xs text-stone-400">j.thorne@epicurean.com</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Unlimited</span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-stone-500 font-medium">Oct 12, 2023</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            <span className="text-xs font-bold text-emerald-600">Active</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-stone-400 hover:text-primary transition-colors" title="Edit User"><span className="material-symbols-outlined text-lg">edit</span></button>
                                            <button className="p-2 text-stone-400 hover:text-primary transition-colors" title="Manage Subscription"><span className="material-symbols-outlined text-lg">payments</span></button>
                                            <button className="p-2 text-stone-400 hover:text-error transition-colors" title="Suspend User"><span className="material-symbols-outlined text-lg">block</span></button>
                                        </div>
                                    </td>
                                </tr>
                                {/* Row 2 */}
                                <tr className="hover:bg-stone-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden">
                                                <img className="w-full h-full object-cover" alt="User Avatar Portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwDVrQUQZWk0AUFrSCU1pzD4ab3MicRnfsewvPR5eYtO-3bRFOfITEbtK83pvVmJ4KkCgp5X9kxt3HbfCElAg5Cl4U9_mtf3PGL-ReaXkmi5OnJBHaUNnp9PxO0uwYe4LZxAp2cwa9O6qEWxsw2EKbe4J5odpHXPasRpLE-MUltM6fB1SqEaLYH03adp0k1BmIyhy_XHQngdEk10jJcDP-3Dt4efLCRz3-55srn7ElKVQ5CninIp5HffsBPIKbYixTFkuWmIeU1SiX" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-primary">Sienna Moretti</p>
                                                <p className="text-xs text-stone-400">s.moretti@cuisine.io</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Basic</span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-stone-500 font-medium">Nov 04, 2023</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            <span className="text-xs font-bold text-emerald-600">Active</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-stone-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                                            <button className="p-2 text-stone-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">payments</span></button>
                                            <button className="p-2 text-stone-400 hover:text-error transition-colors"><span className="material-symbols-outlined text-lg">block</span></button>
                                        </div>
                                    </td>
                                </tr>
                                {/* Row 3 */}
                                <tr className="hover:bg-stone-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden">
                                                <img className="w-full h-full object-cover" alt="User Avatar Portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6plshQKXyZqqHNRqFF8S1w379pDfqateFcdYhmAOpHyB6vWC8FADKJcUZaUg8GgNY2UqXxv6c6v3Mv3LKnCjqBPXbWNSnSQCX9azQ7VLJ0hAw17wbs7mkPc1nFQ_8R8hDbQN8gMzLLC62uP8pCTcBy-LVzYCF_HaoSZ73YpRcw9cBIeFmCtbDEGT72oL_3Mk1jl32F0r4mXN0uVkzCKng2tHH_rGkyDoC06XKI9ZV0KL9PvYEzzdAPk1wFTOAjxfpeZ9ByuYG8tIw" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-primary">Marcus Vane</p>
                                                <p className="text-xs text-stone-400">marcus.v@taste.com</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Pro</span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-stone-500 font-medium">Dec 19, 2023</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
                                            <span className="text-xs font-bold text-stone-400">Inactive</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-stone-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                                            <button className="p-2 text-stone-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">payments</span></button>
                                            <button className="p-2 text-stone-400 hover:text-error transition-colors"><span className="material-symbols-outlined text-lg">block</span></button>
                                        </div>
                                    </td>
                                </tr>
                                {/* Row 4 */}
                                <tr className="hover:bg-stone-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden">
                                                <img className="w-full h-full object-cover" alt="User Avatar Portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApNLm3PQTOnQLnD_mzHOmgW_ifIRDmFiOHfvLdgHdrnGMLv7QHj8uSU5BdBrrVuKEzStBUOdtV0F9EeuBnPv_OPA1_92yEVMXxKVXoRCEWZUpzjc0Nw7TL-zQfF38sZee58COgLH_We54RTkGMnvKAu6Si-9DqkmMO4fbJUN-_tRHo11mKYBWI-4OcqNg8o7UUY3tkrQ87ZSiHSr6IMHuvI-Ze_Bu14ckNznpIzWtD9cBGE_DN7il9uv6BqOSlkWkChLADdyl6_PcI" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-primary">Elena Fischer</p>
                                                <p className="text-xs text-stone-400">elena.f@gourmet.net</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Pro</span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-stone-500 font-medium">Jan 02, 2024</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                            <span className="text-xs font-bold text-error">Suspended</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-stone-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                                            <button className="p-2 text-stone-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">payments</span></button>
                                            <button className="p-2 text-stone-400 hover:text-error transition-colors"><span className="material-symbols-outlined text-lg" style={{fontVariationSettings: '"FILL" 1'}}>undo</span></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* Table Footer */}
                    <div className="p-8 bg-stone-50/30 flex items-center justify-between">
                        <p className="text-xs text-stone-400">Showing <span className="font-bold text-primary">1-4</span> of <span className="font-bold text-primary">12,482</span> users</p>
                        <div className="flex items-center gap-2">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">1</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-xs font-medium text-stone-500 transition-colors">2</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-xs font-medium text-stone-500 transition-colors">3</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                        </div>
                    </div>
                </section>
                
                {/* Subscription Overview Bento (Asymmetric Highlight) */}
                <section className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1 bg-primary-container p-8 rounded-xl flex flex-col justify-between">
                        <div>
                            <h3 className="text-on-primary-container font-serif text-2xl font-bold mb-4 italic">Unlimited Plan</h3>
                            <p className="text-on-primary-container/70 text-sm leading-relaxed mb-6">The highest tier represents our most engaged segment. Currently accounting for 32% of total MRR.</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-serif font-bold text-white">4,028</span>
                            <span className="text-emerald-300 text-xs font-bold">+2.4%</span>
                        </div>
                    </div>
                    <div className="md:col-span-3 bg-surface-container p-8 rounded-xl overflow-hidden relative">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h3 className="text-primary font-serif text-2xl font-bold mb-1">Growth Distribution</h3>
                                <p className="text-stone-500 text-sm">User signups by plan over the last 30 days</p>
                            </div>
                            <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                Download Report <span className="material-symbols-outlined text-sm">file_download</span>
                            </button>
                        </div>
                        <div className="flex items-end gap-3 h-40">
                            <div className="flex-1 bg-primary/10 rounded-t-lg h-[40%] group relative">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Basic</div>
                            </div>
                            <div className="flex-1 bg-primary/40 rounded-t-lg h-[65%] group relative">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Pro</div>
                            </div>
                            <div className="flex-1 bg-primary rounded-t-lg h-[90%] group relative">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Unlimited</div>
                            </div>
                            <div className="flex-1 bg-primary/10 rounded-t-lg h-[30%]"></div>
                            <div className="flex-1 bg-primary/40 rounded-t-lg h-[55%]"></div>
                            <div className="flex-1 bg-primary rounded-t-lg h-[80%]"></div>
                            <div className="flex-1 bg-primary/10 rounded-t-lg h-[45%]"></div>
                            <div className="flex-1 bg-primary/40 rounded-t-lg h-[70%]"></div>
                            <div className="flex-1 bg-primary rounded-t-lg h-[95%]"></div>
                            <div className="flex-1 bg-primary/10 rounded-t-lg h-[25%]"></div>
                        </div>
                        <div className="mt-4 flex justify-between text-[10px] font-sans text-stone-400 uppercase tracking-widest">
                            <span>Week 1</span>
                            <span>Week 2</span>
                            <span>Week 3</span>
                            <span>Week 4</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UserManagement;
