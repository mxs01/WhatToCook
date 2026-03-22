import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const displayName = user?.name || "Alexander";

  const navLinks = [
    { path: "/settings", icon: "person", label: "Profile Details" },
    { path: "/journal", icon: "history", label: "Cooking Journal" },
    { path: "/billing", icon: "credit_card", label: "Billing History" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navigation />
      <main className="flex-1 w-full relative">
        <div className="pt-32 pb-20 px-12 max-w-[1600px] mx-auto text-on-surface">
          <div className="grid grid-cols-12 gap-16">
            
            {/* Navigational Sidebar */}
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
                  {navLinks.map((link) => {
                    const isActive = location.pathname.startsWith(link.path);
                    return (
                      <Link 
                        key={link.path}
                        className={`flex items-center gap-4 px-6 py-3 rounded-full transition-all font-semibold ${isActive ? 'bg-primary/5 text-primary' : 'text-secondary hover:bg-surface-container-highest'}`} 
                        to={link.path}
                      >
                        <span className="material-symbols-outlined text-lg" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{link.icon}</span>
                        <span className="font-sans">{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Injected Content */}
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <Outlet />
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
