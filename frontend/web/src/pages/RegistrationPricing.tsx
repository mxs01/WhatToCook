import { Link } from 'react-router-dom';

export default function RegistrationPricing() {
  return (
    <div className="min-h-screen bg-surface-container-low pt-32 pb-20 px-8 flex flex-col items-center">
      <h1 className="text-5xl font-serif text-primary mb-4 text-center">Elevate Your Kitchen</h1>
      <p className="font-sans text-secondary text-lg text-center max-w-2xl mb-16">
        Join WhatToCook to unlock personalized AI recipes, macro tracking, and unlimited curated inspiration.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Free Tier */}
        <div className="bg-surface-container rounded-3xl p-10 flex flex-col border border-outline-variant/15 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-3xl font-serif text-primary mb-2">Basic Taste</h2>
          <div className="text-4xl font-sans font-semibold mb-6">$0<span className="text-lg text-secondary font-normal">/mo</span></div>
          <ul className="flex flex-col gap-4 mb-10 text-on-surface-variant font-sans flex-1">
            <li className="flex items-center gap-3">
              <span className="text-primary">✓</span> 5 Fridge Scans per month
            </li>
            <li className="flex items-center gap-3">
              <span className="text-primary">✓</span> Basic Recipe Generation
            </li>
          </ul>
          <Link to="/onboarding" className="w-full text-center py-4 rounded-full bg-surface border border-outline-variant font-medium text-primary hover:bg-surface-container-high transition-colors">
            Start Free
          </Link>
        </div>

        {/* Pro Tier */}
        <div className="bg-surface-container-lowest rounded-3xl p-10 flex flex-col shadow-[0_20px_40px_rgba(26,28,28,0.08)] scale-105 border border-primary/20 relative">
          <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-primary text-white font-sans text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full">Recommended</div>
          <h2 className="text-3xl font-serif text-primary mb-2">The Digital Epicurean</h2>
          <div className="text-4xl font-sans font-semibold mb-6">$9.99<span className="text-lg text-secondary font-normal">/mo</span></div>
          <ul className="flex flex-col gap-4 mb-10 text-on-surface-variant font-sans flex-1">
            <li className="flex items-center gap-3">
              <span className="text-primary">✓</span> Unlimited AI Fridge Scans
            </li>
            <li className="flex items-center gap-3">
              <span className="text-primary">✓</span> Advanced Macro Analysis
            </li>
            <li className="flex items-center gap-3">
              <span className="text-primary">✓</span> Curated Bespoke Recipes
            </li>
            <li className="flex items-center gap-3">
              <span className="text-primary">✓</span> Dietary Customization
            </li>
          </ul>
          <Link to="/onboarding" className="w-full text-center py-4 rounded-full primary-gradient font-medium hover:shadow-lg hover:scale-105 transition-all duration-300">
            Subscribe Now
          </Link>
        </div>
      </div>
    </div>
  );
}
