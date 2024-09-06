// @components/ui/checkbox.tsx
import React from 'react';

interface CheckboxProps {
  id: string;
  label: string;
  checked?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked = false, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
      <label htmlFor={id} className="text-sm">{label}</label>
    </div>
  );
};