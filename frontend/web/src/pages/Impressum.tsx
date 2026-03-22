import React from 'react';

const Impressum: React.FC = () => {
    return (
        <div className="pt-20 pb-20 px-8 md:px-16 max-w-screen-xl mx-auto font-sans text-on-surface">
            {/* Hero Section / Editorial Header */}
            <section className="mb-24 mt-12">
                <span className="font-sans text-secondary tracking-widest text-xs uppercase mb-4 block">Legal Documentation</span>
                <h1 className="text-6xl md:text-8xl font-black text-primary tracking-tighter mb-8 leading-none font-serif">
                    Impressum
                </h1>
                <div className="h-1 w-24 bg-primary mb-12"></div>
                <p className="text-xl md:text-2xl text-secondary max-w-2xl font-sans leading-relaxed italic">
                    A commitment to transparency, culinary integrity, and digital precision.
                </p>
            </section>

            {/* Asymmetric Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
                {/* Company Info & Registration */}
                <div className="md:col-span-7 space-y-20">
                    <div className="group">
                        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-4 font-serif">
                            <span className="text-xs font-sans text-outline p-2 border border-outline-variant/30 rounded-full">01</span>
                            Information according to § 5 TMG
                        </h2>
                        <div className="bg-surface-container-low p-10 rounded-lg space-y-4">
                            <p className="text-2xl font-serif font-bold text-on-surface">WhatToCook AI GmbH</p>
                            <p className="text-lg text-on-surface-variant font-sans">Chef's Quarter, Suite 402<br/>10117 Berlin, Germany</p>
                        </div>
                    </div>
                    
                    <div className="group">
                        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-4 font-serif">
                            <span className="text-xs font-sans text-outline p-2 border border-outline-variant/30 rounded-full">02</span>
                            Represented by
                        </h2>
                        <div className="space-y-2 pl-12">
                            <p className="text-xl font-serif text-on-surface">Dr. Elena Vanhoutte</p>
                            <p className="text-sm font-sans text-secondary">Managing Director &amp; Lead Curator</p>
                        </div>
                    </div>
                    
                    <div className="group">
                        <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-4 font-serif">
                            <span className="text-xs font-sans text-outline p-2 border border-outline-variant/30 rounded-full">03</span>
                            Register Entry
                        </h2>
                        <div className="bg-surface-container-low p-10 rounded-lg space-y-4">
                            <p className="text-lg font-sans flex justify-between border-b border-outline-variant/10 pb-4">
                                <span className="text-secondary">Commercial Register:</span>
                                <span className="text-on-surface font-bold">Amtsgericht Berlin (Charlottenburg)</span>
                            </p>
                            <p className="text-lg font-sans flex justify-between">
                                <span className="text-secondary">Register Number:</span>
                                <span className="text-on-surface font-bold">HRB 248910 B</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact & VAT (Sidebar Style) */}
                <div className="md:col-span-5 space-y-16">
                    <div className="bg-primary text-on-primary p-12 rounded-xl shadow-xl">
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 font-serif">
                            <span className="material-symbols-outlined">alternate_email</span>
                            Contact
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-sans text-primary-fixed-dim mb-1 uppercase tracking-widest">Inquiries</p>
                                <a className="text-xl font-sans hover:text-primary-fixed transition-colors" href="mailto:hello@whattocook.ai">hello@whattocook.ai</a>
                            </div>
                            <div>
                                <p className="text-xs font-sans text-primary-fixed-dim mb-1 uppercase tracking-widest">Media &amp; Press</p>
                                <p className="text-xl font-sans">press@whattocook.ai</p>
                            </div>
                            <div>
                                <p className="text-xs font-sans text-primary-fixed-dim mb-1 uppercase tracking-widest">Phone</p>
                                <p className="text-xl font-sans">+49 (0) 30 555 3322</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-12 border-l-2 border-primary-container/10">
                        <h3 className="text-2xl font-bold text-primary mb-6 font-serif">Tax Information</h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-sans text-secondary mb-1 uppercase tracking-widest">VAT ID Number</p>
                                <p className="text-xl font-serif font-bold text-primary">DE 321 456 789</p>
                                <p className="text-xs text-secondary mt-2">According to § 27 a of the Value Added Tax Act.</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg overflow-hidden grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                        <img alt="Berlin Cityscape" className="w-full h-64 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABg319xl7K_iuHNnnESqsF7pXmXlGkKM2BqLacpgDgJVjgO6GzSjHqTg9AJkUjeNgwOolfQFvcvWYCEPfhclazM73lOxLBGyN_islwNPNZaCN6IskQI2cvFQ603WXxRh_DztR9wOoGYMhOnu10XQhAZmMXtj5_OKH-mwzcm5Q_0_FL8sATZiByUGyIx394dQOGnMulbdOr35Q-0xeEWnmbPVYedeQwmNjDYKJVOmtxpeCZvq2Idiw4b8xElnIwlChWDSSfPwlSIC72" />
                    </div>
                </div>
            </div>

            {/* Editorial Footnote Section */}
            <section className="mt-32 pt-16 border-t border-outline-variant/20">
                <div className="max-w-3xl">
                    <h2 className="text-2xl font-bold text-primary mb-6 italic font-serif">Dispute Resolution</h2>
                    <p className="text-secondary leading-relaxed font-sans mb-6">
                        The European Commission provides a platform for online dispute resolution (OS): 
                        <a className="text-primary font-bold underline decoration-primary/30 hover:decoration-primary ml-1" href="https://ec.europa.eu/consumers/odr">https://ec.europa.eu/consumers/odr</a>. 
                        Our e-mail address can be found above in the impressum.
                    </p>
                    <p className="text-secondary leading-relaxed font-sans">
                        We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Impressum;
