// @components/ui/separator.tsx
import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a utility for classnames

interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Separator: React.FC<SeparatorProps> = ({ orientation = 'horizontal', className, ...props }) => {
  return (
    <hr
      className={cn(
        'border-gray-300',
        orientation === 'vertical' ? 'border-l h-full' : 'border-b',
        className
      )}
      {...props}
    />
  );
};