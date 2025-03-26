import Layout from "@src/components/common/Layout";
import FilterHadithSidebar from "@src/components/FilterHadithSidebar";
import HadithCard from "@src/components/HadithCard";
import HadithDetailsModal from "@src/components/HadithDetailsModal";
import LoadingIcon from "@src/components/icons/LoadingIcon";
import LanguageSelector from "@src/components/LanguageSelector";
import { useHadithStore } from "@src/store";
import { copyHadithText } from "@src/utils/helpers/string";
import useBookmarkManager from "@src/utils/hooks/useBookmarkManager";
import useHadithNavigation from "@src/utils/hooks/useHadithNavigation";
import useInfiniteScroll from "@src/utils/hooks/useInfiniteScroll";
import useToast from "@src/utils/hooks/useToast";
import useGetAllHadith, { Hadith } from "@src/utils/queries/useGetAllHadith";
import router from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

const FILTER_ALL = "all";
const PAGINATION_SIZE = 25;

const HadithListPage: React.FC<{ initialHadithId?: string }> = ({
  initialHadithId,
}) => {
  const {
    hadiths,
    filteredHadiths,
    selectedHadith,
    displayLanguage,
    books,
    selectedCollection,
    selectedBook,
    showBookmarks,
    searchTerm,
    isSidebarOpen,
    bookmarks,
    selectedGrade,
    setHadiths,
    setFilteredHadiths,
    setCollections,
    setBookOptions,
    setBooks,
    setSelectedBook,
    setDisplayLanguage,
    resetFilters,
    toggleSidebar,
  } = useHadithStore();

  const hadithsSetRef = useRef(false);
  const filterAppliedRef = useRef(false);

  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  const { loadSavedBookmarks, toggleBookmark } = useBookmarkManager();
  const { openHadithDetails, closeHadithDetails } = useHadithNavigation(
    hadiths,
    initialHadithId
  );

  const {
    data,
    fetchNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useGetAllHadith({
    pagination_number: PAGINATION_SIZE,
  });

  const loadMoreRef = useInfiniteScroll(fetchNextPage);

  const hadithList: Hadith[] | undefined = data?.pages.flatMap(
    (page) => page.data
  );

  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      toggleSidebar();
    }
  }, [isMobile, isSidebarOpen, toggleSidebar]);

  // Process initial data from API
  useEffect(() => {
    if (hadithList && hadithList.length > 0 && !hadithsSetRef.current) {
      hadithsSetRef.current = true;

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
    }
  }, [
    hadithList,
    setHadiths,
    setCollections,
    setBooks,
    setBookOptions,
    loadSavedBookmarks,
  ]);

  useEffect(() => {
    if (!hadiths.length) return;

    const newBookOptions =
      selectedCollection === FILTER_ALL
        ? books
        : [
            ...new Set(
              hadiths
                .filter((h) => h.collection === selectedCollection)
                .map((h) => h?.book)
                .filter(Boolean)
            ),
          ];

    setBookOptions(newBookOptions);
    setSelectedBook(FILTER_ALL);
  }, [selectedCollection, hadiths, books, setBookOptions, setSelectedBook]);

  useEffect(() => {
    if (!hadiths.length) return;

    const applyFilters = () => {
      let results = [...hadiths];

      if (showBookmarks) {
        results = results.filter((hadith) =>
          bookmarks.some((bookmark) => bookmark.id === hadith.id)
        );
      }

      if (selectedCollection !== FILTER_ALL) {
        results = results.filter(
          (hadith) => hadith.collection === selectedCollection
        );
      }

      if (selectedBook !== FILTER_ALL) {
        results = results.filter((hadith) => hadith.book === selectedBook);
      }

      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        results = results.filter(
          (hadith) =>
            hadith.meaning?.toLowerCase().includes(term) ||
            hadith.arabic_text?.toLowerCase().includes(term) ||
            hadith.book?.toLowerCase().includes(term) ||
            hadith.number?.includes(term) ||
            hadith.title?.toLowerCase().includes(term)
        );
      }

      filterAppliedRef.current = true;
      setFilteredHadiths(results);
    };

    const timer = setTimeout(() => {
      applyFilters();
    }, 100);

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

  useEffect(() => {
    const handler = setTimeout(() => {
      refetch();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, refetch]);

  if (isError) {
    router.replace("/something-wrong");
  }

  const handleCopyHadithText = (text: string) => {
    copyHadithText(setCopied, { text, displayLanguage });
    toast.open({
      content: "Hadith copied successfully!",
      variant: "success",
    });
  };

  const handleResetFilters = () => {
    filterAppliedRef.current = false;
    resetFilters();
  };

  return (
    <Layout
      title="Senarai Hadith - Maktabah Ramadan"
      description="Sebuah platform yang menghimpunkan kesemua hadis-hadis yang berkaitan dengan bulan Ramadan"
      keywords="hadis, ramadan, maktabah-ramadan"
    >
      <div className="flex flex-col h-screen bg-white text-gray-900">
        {/* Header */}
        <header className="border-b border-gray-100 py-2 sm:py-4 px-3 sm:px-6 bg-white sticky top-0 z-10">
          <div className="flex flex-col sm:flex-row lg:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleSidebar}
                className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Toggle sidebar"
              >
                ☰
              </button>
              <h1 className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black to-violet-300 truncate">
                <span className="text-lg sm:text-2xl mr-1 sm:mr-2">☪</span>
                <span className="inline">Maktabah</span> Ramadan
              </h1>
            </div>

            {/* Language switcher */}
            <LanguageSelector
              selectedLanguage={displayLanguage}
              onLanguageChange={(value) => setDisplayLanguage(value)}
            />
          </div>
        </header>

        <main className="flex flex-1 overflow-hidden">
          <FilterHadithSidebar isSidebarOpen={isSidebarOpen} />

          {!data && isLoading ? (
            <section className="flex w-full items-center justify-center gap-2 py-8">
              <LoadingIcon className="mx-2 my-8 text-violet-500" /> Loading...
            </section>
          ) : (
            <div className="flex-1 p-3 sm:p-6 overflow-y-auto items-center justify-center">
              {filteredHadiths.length > 0 && (
                <div className="space-y-3 sm:space-y-6">
                  {filteredHadiths?.map((hadith) => (
                    <HadithCard
                      key={hadith?.id}
                      hadith={hadith}
                      viewHadithDetails={openHadithDetails}
                      displayLanguage={displayLanguage}
                      bookmarks={bookmarks}
                      toggleBookmark={(id, event) =>
                        toggleBookmark(id, hadiths, event)
                      }
                    />
                  ))}
                </div>
              )}

              {filteredHadiths.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                    No hadith found matching your search criteria.
                  </p>
                  <button
                    className="text-xs sm:text-sm text-gray-500 border p-1.5 sm:p-2 rounded-sm relative overflow-hidden group hover:cursor-pointer"
                    onClick={handleResetFilters}
                  >
                    <span className="relative z-10 transition-colors duration-150 group-hover:text-white">
                      Clear filters
                    </span>
                    <span className="absolute inset-0 bg-black/80 transform scale-x-0 origin-left transition-transform duration-150 ease-in-out group-hover:scale-x-100"></span>
                  </button>
                </div>
              )}

              <div
                className="flex items-center justify-center"
                ref={loadMoreRef}
              >
                {isFetchingNextPage && (
                  <LoadingIcon className="mt-4 text-decubeBlue" />
                )}
              </div>
            </div>
          )}
        </main>

        {selectedHadith && (
          <HadithDetailsModal
            selectedHadith={selectedHadith}
            closeHadithDetails={closeHadithDetails}
            toggleBookmark={(id, event) => toggleBookmark(id, hadiths, event)}
            bookmarks={bookmarks}
            displayLanguage={displayLanguage}
            isCopied={copied}
            copyHadithText={handleCopyHadithText}
          />
        )}

        {/* Footer */}
        <footer className="py-2 sm:py-4 px-3 sm:px-6 border-t border-gray-100 text-center text-gray-400 text-xs sm:text-sm">
          <span className="font-semibold text-black/60">Maktabah Ramadan</span>{" "}
          • Develop by{" "}
          <span className="text-black/60 font-semibold">fvtrx</span> &copy;.
        </footer>
      </div>
    </Layout>
  );
};

export default HadithListPage;
