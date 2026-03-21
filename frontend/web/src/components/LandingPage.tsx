import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="pt-24 bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed w-full overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-8 pb-24 flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-12 grid grid-cols-1 md:grid-cols-2 items-center gap-16 w-full">
          <div className="z-10">
            <h1 className="font-serif text-[4rem] leading-[1.1] text-on-surface tracking-tight font-bold mb-8">
              Dein Kühlschrank hat den Plan. <span className="italic font-normal">Du nur den Hunger.</span>
            </h1>
            <p className="font-sans text-xl text-secondary max-w-lg mb-12 leading-relaxed">
              WhatToCook nutzt Agentic AI, um aus deinen Vorräten Gourmet-Rezepte zu kreieren. Scannen, kochen, genießen – inklusive präziser Makros und professioneller Food-Fotografie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/scan')} className="bg-primary bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-full font-bold flex items-center justify-center gap-3 shadow-xl hover:opacity-95 transition-all">
                <span className="material-symbols-outlined">ios</span>
                Jetzt im App Store laden
              </button>
              <button onClick={() => navigate('/onboarding')} className="px-8 py-4 rounded-full font-bold text-primary flex items-center justify-center gap-3 border border-outline-variant/15 bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                Wie es funktioniert
              </button>
            </div>
          </div>
          
          <div className="relative flex justify-center items-center">
            {/* Asymmetric Image Layout */}
            <div className="relative w-full aspect-square max-w-2xl bg-surface-container-low rounded-xl overflow-hidden shadow-2xl">
              <img 
                alt="Gourmet Dish" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl928yh6p2JIp-ZFMv2LgjJRZsfo9pi68oOY22QsEdWJiAbDBG-5tx1SbhHT_N2DVMS-6-O1S-XPJGyxlKiXr2a9BKrL7XxeslfJwZTzqYEvvGb5XAS6Tn0HrOmnsglPexOl0_PceL8pzFjCn7XBUmqxptTzc3iJZFuGeXXDh5PJEWPrR_LOR1M-41-4qBd8z6gEnYjWfo3dFHlklj9k1Va1KAChbkRpEcIZCX9C8tOilfSjNpyqUPV5Pkri3ZlE8H2o2z5YjUOxIV"
              />
              {/* AI Overlay UI Tag */}
              <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-xl p-4 rounded-lg border border-outline-variant/15 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-on-surface/60 font-bold">AI Analysis</div>
                  <div className="text-sm font-bold text-on-surface">98% Match Score</div>
                </div>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary-fixed-dim/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-32 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-12">
          <div className="text-center mb-24">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-4 block">The Digital Epicurean</span>
            <h2 className="font-serif text-5xl text-on-surface font-bold">Präzision in jedem Detail.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vision Scan */}
            <div className="bg-surface-container-lowest p-12 rounded-lg border border-outline-variant/15 group hover:shadow-2xl transition-all duration-500">
              <div className="w-16 h-16 rounded-full bg-surface-container mb-8 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                <span className="material-symbols-outlined text-3xl group-hover:text-on-primary">center_focus_strong</span>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4">Vision Scan</h3>
              <p className="text-secondary leading-relaxed mb-6">
                Unsere Computer-Vision erkennt über 2.000 Zutaten in Echtzeit. Einfach den Kühlschrank scannen – kein Tippen erforderlich.
              </p>
              <ul className="space-y-3 text-sm font-medium text-on-surface/70">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Multi-Objekt Erkennung
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Frische-Analyse
                </li>
              </ul>
            </div>

            {/* Chef Logic */}
            <div className="bg-surface-container-lowest p-12 rounded-lg border border-outline-variant/15 group hover:shadow-2xl transition-all duration-500">
              <div className="w-16 h-16 rounded-full bg-surface-container mb-8 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                <span className="material-symbols-outlined text-3xl group-hover:text-on-primary">psychology</span>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4">Chef Logic</h3>
              <p className="text-secondary leading-relaxed mb-6">
                Agentic AI kombiniert molekulare Gastronomie mit deinen Vorlieben. Rezepte, die nicht nur funktionieren, sondern begeistern.
              </p>
              <ul className="space-y-3 text-sm font-medium text-on-surface/70">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Maßgeschneiderte Makros
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Intelligente Substitution
                </li>
              </ul>
            </div>

            {/* Studio Visuals */}
            <div className="bg-surface-container-lowest p-12 rounded-lg border border-outline-variant/15 group hover:shadow-2xl transition-all duration-500">
              <div className="w-16 h-16 rounded-full bg-surface-container mb-8 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                <span className="material-symbols-outlined text-3xl group-hover:text-on-primary">camera</span>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4">Studio Visuals</h3>
              <p className="text-secondary leading-relaxed mb-6">
                Jedes Rezept wird mit professioneller Food-Fotografie präsentiert. Das Auge isst mit – schon vor dem ersten Bissen.
              </p>
              <ul className="space-y-3 text-sm font-medium text-on-surface/70">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Step-by-Step Guides
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Cinematic Video Content
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Recipe Showcase (Asymmetric) */}
      <section className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-12 grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-7">
            <div className="relative rounded-xl overflow-hidden shadow-2xl h-[600px]">
              <img 
                alt="Featured Recipe" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYuh1aPQ-upEsW6vC1EEgfcIY-AVNhyIwWerAgTtloeyQ-NtdBRrPJ_H38km5tJaDtakWjQztK_vHEKXBILDn9lDuJhsfoyF-CKFWAREI3sekFbsNF97innhOWYaSYf92H6gOTGmROMdhVFioivmve5XVofjxgvIfuJmGOKgZKQFXW8W3AIap1GFoJ7VN2_4FZrCIdO_RHMieQZ2i0eCbX3RiB3ixVF8WjwUdiwovfnzF83f-V7BxdGG9ROGLQlXA0U_0SDY-l4Q1t"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
              <div className="absolute bottom-12 left-12 right-12">
                <h4 className="font-serif text-4xl text-white font-bold mb-2">Winter Garden Bowl</h4>
                <p className="text-white/80 font-medium">Basiert auf: Süßkartoffel, Grünkohl, Sesam</p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-5 md:pl-12">
            <span className="font-serif italic text-primary text-3xl block mb-6">"Die App denkt wie ein Sternekoch, aber kocht mit dem, was ich wirklich da habe."</span>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-full bg-surface-container overflow-hidden">
                <img alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgt3u1-1K3sx8JlSldiDyNHbzec1bOlwFdnmqozKIDMJblPd8Kgx66aKCFj-t8a_JbCdZQGnchV8YUt7XnGVgp43wpKExhxu8x7ThViwlGKlswI_ImF3-YteX8FlxhRiH7hkacnBK76WofM22Qc1dvOtzOZnwaeuNsFr9HvHTpOfOn-8KU0wPdkAzccBaP0vXjwmo_YsCK9T4X4hGvi9GbvR-9EiImI2HNGYio-0zi9WWJXNaX6JPYbgRP-HsSqhHGv4w1gSOYDlzI"/>
              </div>
              <div>
                <p className="font-bold text-on-surface">Lukas Meyer</p>
                <p className="text-xs text-secondary uppercase tracking-widest">Food Blogger</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-lg bg-surface-container-high">
                <div className="text-sm text-secondary mb-1">Nächste Empfehlung</div>
                <div className="font-bold text-lg text-primary">Trüffel-Pasta mit Steinpilzen</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button (FAB) */}
      <button onClick={() => navigate('/scan')} className="fixed bottom-10 right-10 w-16 h-16 bg-gradient-to-br from-primary to-primary-container text-white rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 active:scale-95 transition-all">
        <span className="material-symbols-outlined text-3xl">photo_camera</span>
      </button>

    </main>
  );
};

export default LandingPage;
