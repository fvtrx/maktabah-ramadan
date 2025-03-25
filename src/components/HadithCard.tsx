import { Bookmark, DisplayLanguage } from "@src/store";
import { Hadith } from "@src/utils/queries/useGetAllHadith";
import startCase from "lodash/startCase";
import { FC } from "react";

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
  return (
    <div
      className="bg-white border border-gray-100 rounded-lg p-3 sm:p-6 hover:shadow-sm transition-shadow cursor-pointer"
      onClick={() => viewHadithDetails(hadith)}
    >
      <div className="flex justify-between items-start mb-2 sm:mb-4">
        <div className="flex items-start sm:items-center">
          <button
            className="mr-2 sm:mr-3 text-lg text-gray-400 hover:text-yellow-500 p-1"
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(hadith.id, e);
            }}
            aria-label={
              bookmarks.some((bookmark) => bookmark.id === hadith.id)
                ? "Remove from bookmarks"
                : "Add to bookmarks"
            }
          >
            {bookmarks.some((bookmark) => bookmark.id === hadith.id)
              ? "★"
              : "☆"}
          </button>
          <div className="max-w-full">
            <h3 className="font-medium text-sm sm:text-base line-clamp-2">
              {startCase(hadith?.title.toLowerCase())}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate max-w-full text-wrap">
              {hadith?.collection} • {hadith?.book} #{hadith?.number}
            </p>
          </div>
        </div>
      </div>

      {/* Show text based on language preference */}
      <div className="space-y-2 sm:space-y-3 p-1.5 lg:p-0">
        {(displayLanguage === "arabic" || displayLanguage === "both") && (
          <p
            dir="rtl"
            className="text-sm sm:text-base text-gray-700 leading-relaxed line-clamp-3"
            lang="ar"
          >
            {hadith?.arabic_text}
          </p>
        )}

        {(displayLanguage === "malay" || displayLanguage === "both") && (
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed line-clamp-4 sm:line-clamp-3 text-justify">
            {hadith?.meaning}
          </p>
        )}
      </div>

      {/* <div className="flex flex-wrap mt-3 sm:mt-4 gap-1">
        {hadith?.topics &&
          hadith?.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="text-xs px-2 py-0.5 sm:py-1 rounded-full bg-gray-50 text-gray-500"
            >
              {startCase(topic)}
            </span>
          ))}
        {hadith?.topics && hadith?.topics.length > 3 && (
          <span className="text-xs px-2 py-0.5 sm:py-1 rounded-full bg-gray-50 text-gray-500">
            +{hadith?.topics.length - 3}
          </span>
        )}
      </div> */}
    </div>
  );
};

export default HadithCard;
