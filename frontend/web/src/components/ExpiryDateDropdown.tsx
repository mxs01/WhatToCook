import { useState } from 'react';

interface ExpiryDateDropdownProps {
  className?: string;
}

export default function ExpiryDateDropdown({ className = '' }: ExpiryDateDropdownProps) {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  // Replace standard focus with focus-within for wrapper divs
  const wrapperClass = className.replace(/focus:ring-\d/g, '').replace(/focus:ring-[a-z0-9/-]+/g, '');

  return (
    <div className={`flex items-center gap-1 ${wrapperClass} focus-within:ring-2 focus-within:ring-emerald-900/20`}>
      <select 
        className="w-[45%] bg-transparent border-none p-0 focus:ring-0 outline-none cursor-pointer text-center font-sans"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        <option value="" disabled>MM</option>
        {months.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      
      <span className="text-stone-300 w-[10%] text-center">/</span>
      
      <select 
        className="w-[45%] bg-transparent border-none p-0 focus:ring-0 outline-none cursor-pointer text-center font-sans"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      >
        <option value="" disabled>YY</option>
        {years.map(y => {
          const yy = y.toString().slice(-2);
          return <option key={y} value={yy}>{yy}</option>
        })}
      </select>
    </div>
  );
}
