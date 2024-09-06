// @components/ui/slider.tsx
import React from 'react';

interface SliderProps {
  id: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number[];
  className: string;
}

export const Slider: React.FC<SliderProps> = ({ id, min, max, step, defaultValue, className }) => {
  // You can replace this simple slider with any slider component from a UI library or custom implementation
  return (
    <input
      type="range"
      id={id}
      min={min}
      max={max}
      step={step}
      defaultValue={defaultValue[0]}
      className={`slider ${className}`}
    />
  );
};