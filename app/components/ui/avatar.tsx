// app/components/ui/avatar.tsx
import React, { useState } from 'react';
import { cn } from '@/lib/utils'; // Ensure you have the cn function for classnames
import { UserIcon } from 'lucide-react';

interface AvatarProps {
  src: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('relative rounded-full overflow-hidden bg-gray-100 flex items-center justify-center', sizeClasses[size], className)}>
      {src && !imageError ? (
        <img 
          src={src} 
          alt={alt} 
          onError={() => setImageError(true)}
          className="object-cover w-full h-full"
        />
      ) : (
        <UserIcon className={cn('text-gray-500', size === 'sm' ? 'h-6 w-6' : size === 'md' ? 'h-8 w-8' : 'h-10 w-10')} />
      )}
    </div>
  );
}

export function AvatarImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={cn("aspect-square h-full w-full", className)} />;
}

export function AvatarFallback({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex h-full w-full items-center justify-center bg-muted", className)}>
      {children}
    </div>
  );
}