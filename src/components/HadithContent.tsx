import React from "react";
import HadithCard from "@src/components/HadithCard";
import LoadingIcon from "@src/components/icons/LoadingIcon";
import { useHadithStore } from "@src/store";
import { EmptyState } from "./state/EmptyState";
import { ErrorState } from "./state/ErrorState";
import { Hadith } from "@src/utils/queries/useGetAllHadith";

interface HadithContentProps {
  isLoading: boolean;
  isRefetching?: boolean;
  hasData: boolean;
  isFetchingNextPage: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  onRefetch: () => void;
  onResetFilters: () => void;
  onViewDetails: (hadith: Hadith) => void;
  onToggleBookmark: (
    id: number,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

export const HadithContent: React.FC<HadithContentProps> = ({
  isLoading,
  isRefetching,
  hasData,
  isFetchingNextPage,
  loadMoreRef,
  onRefetch,
  onResetFilters,
  onViewDetails,
  onToggleBookmark,
}) => {
  const { filteredHadiths, displayLanguage, bookmarks } = useHadithStore();

  // Initial loading state (no data yet)
  if (isLoading && !hasData) {
    return (
      <section className="flex w-full items-center justify-center gap-2 py-8">
        <LoadingIcon className="mx-2 my-8 text-violet-500" />
        <span>Loading...</span>
      </section>
    );
  }

  // Error state (only show if not loading and no data)
  if (!isLoading && !isRefetching && !hasData) {
    return <ErrorState onRefetch={onRefetch} />;
  }

  return (
    <div className="flex-1 p-3 sm:p-6 overflow-y-auto items-center justify-center relative">
      {isRefetching && (
        <div className="fixed top-20 right-4 sm:right-6 z-20 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-white border border-gray-200 rounded-full shadow-lg p-2 flex items-center gap-2">
            <LoadingIcon className="text-violet-500 w-4 h-4" />
            <span className="text-xs text-gray-600 pr-1 hidden sm:inline">
              Refreshing
            </span>
          </div>
        </div>
      )}

      {/* Hadith list */}
      {filteredHadiths.length > 0 && (
        <div className="space-y-3 sm:space-y-6">
          {filteredHadiths.map((hadith) => (
            <HadithCard
              key={hadith?.id}
              hadith={hadith}
              viewHadithDetails={onViewDetails}
              displayLanguage={displayLanguage}
              bookmarks={bookmarks}
              toggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredHadiths.length === 0 && !isRefetching && (
        <EmptyState onResetFilters={onResetFilters} />
      )}

      {/* Infinite scroll loader */}
      <div className="flex items-center justify-center" ref={loadMoreRef}>
        {isFetchingNextPage && (
          <div className="mt-4 flex items-center gap-2">
            <LoadingIcon className="text-violet-500" />
            <span className="text-xs sm:text-sm text-gray-500">
              Loading more...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
