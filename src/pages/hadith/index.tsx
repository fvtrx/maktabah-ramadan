import Layout from "@src/components/common/Layout";
import FilterHadithSidebar from "@src/components/FilterHadithSidebar";
import Footer from "@src/components/Footer";
import HadithDetailsModal from "@src/components/HadithDetailsModal";
import LanguageSelector from "@src/components/LanguageSelector";
import { useHadithStore } from "@src/store";
import { copyHadithText } from "@src/utils/helpers/string";
import useBookmarkManager from "@src/utils/hooks/useBookmarkManager";
import useHadithNavigation from "@src/utils/hooks/useHadithNavigation";
import useInfiniteScroll from "@src/utils/hooks/useInfiniteScroll";
import useToast from "@src/utils/hooks/useToast";
import useGetAllHadith, {
  COUNT_PER_PAGE,
  Hadith,
} from "@src/utils/queries/useGetAllHadith";
import React, { useCallback, useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import { useHadithData } from "@src/utils/hooks/useHadithData";
import { useHadithFilters } from "@src/utils/hooks/useHadithFilters";
import { useFilterSidebar } from "@src/utils/hooks/useFilterSidebar";
import { HadithContent } from "@src/components/HadithContent";

interface HadithListPageProps {
  initialHadithId?: string;
}

const HadithListPage: React.FC<HadithListPageProps> = ({ initialHadithId }) => {
  const store = useHadithStore();
  const {
    hadiths,
    selectedHadith,
    displayLanguage,
    bookmarks,
    isSidebarOpen,
    setDisplayLanguage,
    resetFilters,
    toggleSidebar,
  } = store;

  const toast = useToast();
  const [copied, setCopied] = React.useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 760px)" });
  const { loadSavedBookmarks, toggleBookmark } = useBookmarkManager();
  const { openHadithDetails, closeHadithDetails } = useHadithNavigation(
    hadiths,
    initialHadithId,
  );

  // MARK: query
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
    hasNextPage,
  } = useGetAllHadith({
    paginate: true,
    pagination_number: COUNT_PER_PAGE,
  });

  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const hadithList = useMemo<Hadith[]>(() => {
    if (!data?.pages) return [];

    const uniqueHadithsMap = new Map<number, Hadith>();

    data.pages.forEach((page) => {
      page.data.data.forEach((hadith) => {
        if (hadith.id && !uniqueHadithsMap.has(hadith.id)) {
          uniqueHadithsMap.set(hadith.id, hadith);
        }
      });
    });

    return Array.from(uniqueHadithsMap.values());
  }, [data?.pages]);

  // MARK: Custom hooks for data management
  useFilterSidebar(isMobile, isSidebarOpen, toggleSidebar);
  useHadithData(hadithList, store, loadSavedBookmarks);
  useHadithFilters(store);

  // MARK: Event handlers
  const handleCopyHadithText = useCallback(
    (text: string) => {
      copyHadithText(setCopied, { text, displayLanguage });
      toast.open({
        content: "Hadith copied successfully!",
        variant: "success",
      });
    },
    [displayLanguage, toast],
  );

  const handleToggleBookmark = useCallback(
    (id: number, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      toggleBookmark(id, hadiths, event);
    },
    [toggleBookmark, hadiths],
  );

  const handleResetFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

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
                {!isMobile && (
                  <span className="text-lg sm:text-2xl mr-1 sm:mr-2">☪</span>
                )}
                <span className="inline">Maktabah</span> Ramadan
              </h1>
            </div>

            <LanguageSelector
              selectedLanguage={displayLanguage}
              onLanguageChange={setDisplayLanguage}
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 overflow-hidden">
          <FilterHadithSidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />

          <HadithContent
            isLoading={isLoading}
            isRefetching={isRefetching}
            hasData={!!data}
            isFetchingNextPage={isFetchingNextPage}
            loadMoreRef={loadMoreRef}
            onRefetch={refetch}
            onResetFilters={handleResetFilters}
            onViewDetails={openHadithDetails}
            onToggleBookmark={handleToggleBookmark}
          />
        </main>

        {/* Hadith Details Modal */}
        {selectedHadith && (
          <HadithDetailsModal
            selectedHadith={selectedHadith}
            closeHadithDetails={closeHadithDetails}
            toggleBookmark={handleToggleBookmark}
            bookmarks={bookmarks}
            displayLanguage={displayLanguage}
            isCopied={copied}
            copyHadithText={handleCopyHadithText}
          />
        )}

        <Footer />
      </div>
    </Layout>
  );
};

export default HadithListPage;
