import { useEffect, useRef } from "react";
import { Hadith } from "@src/utils/queries/useGetAllHadith";

interface HadithStore {
  hadiths: Hadith[];
  setHadiths: (hadiths: Hadith[]) => void;
  setCollections: (collections: string[]) => void;
  setBooks: (books: string[]) => void;
  setBookOptions: (books: string[]) => void;
}

/**
 * Hook to manage hadith data initialization and updates
 */
export const useHadithData = (
  hadithList: Hadith[],
  store: HadithStore,
  loadSavedBookmarks: () => void,
) => {
  const { hadiths, setHadiths, setCollections, setBooks, setBookOptions } =
    store;
  const initialized = useRef(false);

  // Initialize hadiths and metadata on first load
  useEffect(() => {
    if (hadithList.length === 0 || initialized.current) return;

    initialized.current = true;
    setHadiths(hadithList);

    const uniqueCollections = [
      ...new Set(hadithList.map((h) => h?.collection).filter(Boolean)),
    ];
    const uniqueBooks = [
      ...new Set(hadithList.map((h) => h?.book).filter(Boolean)),
    ];

    setCollections(uniqueCollections);
    setBooks(uniqueBooks);
    setBookOptions(uniqueBooks);
    loadSavedBookmarks();
  }, [
    hadithList,
    setHadiths,
    setCollections,
    setBooks,
    setBookOptions,
    loadSavedBookmarks,
  ]);

  // Update hadiths when new data is loaded (pagination)
  useEffect(() => {
    if (!initialized.current || hadithList.length === 0) return;
    if (hadiths.length !== hadithList.length) {
      setHadiths(hadithList);
    }
  }, [hadithList, hadiths.length, setHadiths]);
};
