import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function BillingHistory() {
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
              <Link className="flex items-center gap-4 px-6 py-3 text-secondary hover:bg-surface-container-highest rounded-full transition-all" to="/journal">
                <span className="material-symbols-outlined text-lg">history</span>
                <span className="font-sans">Cooking Journal</span>
              </Link>
              <Link className="flex items-center gap-4 px-6 py-3 bg-primary/5 text-primary rounded-full font-semibold transition-all" to="/billing">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>credit_card</span>
                <span className="font-sans">Billing History</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content / Right Column */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-16">
        
        {/* Header Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <nav className="flex items-center gap-2 text-sm text-secondary font-sans font-medium mb-4">
            <Link to="/settings" className="hover:text-primary transition-colors">Account</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-on-surface">Billing History</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-4">Billing History</h1>
          <p className="font-sans text-secondary max-w-xl text-lg leading-relaxed">
            Review your past transactions and manage your digital subscription tiers. Your current plan is <span className="text-primary font-bold italic border-b border-primary/20">Pro Edition</span>.
          </p>
        </div>

        {/* Dashboard Stats Summary (Bento Style) */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col hover:shadow-md transition-shadow">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-secondary mb-2">Next Payment</span>
            <span className="font-serif text-3xl font-bold text-on-surface">Oct 12, 2023</span>
            <span className="font-sans mt-auto pt-4 text-primary font-bold text-sm flex items-center gap-1">
              $24.99 · Pro Plan
            </span>
          </div>

          <div className="bg-primary text-white p-8 rounded-xl shadow-xl flex flex-col col-span-1 md:col-span-2 relative overflow-hidden">
            <div className="relative z-10 h-full flex flex-col justify-center">
              <span className="font-sans text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Primary Payment Method</span>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-9 bg-white/20 rounded-md flex items-center justify-center backdrop-blur-md shadow-inner border border-white/10">
                    <span className="material-symbols-outlined">credit_card</span>
                  </div>
                  <span className="font-sans text-xl font-medium tracking-widest">•••• 4242</span>
                </div>
                <button className="bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-colors border border-white/20">
                  Update
                </button>
              </div>
            </div>
            {/* Abstract gradient texture */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary-fixed/20 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Transactions Table Section */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="px-8 py-6 border-b border-surface-container flex justify-between items-center bg-surface-container-low/30">
              <h2 className="font-serif text-xl font-bold text-primary">Transaction Logs</h2>
              <button className="flex items-center gap-2 font-sans text-sm font-bold text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">filter_list</span>
                Filter
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest text-secondary">Date</th>
                    <th className="px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest text-secondary">Plan Details</th>
                    <th className="px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest text-secondary">Amount</th>
                    <th className="px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest text-secondary">Status</th>
                    <th className="px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest text-secondary text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/60">
                  
                  <tr className="group hover:bg-primary/5 transition-colors cursor-pointer">
                    <td className="px-8 py-6 font-sans text-on-surface font-medium whitespace-nowrap">Sep 12, 2023</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-sans font-bold text-on-surface">Pro Monthly</span>
                        <span className="font-sans text-xs text-secondary mt-1">Unlimited Recipes & AI Analysis</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-sans font-bold text-on-surface whitespace-nowrap">$24.99</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-primary-fixed/50 text-primary-fixed-variant font-sans text-xs font-bold rounded-full border border-primary-fixed">Paid</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <a className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-container text-secondary hover:bg-primary hover:text-white transition-all shadow-sm" href="#">
                        <span className="material-symbols-outlined text-lg">download</span>
                      </a>
                    </td>
                  </tr>

                  <tr className="group hover:bg-primary/5 transition-colors cursor-pointer">
                    <td className="px-8 py-6 font-sans text-on-surface font-medium whitespace-nowrap">Aug 12, 2023</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-sans font-bold text-on-surface">Pro Monthly</span>
                        <span className="font-sans text-xs text-secondary mt-1">Unlimited Recipes & AI Analysis</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-sans font-bold text-on-surface whitespace-nowrap">$24.99</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-primary-fixed/50 text-primary-fixed-variant font-sans text-xs font-bold rounded-full border border-primary-fixed">Paid</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <a className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-container text-secondary hover:bg-primary hover:text-white transition-all shadow-sm" href="#">
                        <span className="material-symbols-outlined text-lg">download</span>
                      </a>
                    </td>
                  </tr>

                  <tr className="group hover:bg-primary/5 transition-colors cursor-pointer">
                    <td className="px-8 py-6 font-sans text-on-surface font-medium whitespace-nowrap">Jul 12, 2023</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-sans font-bold text-on-surface">Basic Tier</span>
                        <span className="font-sans text-xs text-secondary mt-1">Standard Recipe Access</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-sans font-bold text-on-surface whitespace-nowrap">$9.99</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-primary-fixed/50 text-primary-fixed-variant font-sans text-xs font-bold rounded-full border border-primary-fixed">Paid</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <a className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-container text-secondary hover:bg-primary hover:text-white transition-all shadow-sm" href="#">
                        <span className="material-symbols-outlined text-lg">download</span>
                      </a>
                    </td>
                  </tr>

                  <tr className="group hover:bg-primary/5 transition-colors cursor-pointer">
                    <td className="px-8 py-6 font-sans text-on-surface font-medium whitespace-nowrap">Jun 12, 2023</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-sans font-bold text-on-surface">Basic Tier</span>
                        <span className="font-sans text-xs text-secondary mt-1">Standard Recipe Access</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-sans font-bold text-on-surface whitespace-nowrap">$9.99</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-primary-fixed/50 text-primary-fixed-variant font-sans text-xs font-bold rounded-full border border-primary-fixed">Paid</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <a className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-container text-secondary hover:bg-primary hover:text-white transition-all shadow-sm" href="#">
                        <span className="material-symbols-outlined text-lg">download</span>
                      </a>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
            
            {/* Pagination Placeholder */}
            <div className="px-8 py-6 bg-surface-container-low/30 border-t border-surface-container flex justify-center">
              <div className="flex items-center gap-4">
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest shadow-sm border border-outline-variant/20 text-secondary hover:text-primary hover:border-primary/30 transition-all">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <span className="px-4 font-sans text-xs font-bold text-primary uppercase tracking-widest">Page 1 of 3</span>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest shadow-sm border border-outline-variant/20 text-secondary hover:text-primary hover:border-primary/30 transition-all">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>

          </div>

          {/* Footer Support Note */}
          <div className="mt-12 text-center pb-8">
            <p className="font-sans text-secondary text-sm">
              Questions about your billing? <a className="text-primary font-bold border-b-2 border-primary/20 hover:border-primary transition-all" href="#">Contact our Concierge</a>
            </p>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
}
