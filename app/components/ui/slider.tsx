// @app/components/ui/slider.tsx
import React from 'react';

interface SliderProps {
  id: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number[];
  onChange: (value: number[]) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({ id, min, max, step, defaultValue, onChange, className }) => {
  return (
    <input
      type="range"
      id={id}
      min={min}
      max={max}
      step={step}
      defaultValue={defaultValue[0]}
      onChange={(e) => onChange([Number(e.target.value)])}
      className={`slider ${className}`}
    />
  );
};