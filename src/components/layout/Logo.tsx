import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 40 }: LogoProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      className={`relative flex items-center justify-center rounded-2xl overflow-hidden shadow-lg ${hasError ? 'bg-[#04d333] text-white font-black' : ''} ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {!hasError ? (
        <img 
          src="/logo.jpg" 
          alt="Djapero Logo" 
          className="w-full h-full object-cover"
          onError={(e) => {
            if (e.currentTarget.src.includes('logo.jpg')) {
               e.currentTarget.src = '/logo.png';
            } else {
               setHasError(true);
            }
          }}
        />
      ) : (
        <span style={{ fontSize: size * 0.4 }}>DJ</span>
      )}
    </div>
  );
}
