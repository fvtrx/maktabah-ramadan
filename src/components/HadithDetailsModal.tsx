import { Bookmark, DisplayLanguage } from "@src/store";
import { directDownload } from "@src/utils/helpers/shareHadith"; // Import the screenshot function
import { Hadith } from "@src/utils/queries/useGetAllHadith";
import startCase from "lodash/startCase";
import { DownloadIcon } from "lucide-react";
import React, { FC, useEffect, useRef, useState } from "react";

type Props = {
  selectedHadith: Hadith;
  bookmarks: (Bookmark | { id: number; hadithId: number; dateAdded: string })[];
  closeHadithDetails: () => void;
  toggleBookmark: (
    id: number,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  displayLanguage: DisplayLanguage;
  copyHadithText: (text: string) => void;
  isCopied: boolean;
};

const HadithDetailsModal: FC<Props> = ({
  selectedHadith,
  closeHadithDetails,
  toggleBookmark,
  bookmarks,
  displayLanguage,
  copyHadithText,
  isCopied,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedHadith) {
      setIsClosing(false);

      requestAnimationFrame(() => {
        setIsOpen(true);
      });
    }
  }, [selectedHadith]);

  const handleClose = () => {
    setIsClosing(true);
    setIsOpen(false);
    setTimeout(closeHadithDetails, 300);
  };

  if (!selectedHadith) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.25)",
        backdropFilter: "blur(4px)",
        opacity: isOpen ? 1 : 0,
        transition: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        visibility: isClosing && !isOpen ? "visible" : undefined,
        willChange: "opacity",
      }}
      onClick={handleClose}
    >
      <div
        className="bg-white pb-4 px-2 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] sm:max-h-screen overflow-hidden"
        style={{
          transform: isOpen ? "scale(1)" : "scale(0.98)",
          opacity: isOpen ? 1 : 0,
          transition:
            "transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform, opacity",
        }}
        onClick={(e) => e.stopPropagation()}
        ref={modalContentRef}
      >
        <div className="flex justify-between items-center p-3 sm:p-6 border-b border-gray-100">
          <div className="flex items-start flex-col gap-1 sm:gap-2 max-w-full sm:max-w-[620px]">
            <h2 className="text-lg sm:text-xl font-semibold line-clamp-2">
              {startCase(selectedHadith.title.toLowerCase())}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 text-wrap line-clamp-2">
              {selectedHadith.collection} • {selectedHadith.book} #
              {selectedHadith.number}
            </p>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
            <button
              className="text-lg text-gray-400 hover:text-yellow-500 p-1"
              style={{ transition: "color 200ms ease" }}
              onClick={(e) => toggleBookmark(selectedHadith.id, e)}
              aria-label="Toggle bookmark"
            >
              {bookmarks.some((bookmark) => bookmark.id === selectedHadith.id)
                ? "★"
                : "☆"}
            </button>
            <button
              className="text-gray-400 hover:text-gray-600 p-1"
              style={{ transition: "color 200ms ease" }}
              onClick={handleClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-4 sm:px-6 sm:pt-2.5 overflow-y-auto max-h-[60vh] sm:max-h-[70vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* <div className="mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
              Diriwayatkan oleh:
            </h3>
            <p className="text-sm sm:text-base text-gray-700">
              {selectedHadith.narrator}
            </p>
          </div> */}

          <div className="space-y-4 sm:space-y-6">
            {(displayLanguage === "arabic" || displayLanguage === "both") && (
              <div
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0)" : "translateY(8px)",
                  transition: "opacity 400ms ease, transform 400ms ease",
                  transitionDelay: "200ms",
                  willChange: "opacity, transform",
                }}
              >
                <h3 className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                  Ayat Hadis
                </h3>
                <p
                  dir="rtl"
                  className="text-gray-700 leading-relaxed text-base sm:text-lg"
                  lang="ar"
                >
                  {selectedHadith.arabic_text}
                </p>
              </div>
            )}

            {(displayLanguage === "malay" || displayLanguage === "both") && (
              <div
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0)" : "translateY(8px)",
                  transition: "opacity 400ms ease, transform 400ms ease",
                  transitionDelay: "100ms",
                  willChange: "opacity, transform",
                }}
              >
                <h3 className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                  Maksud Hadis (Bahasa Malaysia)
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-justify">
                  {selectedHadith.meaning}
                </p>
              </div>
            )}
          </div>

          <div
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 400ms ease, transform 400ms ease",
              transitionDelay: "300ms",
              willChange: "opacity, transform",
            }}
            className="mt-4 sm:mt-6"
          >
            <h3 className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
              Pengajaran Hadis
            </h3>
            <ol className="list-decimal pl-4 sm:pl-5 space-y-1 sm:space-y-2 text-sm sm:text-base">
              {selectedHadith.lesson.map((item, index) => {
                return (
                  <li key={index} className="text-justify">
                    {item}
                  </li>
                );
              })}
            </ol>
          </div>

          {/* <div className="flex flex-wrap pt-4 sm:pt-6 gap-1 sm:gap-2 items-center">
            <p className="text-xs sm:text-sm text-gray-500">Kata kunci:</p>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {selectedHadith.topics &&
                selectedHadith.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gray-100 text-gray-700 font-medium"
                  >
                    {startCase(topic)}
                  </span>
                ))}
            </div>
          </div> */}
        </div>

        {/* Button section */}
        <div
          className="px-3 sm:px-6 pt-3 sm:pt-4 border-t border-gray-100 flex flex-wrap gap-2"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 400ms ease, transform 400ms ease",
            transitionDelay: "400ms",
            willChange: "opacity, transform",
          }}
        >
          <button
            disabled={isCopied}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm cursor-pointer disabled:cursor-not-allowed transition-all duration-150 ease-in-out ${
              isCopied
                ? "bg-gray-400 text-white cursor-not-allowed opacity-70"
                : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md active:transform active:scale-95"
            }`}
            onClick={() => {
              if (!isCopied) {
                copyHadithText(selectedHadith.meaning);
              }
            }}
          >
            {isCopied ? "Copied!" : "Copy text"}
          </button>

          <div className="flex gap-2">
            <button
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white text-xs sm:text-sm flex place-items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
              style={{
                transition: "all 150ms ease",
              }}
              onClick={() => {
                setIsSharing(true);
                directDownload(modalContentRef).finally(() => {
                  setTimeout(() => setIsSharing(false), 1000);
                });
              }}
            >
              {isSharing ? (
                "Processing..."
              ) : (
                <>
                  <DownloadIcon />
                  Download
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HadithDetailsModal;
