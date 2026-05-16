import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { ShoppingBag } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 40 }: LogoProps) {
  const { data } = useData();
  const [hasError, setHasError] = useState(false);
  const logoUrl = data?.settings?.logoUrl;

  return (
    <div 
      className={`relative flex items-center justify-center rounded-2xl overflow-hidden shadow-lg ${hasError || !logoUrl ? 'bg-[#a3e635] text-[#0f172a] font-black' : ''} ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {logoUrl && !hasError ? (
        <img 
          src={logoUrl} 
          alt="Djapero Logo" 
          className="w-full h-full object-contain"
          onError={() => setHasError(true)}
        />
      ) : (
        <ShoppingBag size={size * 0.6} strokeWidth={2.5} />
      )}
    </div>
  );
}
