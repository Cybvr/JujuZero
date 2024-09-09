import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

function LogoWrapper() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const logoSrc = resolvedTheme === 'dark' ? "/images/logoy.png" : "/images/logox.png";

  return (
    <Image 
      src={logoSrc}
      alt="Logo" 
      width={96} 
      height={24} 
      className="w-24 h-6 object-contain"
    />
  );
}

export default LogoWrapper;