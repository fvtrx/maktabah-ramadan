import { useEffect } from "react";
import { Hadith } from "@src/utils/queries/useGetAllHadith";

const FILTER_ALL = "all";

interface FilterStore {
  hadiths: Hadith[];
  books: string[];
  selectedCollection: string;
  selectedBook: string;
  selectedGrade: string;
  showBookmarks: boolean;
  searchTerm: string;
  bookmarks: Array<{ id: number }>;
  setFilteredHadiths: (hadiths: Hadith[]) => void;
  setBookOptions: (books: string[]) => void;
  setSelectedBook: (book: string) => void;
}

/**
 * Hook to manage hadith filtering logic
 */
export const useHadithFilters = (store: FilterStore) => {
  const {
    hadiths,
    books,
    selectedCollection,
    selectedBook,
    selectedGrade,
    showBookmarks,
    searchTerm,
    bookmarks,
    setFilteredHadiths,
    setBookOptions,
    setSelectedBook,
  } = store;

  // Update book options when collection changes
  useEffect(() => {
    if (hadiths.length === 0) return;

    const newBookOptions =
      selectedCollection === FILTER_ALL
        ? books
        : [
            ...new Set(
              hadiths
                .filter((h) => h.collection === selectedCollection)
                .map((h) => h?.book)
                .filter(Boolean),
            ),
          ];

    setBookOptions(newBookOptions);
    setSelectedBook(FILTER_ALL);
  }, [selectedCollection, hadiths, books, setBookOptions, setSelectedBook]);

  // Apply all filters
  useEffect(() => {
    if (hadiths.length === 0) return;

    const applyFilters = () => {
      let results = [...hadiths];

      // Filter by bookmarks
      if (showBookmarks) {
        results = results.filter((hadith) =>
          bookmarks.some((bookmark) => bookmark.id === hadith.id),
        );
      }

      // Filter by collection
      if (selectedCollection !== FILTER_ALL) {
        results = results.filter(
          (hadith) => hadith.collection === selectedCollection,
        );
      }

      // Filter by book
      if (selectedBook !== FILTER_ALL) {
        results = results.filter((hadith) => hadith.book === selectedBook);
      }

      // Filter by search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        results = results.filter(
          (hadith) =>
            hadith.meaning?.toLowerCase().includes(term) ||
            hadith.arabic_text?.toLowerCase().includes(term) ||
            hadith.book?.toLowerCase().includes(term) ||
            hadith.number?.includes(term) ||
            hadith.title?.toLowerCase().includes(term),
        );
      }

      setFilteredHadiths(results);
    };

    // Debounce filter application
    const timer = setTimeout(applyFilters, 100);
    return () => clearTimeout(timer);
  }, [
    hadiths,
    searchTerm,
    selectedCollection,
    selectedBook,
    selectedGrade,
    bookmarks,
    showBookmarks,
    setFilteredHadiths,
  ]);
};
