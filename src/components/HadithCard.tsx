import { Bookmark, DisplayLanguage } from "@src/store";
import { Hadith } from "@src/utils/queries/useGetAllHadith";
import startCase from "lodash/startCase";
import { FC, useState } from "react";

type Props = {
  hadith: Hadith;
  viewHadithDetails: (hadith: Hadith) => void;
  bookmarks: (Bookmark | { id: number; hadithId: number; dateAdded: string })[];
  toggleBookmark: (
    id: number,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  displayLanguage: DisplayLanguage;
};

const HadithCard: FC<Props> = ({
  hadith,
  viewHadithDetails,
  bookmarks,
  toggleBookmark,
  displayLanguage,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isBookmarked = bookmarks.some((bookmark) => bookmark.id === hadith.id);

  return (
    <div
      className={`
        relative group
        bg-linear-to-br from-white to-[#F5F3FF]
        border border-[#DDD6FE]
        rounded-2xl overflow-hidden
        cursor-pointer
        transition-all duration-300 ease-out
        ${isHovered ? "shadow-[0_12px_40px_rgba(109,40,217,0.15)] -translate-y-1" : "shadow-[0_2px_12px_rgba(109,40,217,0.07)]"}
        max-w-2xl mx-auto w-full
      `}
      onClick={() => viewHadithDetails(hadith)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative top accent line */}
      <div
        className={`
        absolute top-0 left-0 right-0 h-0.5
        bg-linear-to-r from-transparent via-[#7C3AED] to-transparent
        transition-opacity duration-300
        ${isHovered ? "opacity-100" : "opacity-40"}
      `}
      />

      {/* Geometric corner decoration */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.04]">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M64 0 L64 64 L0 64" fill="#6D28D9" />
          <path d="M64 16 L64 64 L16 64" fill="#6D28D9" />
        </svg>
      </div>

      <div className="p-5 sm:p-7">
        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
          {/* Bookmark button */}
          <button
            className={`
              shrink-0 mt-0.5
              w-9 h-9 sm:w-10 sm:h-10
              rounded-xl
              flex items-center justify-center
              transition-all duration-200
              ${
                isBookmarked
                  ? "bg-[#7C3AED] text-white shadow-[0_2px_8px_rgba(124,58,237,0.4)]"
                  : "bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white hover:shadow-[0_2px_8px_rgba(124,58,237,0.4)]"
              }
            `}
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(hadith.id, e);
            }}
            aria-label={
              isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={isBookmarked ? "0" : "2"}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#1E1B4B] text-sm sm:text-base leading-snug line-clamp-2 mb-1.5">
              {startCase(hadith?.title.toLowerCase())}
            </h3>

            {/* Badge row */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium text-[#6D28D9] bg-[#EDE9FE] px-2.5 py-0.5 rounded-full">
                {hadith?.collection}
              </span>
              <span className="text-[#C4B5FD] text-xs">•</span>
              <span className="text-[10px] sm:text-xs text-[#8B5CF6]">
                {hadith?.book}{" "}
                <span className="font-semibold text-[#6D28D9]">
                  #{hadith?.number}
                </span>
              </span>
            </div>
          </div>

          {/* Arrow indicator */}
          <div
            className={`
            shrink-0 w-7 h-7 rounded-lg
            flex items-center justify-center
            bg-[#EDE9FE] text-[#7C3AED]
            transition-all duration-200
            ${isHovered ? "bg-[#7C3AED] text-white translate-x-0.5" : ""}
          `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-[#C4B5FD] to-transparent mb-4 sm:mb-5" />

        {/* Text content */}
        <div className="space-y-3 sm:space-y-4">
          {(displayLanguage === "arabic" || displayLanguage === "both") && (
            <div className="bg-white/70 rounded-xl px-4 py-3 sm:px-5 sm:py-4 border border-[#EDE9FE]">
              <p
                dir="rtl"
                lang="ar"
                className="text-sm sm:text-base text-[#2E1065] leading-loose sm:leading-loose line-clamp-3 font-[Amiri,serif]"
                style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}
              >
                {hadith?.arabic_text}
              </p>
            </div>
          )}

          {(displayLanguage === "malay" || displayLanguage === "both") && (
            <div
              className={
                displayLanguage === "both"
                  ? ""
                  : "bg-white/70 rounded-xl px-4 py-3 sm:px-5 sm:py-4 border border-[#EDE9FE]"
              }
            >
              <p className="text-sm sm:text-base text-[#3B0764] leading-relaxed line-clamp-4 sm:line-clamp-3 text-justify">
                {hadith?.meaning}
              </p>
            </div>
          )}
        </div>

        {/* Read more hint */}
        <div
          className={`
          flex items-center justify-end gap-1 mt-3 sm:mt-4
          transition-all duration-200
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
        >
          <span className="text-[11px] sm:text-xs text-[#7C3AED] font-medium tracking-wide">
            Read full hadith
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-3 h-3 text-[#7C3AED]"
          >
            <path
              fillRule="evenodd"
              d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Bottom decorative accent */}
      <div
        className={`
        absolute bottom-0 left-0 right-0 h-0.5
        bg-linear-to-r from-transparent via-[#7C3AED] to-transparent
        transition-opacity duration-300
        ${isHovered ? "opacity-30" : "opacity-0"}
      `}
      />
    </div>
  );
};

export default HadithCard;
