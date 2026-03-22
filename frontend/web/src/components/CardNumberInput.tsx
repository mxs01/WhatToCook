import { useState } from 'react';

interface CardNumberInputProps {
  className?: string;
}

export default function CardNumberInput({ className }: CardNumberInputProps) {
  const [cardNumber, setCardNumber] = useState('');

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ''); // clean all non-digit characters
    val = val.substring(0, 16); // max 16 digits
    let formatted = '';
    for (let i = 0; i < val.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += '-';
      formatted += val[i];
    }
    setCardNumber(formatted);
  };

  return (
    <input 
      className={className} 
      placeholder="0000-0000-0000-0000" 
      type="text" 
      value={cardNumber}
      onChange={handleCardNumberChange}
      maxLength={19}
    />
  );
}
