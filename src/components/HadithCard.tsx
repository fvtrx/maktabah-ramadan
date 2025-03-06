import { Bookmark, DisplayLanguage, Hadith } from "@src/store";
import startCase from "lodash/startCase";
import { FC } from "react";

type Props = {
  hadith: Hadith;
  viewHadithDetails: (hadith: Hadith) => void;
  bookmarks: (Bookmark | { id: number; hadithId: number; dateAdded: string })[];
  toggleBookmark: (
    id: number,
    event: React.MouseEvent<HTMLButtonElement>
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
      className="bg-white border border-gray-100 rounded-lg p-6 hover:shadow-sm transition-shadow cursor-pointer"
      onClick={() => viewHadithDetails(hadith)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <button
            className="mr-3 text-lg text-gray-400 hover:text-yellow-500"
            onClick={(e) => toggleBookmark(hadith.id, e)}
          >
            {bookmarks.some((bookmark) => bookmark.id === hadith.id)
              ? "★"
              : "☆"}
          </button>
          <div>
            <h3 className="font-medium">
              {startCase(hadith.chapter.toLowerCase())}
            </h3>
            <p className="text-sm text-gray-500">
              {hadith.collection} • {hadith.narrator} • {hadith.book} #
              {hadith.number}
            </p>
          </div>
        </div>
        {/* <GradeBadge grade={hadith.grade} /> */}
      </div>

      {/* Show text based on language preference */}
      <div className="space-y-3">
        {(displayLanguage === "malay" || displayLanguage === "both") && (
          <p className="text-gray-700 leading-relaxed">
            {hadith.translation.length > 200
              ? hadith.translation.substring(0, 200) + "..."
              : hadith.translation}
          </p>
        )}

        {/* {(displayLanguage === "arabic" || displayLanguage === "both") && (
          <p dir="rtl" className="text-gray-700 leading-relaxed" lang="ar">
            {hadith.arabicText?.length > 200
              ? hadith.arabicText.substring(0, 200) + "..."
              : hadith.arabicText}
          </p>
        )} */}
      </div>

      <div className="flex flex-wrap mt-4 gap-1">
        {hadith.topics &&
          hadith.topics.map((topic) => (
            <span
              key={topic}
              className="text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-500"
            >
              {startCase(topic)}
            </span>
          ))}
      </div>
    </div>
  );
};

export default HadithCard;
