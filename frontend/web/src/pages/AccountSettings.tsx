export default function AccountSettings() {

  return (
    <div className="space-y-16 w-full">
          
          {/* Subscription Section */}
          <section>
            <div className="relative overflow-hidden rounded-xl bg-primary text-on-primary p-12 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/40 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="relative z-10 space-y-2">
                <h2 className="text-4xl font-serif italic">Epicurean Pro</h2>
                <p className="text-on-primary-container font-light max-w-md font-sans">
                  Your gateway to bespoke AI meal planning and high-fidelity culinary curation.
                </p>
                <div className="flex gap-6 pt-4 text-sm font-sans uppercase tracking-widest opacity-80">
                  <span>Billed annually</span>
                  <span className="w-px h-4 bg-on-primary/20"></span>
                  <span>Next renewal July 2024</span>
                </div>
              </div>
              <button className="relative z-10 px-8 py-4 bg-white text-stone-900 font-extrabold font-sans tracking-wide rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl">
                Manage Plan
              </button>
            </div>
          </section>

          {/* Preferences Grid */}
          <section className="space-y-8">
            <h3 className="text-xl font-serif text-primary flex items-center gap-2">
              <span className="w-8 h-px bg-primary/20"></span>
              Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1 */}
              <div className="group p-8 bg-surface-container-lowest rounded-lg hover:shadow-xl hover:shadow-surface-container-highest/50 transition-all duration-500 border border-outline-variant/20 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-6 group-hover:bg-primary-fixed transition-colors">
                  <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">notifications</span>
                </div>
                <h4 className="text-lg font-serif mb-2 text-primary">Notification Preferences</h4>
                <p className="text-sm text-secondary font-sans leading-relaxed">
                  Curate how we reach you for seasonal updates and AI recipe drops.
                </p>
              </div>

              {/* Card 2 */}
              <div className="group p-8 bg-surface-container-lowest rounded-lg hover:shadow-xl hover:shadow-surface-container-highest/50 transition-all duration-500 border border-outline-variant/20 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-6 group-hover:bg-primary-fixed transition-colors">
                  <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">shield</span>
                </div>
                <h4 className="text-lg font-serif mb-2 text-primary">Privacy Settings</h4>
                <p className="text-sm text-secondary font-sans leading-relaxed">
                  Manage your data fingerprint and social visibility of your kitchen collections.
                </p>
              </div>

              {/* Card 3 */}
              <div className="group p-8 bg-surface-container-lowest rounded-lg hover:shadow-xl hover:shadow-surface-container-highest/50 transition-all duration-500 border border-outline-variant/20 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-6 group-hover:bg-primary-fixed transition-colors">
                  <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">restaurant</span>
                </div>
                <h4 className="text-lg font-serif mb-2 text-primary">Cooking Level</h4>
                <p className="text-sm text-secondary font-sans leading-relaxed">
                  Currently: <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Intermediate</span>. Adjust your AI baseline.
                </p>
              </div>

            </div>
          </section>

          {/* Security / Profile Section */}
          <section className="p-12 bg-surface-container-low rounded-xl space-y-8">
            <h3 className="text-xl font-serif text-primary">Security & Access</h3>
            <div className="space-y-6">
              
              <div className="flex items-center justify-between p-6 bg-surface-container-lowest rounded-lg border border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary">key</span>
                  <div>
                    <p className="font-bold text-sm font-sans text-on-surface">Two-Factor Authentication</p>
                    <p className="text-xs text-secondary font-sans mt-0.5">Enhanced security for your culinary vault.</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-surface-dim rounded-full relative cursor-pointer group hover:bg-secondary-fixed-dim transition-colors">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm group-hover:scale-105 transition-transform"></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-surface-container-lowest rounded-lg border border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary">devices</span>
                  <div>
                    <p className="font-bold text-sm font-sans text-on-surface">Active Sessions</p>
                    <p className="text-xs text-secondary font-sans mt-0.5">3 devices currently connected.</p>
                  </div>
                </div>
                <button className="text-xs font-bold font-sans text-primary uppercase tracking-widest hover:underline hover:opacity-80 transition-opacity">
                  View All
                </button>
              </div>

            </div>
          </section>

          {/* Danger Zone */}
          <section className="pt-8 border-t border-outline-variant/20">
            <div className="p-12 bg-error-container/20 rounded-xl border-2 border-dashed border-error/30 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-2">
                <h3 className="text-xl font-serif text-error">Danger Zone</h3>
                <p className="text-sm text-on-surface-variant font-sans max-w-md">
                  This action is permanent and cannot be undone. All recipes, history, and kitchen data will be purged.
                </p>
              </div>
              <button className="px-8 py-3 bg-error text-white font-bold font-sans tracking-wide rounded-full hover:bg-error/90 transition-all active:scale-95 shadow-sm">
                Delete Account
              </button>
            </div>
          </section>

    </div>
  );
}
