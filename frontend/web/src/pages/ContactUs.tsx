import React from 'react';

const ContactUs: React.FC = () => {
    return (
        <div className="pt-32 pb-20 px-8 md:px-16 max-w-screen-2xl mx-auto font-sans text-on-surface">
            {/* Hero Section */}
            <section className="mb-20">
                <h1 className="font-serif font-black text-6xl md:text-8xl text-on-surface tracking-tighter mb-6 leading-tight">
                    Get in <br /><span className="text-primary-container italic font-light opacity-80">Dialogue.</span>
                </h1>
                <p className="font-sans text-xl text-secondary max-w-2xl leading-relaxed">
                    Whether you have a question about our curations or simply want to share a culinary discovery, our team is here to assist your journey.
                </p>
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Contact Form Section */}
                <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-sm">
                    <form className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">Full Name</label>
                                <input className="w-full bg-surface-container-highest border-none rounded-full px-6 py-4 font-sans focus:ring-2 focus:ring-primary-container outline-none transition-all placeholder:text-outline" placeholder="John Doe" type="text" />
                            </div>
                            <div className="space-y-2">
                                <label className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">Email Address</label>
                                <input className="w-full bg-surface-container-highest border-none rounded-full px-6 py-4 font-sans focus:ring-2 focus:ring-primary-container outline-none transition-all placeholder:text-outline" placeholder="john@example.com" type="email" />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">Your Message</label>
                            <textarea className="w-full bg-surface-container-highest border-none rounded-lg px-6 py-4 font-sans focus:ring-2 focus:ring-primary-container outline-none transition-all placeholder:text-outline resize-none" placeholder="How can we help you create today?" rows={6}></textarea>
                        </div>
                        
                        <button className="bg-gradient-to-tr from-[#061b0e] to-[#1b3022] text-on-primary px-12 py-5 rounded-full font-sans font-bold tracking-wide active:scale-[0.98] transition-all flex items-center justify-center space-x-3 w-full md:w-auto" type="submit">
                            <span>Send Message</span>
                            <span className="material-symbols-outlined text-sm">north_east</span>
                        </button>
                    </form>
                </div>

                {/* Side Info Section */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-12">
                    {/* Info Blocks */}
                    <div className="space-y-12">
                        <div className="group cursor-default">
                            <h3 className="font-serif text-2xl font-bold mb-4">Inquiries</h3>
                            <p className="font-sans text-secondary mb-2">Editorial &amp; Press</p>
                            <a className="text-xl font-bold text-on-surface hover:text-primary transition-colors" href="mailto:curate@whattocook.digital">curate@whattocook.digital</a>
                        </div>
                        
                        <div className="group cursor-default">
                            <h3 className="font-serif text-2xl font-bold mb-4">Concierge</h3>
                            <p className="font-sans text-secondary mb-2">Technical Support</p>
                            <a className="text-xl font-bold text-on-surface hover:text-primary transition-colors" href="mailto:support@whattocook.digital">support@whattocook.digital</a>
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="font-serif text-2xl font-bold">Social Connection</h3>
                            <div className="flex space-x-4">
                                <a className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center text-secondary hover:bg-primary hover:text-on-primary transition-all duration-300" href="#">
                                    <span className="material-symbols-outlined text-lg">camera</span>
                                </a>
                                <a className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center text-secondary hover:bg-primary hover:text-on-primary transition-all duration-300" href="#">
                                    <span className="material-symbols-outlined text-lg">post</span>
                                </a>
                                <a className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center text-secondary hover:bg-primary hover:text-on-primary transition-all duration-300" href="#">
                                    <span className="material-symbols-outlined text-lg">alternate_email</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Abstract Visual Card */}
                    <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-surface-container rounded-lg overflow-hidden group">
                        <img alt="Elegant kitchen minimalist aesthetic" className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlfxH-nycvCuIU3krPyaSHJI9URY4LUzTmbuJ7_lxPMJNhFhNgMrHYTzvapUq_PLHLMZ5DX7hYVUHaNPvDQTxfxnlbSH0ilvfByi_fyBcUeCc9VcEQZVuAhJmvJSdAxrYHepIb9HcS6U7ynmM9GY46_hUBR1Xh5nyOGgoYN2up9zkekgX_FG2R0zDlFA_xvG5eASzqPj66obaM_V7LTso-KlLW8JxYSnOjouc0LOaputl3VTHc2yhvtmGq4gxlrW4M9UBwZhkxfH1x" />
                        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                        <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                            <p className="text-white font-serif text-lg italic leading-relaxed">"Great cooking is about the journey, and every journey starts with a simple conversation."</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary CTA Chips */}
            <section className="mt-20 flex flex-wrap gap-4">
                <span className="font-sans text-secondary text-sm self-center mr-4">Common Topics:</span>
                <button className="bg-surface-container-lowest border border-outline-variant/15 px-6 py-2 rounded-full text-secondary font-sans text-sm hover:bg-surface-container-highest transition-all">Subscription Help</button>
                <button className="bg-surface-container-lowest border border-outline-variant/15 px-6 py-2 rounded-full text-secondary font-sans text-sm hover:bg-surface-container-highest transition-all">Recipe Licensing</button>
                <button className="bg-surface-container-lowest border border-outline-variant/15 px-6 py-2 rounded-full text-secondary font-sans text-sm hover:bg-surface-container-highest transition-all">Partnerships</button>
                <button className="bg-surface-container-lowest border border-outline-variant/15 px-6 py-2 rounded-full text-secondary font-sans text-sm hover:bg-surface-container-highest transition-all">Feature Request</button>
            </section>
        </div>
    );
};

export default ContactUs;
