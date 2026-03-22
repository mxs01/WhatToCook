import { useEffect } from 'react';
import CardNumberInput from './CardNumberInput';
import ExpiryDateDropdown from './ExpiryDateDropdown';

interface UpdatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdatePaymentModal({ isOpen, onClose }: UpdatePaymentModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] h-[100vh] overflow-hidden flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg mx-4 bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Modal Header */}
        <div className="px-10 pt-10 pb-6 text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 text-emerald-800 rounded-full mb-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          </div>
          <h2 className="font-serif text-3xl text-emerald-950 font-bold tracking-tight">Update Payment Method</h2>
          <p className="text-stone-500 text-sm font-sans">Securely update your primary billing card.</p>
        </div>
        
        {/* Form */}
        <form className="px-10 pb-10 space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400 ml-1">Cardholder Name</label>
              <div className="relative">
                <input className="w-full font-sans bg-surface-container-low border-none rounded-full px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-900/10 placeholder:text-stone-300" placeholder="Julian V. Epicure" type="text" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400 ml-1">Card Number</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-stone-400">credit_card</span>
                <CardNumberInput className="w-full font-sans bg-surface-container-low border-none rounded-full pl-14 pr-6 py-4 text-sm focus:ring-2 focus:ring-emerald-900/10 placeholder:text-stone-300" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400 ml-1">Expiry Date</label>
                <ExpiryDateDropdown className="w-full font-sans bg-surface-container-low border-none rounded-full px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-900/10 placeholder:text-stone-300" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400 ml-1">CVC</label>
                <input className="w-full font-sans bg-surface-container-low border-none rounded-full px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-900/10 placeholder:text-stone-300" placeholder="•••" type="text" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <button className="w-full py-4 bg-gradient-to-tr from-primary-container to-primary text-on-primary rounded-full font-sans font-bold text-sm shadow-xl shadow-emerald-950/30 active:scale-95 transition-all" type="submit">
                Update Payment
            </button>
            <button 
              className="w-full py-4 text-secondary font-sans font-bold text-sm hover:text-primary transition-colors" 
              type="button"
              onClick={onClose}
            >
                Cancel
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-4 pt-4 opacity-30 grayscale">
            <img alt="Visa logo" className="h-6 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu7WP56ZsAZsTPjNBTGiaHMZrQQ2Np4N6KlTfMLRG4Nh9fgyAAE503qbL_LrpuTH2s0hZUWW2lON9pPaixtOyJNcWq31B-f48-hhA0YHN953CP_cpT1Ipa9bDYUS1LV_8CCrM_6y8LgX7IyroNutXiupCOQXWvE59yoxQ7k0UhTkSru9CatCLH9lhRhIZmLpat5DQ91SR2BDHL4y35jN5YMQ-c1oNWy4uM_zNigRUy2s2ElFdohLBi0Hch7OlbzWmKW6UNXhf3g0L9" />
            <img alt="Mastercard logo" className="h-6 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYRchK0DR_4249yZRmBC_nK0ZusfvHgnew6w6AcQKUoCWyKHymwrRnuPY49EGeficvaqACpdamyTsSgxG85-iNYr3thjcT9OgM3mW5BgYacLeHc97UML7A-ZUnII4nzXU3HmWHwJ2qktkT1G4VkonV2Dg4kYvz6gYvRshufL-MIB-Tyo_7wVLHvWKatpOyLtoMJ3g69DFrkIfQPjpd0Hvs8-NMnWNQqAaImpyKSCvm3EWNZYRUyvXbS9xA4rgl7PKYjbBjKv-bjfXG" />
            <img alt="Amex logo" className="h-6 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6PH-WW01uNNyQ6oUjJ67YicftcyQofgt9q1Dk2Cl8epq30TfpEdopKLRpPI8DLfxTcxiHx5XAYWE3TpTLwF_viPN1jGK1aDxTyWDo5bDtWFMe3MVWNO1lGbCgRLm_WghTMyvhijz1tZjLitz00XsLPwR7ga1Kmsak8pvXTu2rfCgR4UJWqT1LeP9fb6VfhlPK8PN4Zb_mX6lMfvK2Fd1Du34B4M4fq-8YO12Gzb9A7Vpyh7MumCsWHlM9WeLOfmeFLcbVgLwmyiC5" />
          </div>
        </form>
      </div>
    </div>
  );
}
