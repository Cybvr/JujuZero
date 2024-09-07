import React from 'react';

interface CheckboxProps {
  id: string;
  label?: string;
  checked?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  'aria-label'?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ 
  id, 
  label, 
  checked = false, 
  onChange, 
  className = '',
  'aria-label': ariaLabel
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="mr-2"
        aria-label={ariaLabel || label || "Checkbox"}
      />
      {label && <label htmlFor={id} className="text-sm">{label}</label>}
    </div>
  );
};