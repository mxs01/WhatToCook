import { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPreferencesModal({ isOpen, onClose }: Props) {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  const [alerts, setAlerts] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] h-[100vh] overflow-hidden flex items-center justify-center bg-zinc-100/50 dark:bg-zinc-900/50 backdrop-blur-xl p-6 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl animate-in fade-in zoom-in duration-300 cursor-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-surface-container-lowest shadow-[0px_20px_40px_rgba(26,28,28,0.06)] rounded-xl overflow-hidden border border-outline-variant/15">
          <div className="px-12 pt-12 pb-8 text-center">
            <h2 className="font-serif text-4xl font-bold text-on-surface tracking-tight leading-tight">Notification Preferences</h2>
            <p className="font-sans text-secondary mt-2 tracking-wide text-sm uppercase">Curate how we reach you.</p>
          </div>
          
          <div className="px-12 space-y-4">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-lg border border-transparent hover:border-outline-variant/30 transition-all duration-300">
              <div>
                <h4 className="font-sans text-lg font-semibold text-on-surface">Push Notifications</h4>
                <p className="font-sans text-xs text-secondary mt-1">Real-time alerts for active kitchen sessions.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={push} onChange={e => setPush(e.target.checked)} className="sr-only peer" />
                <div className="w-12 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[linear-gradient(45deg,#061b0e_0%,#1b3022_100%)]"></div>
              </label>
            </div>
            
            {/* Toggle 2 */}
            <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-lg border border-transparent hover:border-outline-variant/30 transition-all duration-300">
              <div>
                <h4 className="font-sans text-lg font-semibold text-on-surface">Email Newsletters</h4>
                <p className="font-sans text-xs text-secondary mt-1">Weekly editorial digests and curator picks.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={email} onChange={e => setEmail(e.target.checked)} className="sr-only peer" />
                <div className="w-12 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[linear-gradient(45deg,#061b0e_0%,#1b3022_100%)]"></div>
              </label>
            </div>
            
            {/* Toggle 3 */}
            <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-lg border border-transparent hover:border-outline-variant/30 transition-all duration-300">
              <div>
                <h4 className="font-sans text-lg font-semibold text-on-surface">Recipe Alerts</h4>
                <p className="font-sans text-xs text-secondary mt-1">Notifications for new seasonal ingredients.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={alerts} onChange={e => setAlerts(e.target.checked)} className="sr-only peer" />
                <div className="w-12 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[linear-gradient(45deg,#061b0e_0%,#1b3022_100%)]"></div>
              </label>
            </div>
          </div>

          <div className="px-12 py-10 flex flex-col items-center gap-4">
            <button onClick={onClose} className="w-full py-5 rounded-full bg-primary text-on-primary font-sans font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 bg-[linear-gradient(45deg,#061b0e_0%,#1b3022_100%)]">
              Save Preferences
            </button>
            <button onClick={onClose} className="px-8 py-2 text-stone-400 hover:text-on-surface font-sans text-xs tracking-widest uppercase transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
