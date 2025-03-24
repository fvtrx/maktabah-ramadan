import Layout from "@src/components/common/Layout";
import FilterHadithSidebar from "@src/components/FilterHadithSidebar";
import HadithCard from "@src/components/HadithCard";
import HadithDetailsModal from "@src/components/HadithDetailsModal";
import LanguageSelector from "@src/components/LanguageSelector";
import { Bookmark, useHadithStore } from "@src/store";
import { copyHadithText } from "@src/utils/helpers/string";
import useInfiniteScroll from "@src/utils/hooks/useInfiniteScroll";
import useToast from "@src/utils/hooks/useToast";
import usePostAllHadith, { Hadith } from "@src/utils/queries/usePostAllHadith";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

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
    selectedNarrator,
    bookmarks,
    selectedGrade,

    // Actions - group related actions together
    setHadiths,
    setFilteredHadiths,
    setSelectedHadith,

    setCollections,
    setBookOptions,
    setNarrators,
    setBookmarks,
    setBooks,
    setSelectedBook,
    setSearchTerm,
    setDisplayLanguage,
    resetFilters,
    toggleSidebar,
  } = useHadithStore();

  const toast = useToast();
  const [viewingHadithId, setViewingHadithId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  const initialRenderRef = useRef<boolean>(true);

  const {
    data,
    fetchNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = usePostAllHadith({
    pagination_number: 25,
  });

  const loadMoreRef = useInfiniteScroll(fetchNextPage);

  const hadithList: Hadith[] | undefined = data?.pages.flatMap(
    (page) => page.data.data
  );

  useEffect(() => {
    // Only run once on initial render for mobile devices
    if (initialRenderRef.current && isMobile && isSidebarOpen) {
      toggleSidebar();
      initialRenderRef.current = false;
    }
  }, [isMobile]);

  // Initialize hadiths data
  useEffect(() => {
    if (hadithList) {
      // Initialize state with mock data
      setHadiths(hadithList);
      setFilteredHadiths(hadithList);

      // Extract unique metadata for filters
      const uniqueCollections = [
        ...new Set(hadithList.map((h) => h.collection)),
      ];
      const uniqueBooks = [...new Set(hadithList.map((h) => h.book))];
      // const uniqueNarrators = [...new Set(hadithList.map((h) => h.narrator))];

      // Set filter options
      setCollections(uniqueCollections);
      setBooks(uniqueBooks);
      setBookOptions(uniqueBooks);
      // setNarrators(uniqueNarrators);

      // Load saved bookmarks from localStorage
      loadSavedBookmarks();
    }
  }, []);

  // Load bookmarks from localStorage
  const loadSavedBookmarks = () => {
    const savedBookmarks = localStorage.getItem("hadithBookmarks");
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  };

  // Update book options when collection changes
  useEffect(() => {
    if (!hadiths.length) return;

    const newBookOptions =
      selectedCollection === "all"
        ? books
        : [
            ...new Set(
              hadiths
                .filter((h) => h.collection === selectedCollection)
                .map((h) => h.book)
            ),
          ];

    setBookOptions(newBookOptions);
    setSelectedBook("all");
  }, [selectedCollection, hadiths, books]);

  // Apply filters and search
  useEffect(() => {
    if (!hadiths.length) return;

    // Filter by bookmarks, collection, book, and narrator
    let results = [...hadiths];

    if (showBookmarks) {
      results = results.filter((hadith) =>
        bookmarks.some((bookmark) => bookmark.id === hadith.id)
      );
    }

    if (selectedCollection !== "all") {
      results = results.filter(
        (hadith) => hadith.collection === selectedCollection
      );
    }

    if (selectedBook !== "all") {
      results = results.filter((hadith) => hadith.book === selectedBook);
    }

    // if (selectedNarrator !== "all") {
    //   results = results.filter(
    //     (hadith) => hadith.narrator === selectedNarrator
    //   );
    // }

    // Apply search term if present
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (hadith) =>
          hadith.meaning?.toLowerCase().includes(term) ||
          hadith.arabic_text?.toLowerCase().includes(term) ||
          // hadith.narrator?.toLowerCase().includes(term) ||
          hadith.book?.toLowerCase().includes(term) ||
          hadith.number?.includes(term) ||
          hadith.title?.toLowerCase().includes(term)
      );
    }

    setFilteredHadiths(results);
  }, [
    hadiths,
    searchTerm,
    selectedCollection,
    selectedBook,
    selectedNarrator,
    selectedGrade,
    bookmarks,
    showBookmarks,
  ]);

  const updateBookmarks = (
    newBookmarks: (
      | Bookmark
      | { id: number; hadithId: number; dateAdded: string }
    )[],
    message: string
  ): void => {
    setBookmarks(newBookmarks);
    localStorage.setItem("hadithBookmarks", JSON.stringify(newBookmarks));

    toast.open({
      content: message,
      variant: "success",
    });
  };

  const toggleBookmark = (
    id: number,
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.stopPropagation();

    const isBookmarked = bookmarks.some((bookmark) => bookmark.id === id);

    if (isBookmarked) {
      const newBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
      updateBookmarks(newBookmarks, "Hadith removed from bookmarks");
      return;
    }

    const hadithToBookmark = hadiths.find((hadith) => hadith.id === id);
    if (!hadithToBookmark) return;

    const newBookmark = {
      id: hadithToBookmark.id,
      hadithId: hadithToBookmark.id,
      dateAdded: new Date().toISOString(),
    };

    updateBookmarks([...bookmarks, newBookmark], "Hadith bookmarked!");
  };

  // Initialize with URL hadith ID if present
  useEffect(() => {
    if (initialHadithId && hadiths.length > 0) {
      const id = parseInt(initialHadithId, 10);
      const hadith = hadiths.find((h) => h.id === id);

      if (hadith) {
        setSelectedHadith(hadith);
        setViewingHadithId(hadith.id);
      }
    }
  }, [initialHadithId, hadiths]);

  // Hadith navigation handlers
  const openHadithDetails = (hadith: Hadith) => {
    setSelectedHadith(hadith);
    setViewingHadithId(hadith.id);

    // Update URL
    if (!initialHadithId || parseInt(initialHadithId, 10) !== hadith.id) {
      window.history.pushState(
        { hadithId: hadith.number },
        "",
        `/hadith/${hadith.number}`
      );
    }
  };

  const closeHadithDetails = () => {
    setSelectedHadith(null);
    setViewingHadithId(null);

    // Update URL
    if (!initialHadithId) {
      window.history.pushState({ hadithId: null }, "", "/hadith");
    } else {
      window.history.back();
    }
  };

  // Handle browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const matches = window.location.pathname.match(/\/hadith\/(\d+)/);

      if (matches && matches[1]) {
        const id = parseInt(matches[1], 10);
        if (id !== viewingHadithId) {
          const hadith = hadiths.find((h) => h.id === id);
          if (hadith) {
            setSelectedHadith(hadith);
            setViewingHadithId(id);
          }
        }
      } else {
        setSelectedHadith(null);
        setViewingHadithId(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [hadiths, viewingHadithId]);

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
          <FilterHadithSidebar
            isSidebarOpen={isSidebarOpen}
            searchTerm={searchTerm}
            handleSearchChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />

          <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <p>Loading...</p>
              </div>
            ) : filteredHadiths.length > 0 ? (
              <div className="space-y-3 sm:space-y-6">
                {filteredHadiths.map((hadith) => (
                  <HadithCard
                    key={hadith.id}
                    hadith={hadith}
                    viewHadithDetails={openHadithDetails}
                    displayLanguage={displayLanguage}
                    bookmarks={bookmarks}
                    toggleBookmark={toggleBookmark}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                  No hadith found matching your search criteria.
                </p>
                <button
                  className="text-xs sm:text-sm text-gray-500 border p-1.5 sm:p-2 rounded-sm relative overflow-hidden group hover:cursor-pointer"
                  onClick={resetFilters}
                >
                  <span className="relative z-10 transition-colors duration-150 group-hover:text-white">
                    Clear filters
                  </span>
                  <span className="absolute inset-0 bg-black/80 transform scale-x-0 origin-left transition-transform duration-150 ease-in-out group-hover:scale-x-100"></span>
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Hadith detail modal */}
        {selectedHadith && (
          <HadithDetailsModal
            selectedHadith={selectedHadith}
            closeHadithDetails={closeHadithDetails}
            toggleBookmark={toggleBookmark}
            bookmarks={bookmarks}
            displayLanguage={displayLanguage}
            isCopied={copied}
            copyHadithText={(text) => {
              copyHadithText(setCopied, { text, displayLanguage });
              toast.open({
                content: "Hadith copied successfully!",
                variant: "success",
              });
            }}
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
