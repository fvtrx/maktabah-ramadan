import startCase from "lodash/startCase";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type DropdownProps = {
  selectedItem: string;
  setSelectedItem: (val: string) => void;
  selectedOptions: string[];
  type: "collections" | "books" | "narrators" | "grades";
};

const Dropdown: React.FC<DropdownProps> = ({
  selectedItem,
  setSelectedItem,
  selectedOptions,
  type,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownSelect = (value: string) => {
    setSelectedItem(value);
    setIsOpen(false);
  };

  return (
    <div className="mb-6 w-full max-w-md">
      <label className="block text-sm font-medium text-gray-600 mb-2">
        {startCase(type)}
      </label>
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          className="w-full p-3 px-4 bg-white text-left rounded-lg border border-gray-200 shadow-sm flex justify-between items-center hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-gray-700">
            {selectedItem === "all" ? `All ${type}` : startCase(selectedItem)}
          </span>
          <ChevronDown
            className={`text-gray-400 w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 animate-in fade-in-50 slide-in-from-top-2">
            <ul className="py-1 max-h-60 overflow-auto">
              <li>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                    selectedItem === "all"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700"
                  }`}
                  onClick={() => handleDropdownSelect("all")}
                >
                  {`All ${type}`}
                </button>
              </li>
              {selectedOptions.map((option) => (
                <li key={option}>
                  <button
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      selectedItem === option
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700"
                    }`}
                    onClick={() => handleDropdownSelect(option)}
                  >
                    {startCase(option)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
