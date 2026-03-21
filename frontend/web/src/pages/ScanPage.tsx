import { useState } from 'react';

export default function ScanPage() {
  const [dragActive, setDragActive] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-32 px-8">
      <h1 className="text-5xl font-serif text-primary mb-4 text-center">Analyze Your Ingredients</h1>
      <p className="font-sans text-secondary text-lg mb-12 text-center max-w-xl">
        Take a photo or upload an image of your fridge. Our Vision AI will instantly detect up to 50 ingredients and suggest bespoke recipes.
      </p>

      {/* Drag & Drop Zone with oversized border radius */}
      <div 
        className={`w-full max-w-4xl h-[500px] rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${dragActive ? 'border-primary bg-primary/5' : 'border-outline-variant bg-surface-container-low'}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
      >
        <div className="w-24 h-24 rounded-full primary-gradient flex items-center justify-center mb-6 shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="font-serif text-2xl text-primary mb-2">Drag and drop your photo here</p>
        <p className="font-sans text-secondary text-sm">Or click the camera to upload from your device (Max 10MB)</p>
      </div>
    </div>
  );
}
