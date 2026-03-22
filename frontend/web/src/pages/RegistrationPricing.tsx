import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardNumberInput from '../components/CardNumberInput';
import ExpiryDateDropdown from '../components/ExpiryDateDropdown';

export default function RegistrationPricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('pro');

  return (
    <div className="pt-12 pb-24 px-12 max-w-[1920px] mx-auto min-h-screen">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Left Column: Pricing Comparison */}
        <div className="w-full lg:w-6/12">
          <div className="mb-12">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-secondary mb-4 block">Subscription Plans</span>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-tight text-on-surface mb-8 tracking-tighter">
              Choose your <br /><span className="italic font-normal">culinary journey.</span>
            </h1>
            
            <div className="flex flex-col gap-6">
              {/* Tier 1: Basic */}
              <label 
                className={`relative flex items-center p-6 cursor-pointer bg-white border ${selectedPlan === 'basic' ? 'border-emerald-900 shadow-sm' : 'border-outline-variant/30 hover:border-emerald-900'} rounded-2xl transition-all group`}
              >
                <input 
                  className="sr-only peer" 
                  name="subscription" 
                  type="radio" 
                  value="basic"
                  checked={selectedPlan === 'basic'}
                  onChange={() => setSelectedPlan('basic')}
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-serif text-xl font-bold">Basic</h3>
                    <div className="font-sans font-bold text-lg text-primary">1.99€<span className="text-sm text-secondary font-normal">/mo</span></div>
                  </div>
                  <p className="font-sans text-secondary text-sm">2 Rezepte am Tag.</p>
                </div>
                <div className={`ml-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedPlan === 'basic' ? 'border-emerald-900 bg-emerald-900' : 'border-outline-variant'}`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </label>

              {/* Tier 2: Pro */}
              <label 
                className={`relative flex items-center p-6 cursor-pointer bg-white border ${selectedPlan === 'pro' ? 'border-2 border-emerald-900 shadow-lg' : 'border border-outline-variant/30 hover:border-emerald-900'} rounded-2xl transition-all group`}
              >
                <input 
                  className="sr-only peer" 
                  name="subscription" 
                  type="radio" 
                  value="pro"
                  checked={selectedPlan === 'pro'}
                  onChange={() => setSelectedPlan('pro')}
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-xl font-bold">Pro</h3>
                      <span className="bg-emerald-900 text-white text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full">Recommended</span>
                    </div>
                    <div className="font-sans font-bold text-lg text-primary">4.99€<span className="text-sm text-secondary font-normal">/mo</span></div>
                  </div>
                  <p className="font-sans text-secondary text-sm">5 Rezepte am Tag.</p>
                </div>
                <div className={`ml-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedPlan === 'pro' ? 'border-emerald-900 bg-emerald-900' : 'border-outline-variant'}`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </label>

              {/* Tier 3: Unlimited */}
              <label 
                className={`relative flex items-center p-6 cursor-pointer bg-white border ${selectedPlan === 'unlimited' ? 'border-emerald-900 shadow-sm' : 'border-outline-variant/30 hover:border-emerald-900'} rounded-2xl transition-all group`}
              >
                <input 
                  className="sr-only peer" 
                  name="subscription" 
                  type="radio" 
                  value="unlimited"
                  checked={selectedPlan === 'unlimited'}
                  onChange={() => setSelectedPlan('unlimited')}
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-serif text-xl font-bold">Unlimited</h3>
                    <div className="font-sans font-bold text-lg text-primary">9.99€<span className="text-sm text-secondary font-normal">/mo</span></div>
                  </div>
                  <p className="font-sans text-secondary text-sm">Unlimited recipes & AI Chef Logic.</p>
                </div>
                <div className={`ml-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedPlan === 'unlimited' ? 'border-emerald-900 bg-emerald-900' : 'border-outline-variant'}`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </label>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-emerald-900">restaurant_menu</span>
                <p className="text-sm text-secondary leading-relaxed">Personalized meal plans adjusted to your specific dietary requirements and pantry.</p>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-emerald-900">photo_camera</span>
                <p className="text-sm text-secondary leading-relaxed">Instant visual recognition of ingredients using our proprietary AI vision engine.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Registration & Payment */}
        <div className="w-full lg:w-6/12">
          <div className="grid grid-cols-1 gap-8">
            {/* Registration & Payment Form */}
            <div className="bg-surface-container-lowest p-10 lg:p-12 rounded-xl border border-outline-variant/10 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-3xl font-bold">Set up your account</h2>
                <div className="h-10 w-10 bg-emerald-100 text-emerald-900 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">person</span>
                </div>
              </div>
              
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/onboarding'); }}>
                {/* Section: Account */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-sans text-xs uppercase tracking-widest text-secondary px-4 font-bold">Full Name</label>
                    <input className="w-full font-sans bg-surface-container-high border-none rounded-full px-6 py-4 focus:ring-2 focus:ring-primary placeholder:text-outline transition-all" placeholder="Julianne Smith" type="text" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-sans text-xs uppercase tracking-widest text-secondary px-4 font-bold">Email Address</label>
                    <input className="w-full font-sans bg-surface-container-high border-none rounded-full px-6 py-4 focus:ring-2 focus:ring-primary placeholder:text-outline transition-all" placeholder="julianne@digitalepicure.com" type="email" />
                  </div>
                </div>

                <hr className="border-outline-variant/10 my-8" />

                {/* Section: Payment */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-sans font-bold">Secure Payment</h3>
                    <div className="flex gap-2">
                      <span className="material-symbols-outlined text-secondary text-sm">lock</span>
                      <span className="text-[10px] text-secondary uppercase tracking-widest self-center font-bold">SSL Encrypted</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-sans text-xs uppercase tracking-widest text-secondary px-4 font-bold">Card Number</label>
                    <div className="relative">
                      <CardNumberInput className="w-full font-sans bg-surface-container-high border-none rounded-full px-6 py-4 focus:ring-2 focus:ring-primary placeholder:text-outline transition-all" />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                        <span className="material-symbols-outlined text-secondary opacity-50">credit_card</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-sans text-xs uppercase tracking-widest text-secondary px-4 font-bold">Expiry Date</label>
                      <ExpiryDateDropdown className="w-full font-sans bg-surface-container-high border-none rounded-full px-6 py-4 focus:ring-2 focus:ring-primary placeholder:text-outline transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-sans text-xs uppercase tracking-widest text-secondary px-4 font-bold">CVC</label>
                      <input className="w-full font-sans bg-surface-container-high border-none rounded-full px-6 py-4 focus:ring-2 focus:ring-primary placeholder:text-outline transition-all" placeholder="123" type="text" />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button className="w-full bg-primary text-white py-5 rounded-full font-sans font-bold text-lg hover:bg-stone-900 transition-all flex items-center justify-center gap-3 active:scale-[0.98]" type="submit">
                    Activate Membership
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                  <p className="font-sans text-center text-[10px] text-secondary mt-6 leading-relaxed px-8">
                    By clicking activate, you agree to our Culinary Manifesto. Your selected plan will be billed monthly until cancellation.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
