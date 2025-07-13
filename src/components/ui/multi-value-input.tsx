import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Search, X } from "lucide-react";

interface MultiValueInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  placeholder?: string;
}

export const MultiValueInput: React.FC<MultiValueInputProps> = ({
  value,
  onChange,
  onBlur,
  placeholder,
}) => {
  const [input, setInput] = useState("");

  const addValue = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addValue();
    }
    if (e.key === "Backspace" && !input && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  const handleRemove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 rounded-md px-2 py-1 border border-gray-200 bg-white">
        <Search size={18} color="#9ca3af" className="mr-1" />
        <Input
          className="flex-1 bg-transparent border-none border-transparent w-full px-0 focus-visible:ring-0 focus:outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={() => {
            addValue();
            onBlur?.();
          }}
          placeholder={placeholder}
        />
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {value.map((val, idx) => (
            <span
              key={idx}
              className="flex items-center bg-[#f5f6f7] text-gray-800 rounded-full px-3 py-1 shadow-sm border border-gray-200 text-sm font-medium transition hover:bg-[#ffe5de]"
            >
              <span className="truncate max-w-[160px]">{val}</span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="ml-1 h-4 w-4 p-0 text-gray-400 hover:text-[#ff7a59] hover:bg-transparent"
                onClick={() => handleRemove(idx)}
                tabIndex={-1}
              >
                <X size={14} />
              </Button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}; 