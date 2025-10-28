import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface CustomSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={selectRef}>
      {label && (
        <label className="block text-teal-300 text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <div
        className="relative bg-black/50 border border-teal-800/50 rounded-lg cursor-pointer transition-all duration-200 hover:border-teal-600 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between p-3">
          <span className="text-teal-100 font-medium">
            {value || placeholder}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-teal-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-black/90 border border-teal-800/50 rounded-lg shadow-xl backdrop-blur-sm z-50 overflow-hidden">
            {options.map((option, index) => (
              <div
                key={option}
                className={`px-3 py-2 cursor-pointer transition-colors duration-150 flex items-center justify-between ${
                  value === option
                    ? "bg-teal-800/30 text-teal-100"
                    : "text-teal-200 hover:bg-teal-800/20 hover:text-teal-100"
                } ${
                  index !== options.length - 1
                    ? "border-b border-teal-800/30"
                    : ""
                }`}
                onClick={() => handleOptionClick(option)}
              >
                <span className="font-medium">{option}</span>
                {value === option && (
                  <Check className="w-4 h-4 text-teal-400" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
