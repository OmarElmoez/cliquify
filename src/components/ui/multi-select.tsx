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
  const [isOpen, setIsOpen] = useState(false);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.multi-select-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionToggle = (optionValue: string | number) => {
    const isSelected = value.includes(optionValue);
    
    if (isSelected) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemoveOption = (optionValue: string | number, event: React.MouseEvent) => {
    event.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  const getOptionLabel = (optionValue: string | number) => {
    const option = options.find(opt => opt.value === optionValue);
    return option ? option.label : optionValue.toString();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      <div className="relative multi-select-container">
        <div 
          className="flex items-center justify-between w-full px-3 py-2 border border-input bg-background rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex flex-wrap gap-1">
            {value && value.length > 0 ? (
              value.map((optionValue) => (
                <span 
                  key={optionValue} 
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {getOptionLabel(optionValue)}
                  <button
                    type="button"
                    className="ml-1 text-blue-600 hover:text-blue-800"
                    onClick={(e) => handleRemoveOption(optionValue, e)}
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-input rounded-md shadow-lg">
            {options.map((option) => (
              <div 
                key={option.value}
                className="flex items-center px-3 py-2 hover:bg-accent cursor-pointer"
                onClick={() => handleOptionToggle(option.value)}
              >
                <Checkbox
                  checked={value.includes(option.value)}
                  className="mr-2"
                />
                <span className="text-sm">{option.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 