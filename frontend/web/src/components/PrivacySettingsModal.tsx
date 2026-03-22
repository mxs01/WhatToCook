import { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacySettingsModal({ isOpen, onClose }: Props) {
  const [visible, setVisible] = useState(true);
  const [share, setShare] = useState(false);
  const [personalization, setPersonalization] = useState(true);

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
        className="w-full max-w-2xl bg-surface-container-lowest/90 backdrop-blur-3xl rounded-xl shadow-[0px_20px_40px_rgba(26,28,28,0.06)] overflow-hidden animate-in fade-in zoom-in duration-300 cursor-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="px-12 pt-12 pb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-serif text-4xl font-bold tracking-tight text-on-surface mb-2">Privacy Settings</h2>
              <p className="font-sans text-secondary text-sm">Manage how your culinary journey is shared and curated.</p>
            </div>
            <button onClick={onClose} className="material-symbols-outlined text-outline hover:text-on-surface transition-colors">close</button>
          </div>
        </div>
        
        <div className="px-12 pb-12 space-y-10">
          {/* Setting 1 */}
          <div className="flex items-center justify-between group">
            <div className="flex gap-6 items-start max-w-md">
              <div className="bg-surface-container flex items-center justify-center w-12 h-12 rounded-full shrink-0 transition-all group-hover:bg-primary-fixed">
                <span className="material-symbols-outlined text-on-surface-variant">public</span>
              </div>
              <div>
                <h3 className="font-sans font-semibold text-on-surface text-lg">Visible to Community</h3>
                <p className="font-sans text-secondary text-sm leading-relaxed mt-1">Allow others to find your curator profile and see your taste profile and public collections.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={visible} onChange={e => setVisible(e.target.checked)} className="sr-only peer" />
              <div className="w-14 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-primary-container"></div>
            </label>
          </div>
          
          {/* Setting 2 */}
          <div className="flex items-center justify-between group">
            <div className="flex gap-6 items-start max-w-md">
              <div className="bg-surface-container flex items-center justify-center w-12 h-12 rounded-full shrink-0 transition-all group-hover:bg-primary-fixed">
                <span className="material-symbols-outlined text-on-surface-variant">restaurant_menu</span>
              </div>
              <div>
                <h3 className="font-sans font-semibold text-on-surface text-lg">Share Cooking Activity</h3>
                <p className="font-sans text-secondary text-sm leading-relaxed mt-1">Broadcast your live culinary sessions to followers and the Epicurean activity feed.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={share} onChange={e => setShare(e.target.checked)} className="sr-only peer" />
              <div className="w-14 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-primary-container"></div>
            </label>
          </div>
          
          {/* Setting 3 */}
          <div className="flex items-center justify-between group">
            <div className="flex gap-6 items-start max-w-md">
              <div className="bg-surface-container flex items-center justify-center w-12 h-12 rounded-full shrink-0 transition-all group-hover:bg-primary-fixed">
                <span className="material-symbols-outlined text-on-surface-variant">auto_awesome</span>
              </div>
              <div>
                <h3 className="font-sans font-semibold text-on-surface text-lg">Data Personalization</h3>
                <p className="font-sans text-secondary text-sm leading-relaxed mt-1">Use AI to curate recipes based on history. Your culinary data stays encrypted and private.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={personalization} onChange={e => setPersonalization(e.target.checked)} className="sr-only peer" />
              <div className="w-14 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-primary-container"></div>
            </label>
          </div>
          
          <div className="pt-6 flex justify-end gap-4">
            <button onClick={onClose} className="px-8 py-4 font-sans font-medium text-on-surface-variant hover:bg-surface-container rounded-full transition-all">Cancel</button>
            <button onClick={onClose} className="px-10 py-4 font-sans font-semibold text-white bg-gradient-to-br from-primary to-primary-container rounded-full shadow-lg hover:shadow-xl active:scale-[0.98] transition-all">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
