import React from "react";

interface EmptyStateProps {
  onResetFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onResetFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
        No hadith found matching your search criteria.
      </p>
      <button
        className="text-xs sm:text-sm text-gray-500 border p-1.5 sm:p-2 rounded-sm relative overflow-hidden group hover:cursor-pointer"
        onClick={onResetFilters}
      >
        <span className="relative z-10 transition-colors duration-150 group-hover:text-white">
          Clear filters
        </span>
        <span className="absolute inset-0 bg-black/80 transform scale-x-0 origin-left transition-transform duration-150 ease-in-out group-hover:scale-x-100"></span>
      </button>
    </div>
  );
};
