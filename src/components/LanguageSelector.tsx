import { DisplayLanguage } from "@src/store";
import { FC } from "react";

type Options = { value: DisplayLanguage; label: string };

type Props = {
  selectedLanguage: string;
  onLanguageChange: (val: DisplayLanguage) => void;
  options?: Options[];
};
const LanguageSelector: FC<Props> = ({
  selectedLanguage,
  onLanguageChange,
  options = [
    { value: "both", label: "Both" },
    { value: "arabic", label: "Arabic" },
    { value: "malay", label: "Malay" },
  ],
}) => {
  return (
    <div className="flex gap-0.5 sm:gap-1 text-xs sm:text-sm bg-gray-50 rounded-full overflow-hidden">
      {options.map((option) => (
        <button
          key={option.value}
          className={`px-2 sm:px-4 py-1 sm:py-2 cursor-pointer transition-colors ${
            selectedLanguage === option.value ? "bg-gray-900 text-white" : ""
          }`}
          onClick={() => onLanguageChange(option.value)}
          aria-pressed={selectedLanguage === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
