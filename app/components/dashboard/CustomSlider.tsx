// app/components/CustomSlider.tsx
import React from 'react';

interface CustomSliderProps {
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  id,
  min,
  max,
  step,
  value,
  onChange,
  className = '',
}) => {
  return (
    <input
      type="range"
      id={id}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full ${className}`}
    />
  );
};