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
    <div className="flex gap-1 text-sm bg-gray-50 rounded-full overflow-hidden">
      {options.map((option) => (
        <button
          key={option.value}
          className={`px-4 py-2 cursor-pointer ${
            selectedLanguage === option.value ? "bg-gray-900 text-white" : ""
          }`}
          onClick={() => onLanguageChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
