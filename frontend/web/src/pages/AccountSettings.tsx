export default function AccountSettings() {
  return (
    <div className="min-h-screen bg-surface pt-32 pb-20 px-8 flex justify-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-5xl font-serif text-primary mb-12">Account Settings</h1>
        
        <div className="bg-surface-container-lowest rounded-3xl p-10 shadow-sm border border-outline-variant/15 flex flex-col gap-8">
          
          <div className="flex flex-col gap-2">
            <label className="font-serif text-lg text-primary">Full Name</label>
            <input 
              type="text" 
              defaultValue="John Doe"
              className="w-full bg-surface-container-highest rounded-full px-6 py-4 font-sans text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-serif text-lg text-primary">Email Address</label>
            <input 
              type="email" 
              defaultValue="john@example.com"
              className="w-full bg-surface-container-highest rounded-full px-6 py-4 font-sans text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-serif text-lg text-primary">Subscription Tier</label>
            <div className="flex justify-between items-center bg-surface-container px-6 py-4 rounded-full border border-outline-variant/20">
              <span className="font-sans text-on-surface">The Digital Epicurean (Pro)</span>
              <button className="text-primary font-medium text-sm hover:underline">Manage</button>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-outline-variant/20 flex justify-end gap-4">
            <button className="px-8 py-3 rounded-full border border-outline-variant text-secondary font-medium hover:bg-surface-container-low transition-colors">
              Cancel
            </button>
            <button className="px-8 py-3 rounded-full primary-gradient font-medium text-white shadow-md hover:shadow-lg transition-shadow">
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
