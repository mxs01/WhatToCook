import { useState, useEffect } from 'react';
import CardNumberInput from './CardNumberInput';
import ExpiryDateDropdown from './ExpiryDateDropdown';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'MAIN' | 'ANNUAL' | 'PAYMENT' | 'CANCEL' | 'SWITCH_PLAN';

export default function ManagePlanModal({ isOpen, onClose }: Props) {
  const [view, setView] = useState<ViewState>('MAIN');

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setView('MAIN');
    onClose();
  };

  const renderMain = () => (
    <>
      <div className="px-12 pt-12 pb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-serif text-4xl font-bold tracking-tight text-on-surface mb-2">Manage Plan</h2>
            <p className="font-sans text-secondary text-sm">Update your subscription tier or modify your billing cycle.</p>
          </div>
          <button onClick={handleClose} className="material-symbols-outlined text-outline hover:text-on-surface transition-colors">close</button>
        </div>
      </div>
      
      <div className="px-12 pb-6 space-y-8">
        <div className="p-6 bg-primary rounded-xl text-on-primary relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/40 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="relative z-10 w-full flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-on-primary-container mb-2 block">Current Tier</span>
              <h3 className="text-3xl font-serif italic mb-1">Epicurean Pro</h3>
              <p className="font-sans text-sm opacity-90">$24.99 / month</p>
            </div>
            <span className="material-symbols-outlined text-5xl opacity-20">verified</span>
          </div>
        </div>

        <div className="space-y-4">
          <button onClick={() => setView('SWITCH_PLAN')} className="w-full flex items-center justify-between p-4 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors group">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">swap_vert</span>
              <div className="text-left">
                <p className="font-bold text-sm text-on-surface">Change Subscription Tier</p>
                <p className="font-sans text-xs text-secondary mt-1">Upgrade or downgrade your current plan.</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>

          <button onClick={() => setView('ANNUAL')} className="w-full flex items-center justify-between p-4 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors group">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">autorenew</span>
              <div className="text-left">
                <p className="font-bold text-sm text-on-surface">Switch to Annual Billing</p>
                <p className="font-sans text-xs text-secondary mt-1">Save 20% compared to monthly.</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
          
          <button onClick={() => setView('PAYMENT')} className="w-full flex items-center justify-between p-4 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors group">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">credit_card</span>
              <div className="text-left">
                <p className="font-bold text-sm text-on-surface">Update Payment Method</p>
                <p className="font-sans text-xs text-secondary mt-1">Visa ending in 4242.</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
        </div>

        <div className="pt-6 border-t border-outline-variant/20 flex flex-col gap-4 items-center pb-0">
          <button onClick={handleClose} className="w-full py-4 rounded-full bg-primary text-on-primary font-sans font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 bg-[linear-gradient(45deg,#061b0e_0%,#1b3022_100%)]">
            Close Details
          </button>
          <button onClick={() => setView('CANCEL')} className="w-full py-4 rounded-full border border-error/50 bg-error/10 text-error font-sans font-bold text-sm tracking-widest uppercase hover:bg-error hover:text-white hover:border-error transition-colors focus:outline-none">
            Cancel Subscription
          </button>
        </div>
      </div>
    </>
  );

  const renderAnnual = () => (
    <>
      <div className="px-12 pt-12 pb-6 border-b border-outline-variant/10">
        <button onClick={() => setView('MAIN')} className="text-secondary hover:text-on-surface flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-widest mb-6 transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back
        </button>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-on-surface mb-2">Annual Billing</h2>
        <p className="font-sans text-secondary text-sm">Commit to a year of culinary excellence and save 20%.</p>
      </div>
      <div className="px-12 py-8 space-y-8">
        <div className="p-6 bg-surface-container-low rounded-xl border border-primary/20 flex items-center justify-between">
            <div>
                <h3 className="font-serif text-xl font-bold text-primary">Epicurean Pro (Annual)</h3>
                <p className="text-secondary font-sans text-sm mt-1">$239.90 / year</p>
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-xs uppercase tracking-widest">
                Save $60
            </div>
        </div>
        <button onClick={() => setView('MAIN')} className="w-full py-4 rounded-full bg-primary text-on-primary font-sans font-bold text-sm tracking-widest uppercase shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-[0.98]">
            Confirm Switch
        </button>
      </div>
    </>
  );

  const renderPayment = () => (
    <>
      <div className="px-12 pt-12 pb-6 border-b border-outline-variant/10">
        <button onClick={() => setView('MAIN')} className="text-secondary hover:text-on-surface flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-widest mb-6 transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back
        </button>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-on-surface mb-2">Update Payment</h2>
        <p className="font-sans text-secondary text-sm">Securely enter your new billing details.</p>
      </div>
      <div className="px-12 py-8 space-y-6">
        <div className="space-y-4">
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
        <button onClick={() => setView('MAIN')} className="w-full py-4 mt-4 rounded-full bg-primary text-on-primary font-sans font-bold text-sm tracking-widest uppercase shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-[0.98] bg-[linear-gradient(45deg,#061b0e_0%,#1b3022_100%)]">
            Save Payment Method
        </button>
      </div>
    </>
  );

  const renderCancel = () => (
    <>
      <div className="px-12 pt-12 pb-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-error/10 text-error rounded-full mb-4">
          <span className="material-symbols-outlined text-3xl">warning</span>
        </div>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-on-surface mb-2">Are you sure?</h2>
        <p className="font-sans text-secondary text-sm max-w-sm mx-auto leading-relaxed">
            Canceling your subscription will immediately downgrade your tier to Basic. Your advanced AI algorithms and journals may be permanently archived.
        </p>
      </div>
      <div className="px-12 pb-12 flex flex-col gap-4">
        <button onClick={() => setView('MAIN')} className="w-full py-4 rounded-full bg-surface-container-highest text-on-surface font-sans font-bold text-sm tracking-widest uppercase hover:opacity-90 active:scale-[0.98] transition-all">
          No, Take Me Back
        </button>
        <button onClick={handleClose} className="w-full py-4 rounded-full bg-error text-white font-sans font-bold text-sm tracking-widest uppercase hover:bg-error/90 transition-all shadow-lg shadow-error/20 active:scale-[0.98]">
          Yes, Cancel Plan
        </button>
      </div>
    </>
  );

  const renderSwitchPlan = () => (
    <>
      <div className="px-12 pt-12 pb-6 border-b border-outline-variant/10">
        <button onClick={() => setView('MAIN')} className="text-secondary hover:text-on-surface flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-widest mb-6 transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back
        </button>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-on-surface mb-2">Change Tier</h2>
        <p className="font-sans text-secondary text-sm">Select the plan that best fits your culinary aspirations.</p>
      </div>
      <div className="px-12 py-8 space-y-4">
        {/* Basic Tier */}
        <div className="p-6 bg-surface-container-lowest border border-outline-variant/20 rounded-xl flex items-center justify-between group">
          <div>
            <h3 className="font-serif text-lg font-bold text-on-surface">Basic Tier</h3>
            <p className="text-secondary font-sans text-sm mt-1">$9.99 / month</p>
          </div>
          <button className="px-5 py-2 rounded-full border border-outline-variant text-on-surface font-sans font-bold text-xs tracking-widest uppercase hover:bg-surface-container transition-colors">
            Downgrade
          </button>
        </div>

        {/* Epicurean Pro (Current) */}
        <div className="p-6 bg-primary-container/5 border-2 border-primary/20 rounded-xl flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10 w-full flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Current Plan</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-on-surface">Epicurean Pro</h3>
              <p className="text-secondary font-sans text-sm mt-1">$24.99 / month</p>
            </div>
            <span className="material-symbols-outlined opacity-10 text-4xl mr-2">verified</span>
          </div>
        </div>

        {/* Masterclass Elite */}
        <div className="p-6 bg-surface-container-lowest border border-outline-variant/20 rounded-xl flex items-center justify-between group">
          <div>
            <h3 className="font-serif text-lg font-bold text-on-surface">Masterclass Elite</h3>
            <p className="text-secondary font-sans text-sm mt-1">$49.99 / month</p>
          </div>
          <button className="px-5 py-2 rounded-full bg-surface-container-highest text-on-surface font-sans font-bold text-xs tracking-widest uppercase hover:bg-primary hover:text-white transition-colors">
            Upgrade
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div 
      className="fixed inset-0 z-[100] h-[100vh] overflow-hidden flex items-center justify-center bg-zinc-100/50 dark:bg-zinc-900/50 backdrop-blur-xl p-6 cursor-pointer"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-xl h-[800px] overflow-y-auto bg-surface-container-lowest/90 backdrop-blur-3xl rounded-xl shadow-[0px_20px_40px_rgba(26,28,28,0.06)] animate-in fade-in zoom-in duration-300 cursor-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative min-h-full flex flex-col">
          {view === 'MAIN' && renderMain()}
          {view === 'ANNUAL' && renderAnnual()}
          {view === 'PAYMENT' && renderPayment()}
          {view === 'CANCEL' && renderCancel()}
          {view === 'SWITCH_PLAN' && renderSwitchPlan()}
        </div>
      </div>
    </div>
  );
}
