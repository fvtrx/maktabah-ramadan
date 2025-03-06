import { Bookmark, DisplayLanguage, Hadith } from "@src/store";
import React, { FC, useEffect, useState } from "react";
import GradeBadge from "./GradeBadge";

type Props = {
  selectedHadith: Hadith;
  bookmarks: (Bookmark | { id: number; hadithId: number; dateAdded: string })[];
  closeHadithDetails: () => void;
  toggleBookmark: (
    id: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  displayLanguage: DisplayLanguage;
  copyHadithText: (text: string, arabicText: string) => void;
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
      className={`fixed inset-0 flex items-center justify-center p-4 z-50`}
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
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-screen overflow-hidden"
        style={{
          transform: isOpen ? "scale(1)" : "scale(0.98)",
          opacity: isOpen ? 1 : 0,
          transition:
            "transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform, opacity",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-light">
            {selectedHadith.collection}: {selectedHadith.book} #
            {selectedHadith.number}
          </h2>
          <div className="flex items-center space-x-4">
            <button
              className="text-lg text-gray-400 hover:text-yellow-500"
              style={{ transition: "color 200ms ease" }}
              onClick={(e) => toggleBookmark(selectedHadith.id, e)}
            >
              {bookmarks.some((bookmark) => bookmark.id === selectedHadith.id)
                ? "★"
                : "☆"}
            </button>
            <button
              className="text-gray-400 hover:text-gray-600"
              style={{ transition: "color 200ms ease" }}
              onClick={handleClose}
            >
              ✕
            </button>
          </div>
        </div>
        <div className="p-6 pt-2.5 overflow-y-auto max-h-[70vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="mb-2 md:mb-0">
              <p className="text-sm text-gray-500">{selectedHadith.chapter}</p>
              <p className="text-sm text-gray-400">
                {selectedHadith.reference}
              </p>
            </div>

            <GradeBadge grade={selectedHadith.grade} />
          </div>

          <div className="mb-6">
            <h3 className="text-sm text-gray-500 mb-2">Narrator</h3>
            <p className="text-gray-700">{selectedHadith.narrator}</p>
          </div>

          <div className="space-y-6">
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
                <h3 className="text-sm text-gray-500 mb-2">Arabic</h3>
                <p
                  dir="rtl"
                  className="text-gray-700 leading-relaxed text-lg"
                  lang="ar"
                >
                  {selectedHadith.arabicText}
                </p>
              </div>
            )}

            {(displayLanguage === "english" || displayLanguage === "both") && (
              <div
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0)" : "translateY(8px)",
                  transition: "opacity 400ms ease, transform 400ms ease",
                  transitionDelay: "100ms",
                  willChange: "opacity, transform",
                }}
              >
                <h3 className="text-sm text-gray-500 mb-2">English</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedHadith.text}
                </p>
              </div>
            )}
          </div>

          {selectedHadith.topics && (
            <div
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 400ms ease, transform 400ms ease",
                transitionDelay: "300ms",
                willChange: "opacity, transform",
              }}
              className="mt-6"
            >
              <h3 className="text-sm text-gray-500 mb-2">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {selectedHadith.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-xs"
                    style={{ transition: "background-color 150ms ease" }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                    }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div
            className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-2"
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
              className={`px-4 py-2 rounded-full text-sm cursor-pointer disabled:cursor-not-allowed transition-all duration-150 ease-in-out ${
                isCopied
                  ? "bg-gray-400 text-white cursor-not-allowed opacity-70"
                  : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md active:transform active:scale-95"
              }`}
              onClick={() => {
                if (!isCopied) {
                  copyHadithText(
                    selectedHadith.text,
                    selectedHadith.arabicText
                  );
                }
              }}
            >
              {isCopied ? "Copied!" : "Copy text"}
            </button>

            <button
              className="px-4 py-2 rounded-full bg-gray-50 text-gray-700 text-sm"
              style={{ transition: "all 150ms ease" }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6";
                e.currentTarget.style.boxShadow =
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#f9fafb";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HadithDetailsModal;
