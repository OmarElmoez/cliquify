import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export interface MultiSelectOption {
  value: string | number;
  label: string;
}

interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  options: MultiSelectOption[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  placeholder = "Select options...",
  options,
  value,
  onChange,
  className = ""
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      <div className="flex flex-col gap-2">
        {options.map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`multi-select-option-${option.value}`}
              checked={Array.isArray(value) ? value.includes(option.value) : false}
              onCheckedChange={checked => {
                let newValue: (string | number)[] = Array.isArray(value) ? [...value] : [];
                if (checked) {
                  if (!newValue.includes(option.value)) {
                    newValue.push(option.value);
                  }
                } else {
                  newValue = newValue.filter(v => v !== option.value);
                }
                onChange(newValue);
              }}
            />
            <label htmlFor={`multi-select-option-${option.value}`} className="text-sm">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}; 