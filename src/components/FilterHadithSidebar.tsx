import { useHadithStore } from "@src/store";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import Dropdown from "./Dropdown";
import Search from "./Search";

type Props = {
  isSidebarOpen: boolean;
  toggleSidebar?: () => void;
};

const FilterHadithSidebar = ({ isSidebarOpen, toggleSidebar }: Props) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const lastScrollTop = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const {
    showBookmarks,
    setShowBookmarks,
    selectedCollection,
    setSelectedCollection,
    collections,
    selectedBook,
    setSelectedBook,
    bookOptions,
    resetFilters,
    filteredHadiths,
    searchTerm,
    setSearchTerm,
  } = useHadithStore();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const debouncedSetQuery = useCallback(
    debounce((query: string) => {
      setSearchTerm(query);
    }, 500),
    [setSearchTerm]
  );

  const handleQuery: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    const query = event.currentTarget.value;

    setLocalSearchTerm(query);

    debouncedSetQuery(query);
  };

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  // Handle touch start event
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable dragging if we're near the top of the content or at the drag handle
    const isAtTop = sidebarRef.current?.scrollTop === 0;
    const target = e.target as HTMLElement;
    const isDragHandle =
      target.classList.contains("drag-handle") ||
      target.parentElement?.classList.contains("drag-handle");

    if (isAtTop || isDragHandle) {
      touchStartY.current = e.touches[0].clientY;
      setIsDragging(true);
    }
  };

  // Handle touch move event
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null || !isDragging) return;

    // Get current touch position
    const touchY = e.touches[0].clientY;
    const diff = touchY - touchStartY.current;

    // Only allow downward drag (positive diff)
    if (diff > 0) {
      // Apply drag with some resistance (multiply by less than 1 for resistance)
      setDragOffset(diff * 0.7);

      // Prevent scrolling while dragging
      e.preventDefault();
    }
  };

  // Handle touch end event
  const handleTouchEnd = () => {
    if (!isDragging) return;

    // If dragged more than 150px, close the sidebar
    if (dragOffset > 150 && toggleSidebar) {
      toggleSidebar();
    }

    // Reset drag state with animation
    setIsDragging(false);
    setDragOffset(0);
    touchStartY.current = null;
  };

  // Handle scroll event - Fixed to only close when scrolling DOWN the sidebar
  const handleScroll = useCallback(() => {
    if (!sidebarRef.current) return;

    const scrollTop = sidebarRef.current.scrollTop;
    const isScrollingDown = scrollTop > lastScrollTop.current;

    // If scrolling down (increasing scrollTop) AND we're near the top of the sidebar,
    // close the sidebar
    if (scrollTop < 10 && isScrollingDown && toggleSidebar && isSidebarOpen) {
      toggleSidebar();
    }

    lastScrollTop.current = scrollTop;
  }, [toggleSidebar, isSidebarOpen]);

  // Add and remove scroll event listener
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener("scroll", handleScroll);
      return () => {
        sidebar.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  if (!isSidebarOpen) return null;

  return (
    <div
      ref={sidebarRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        transform: `translateY(${dragOffset}px)`,
        transition: isDragging ? "none" : "transform 0.3s ease-out",
      }}
      className={`
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        
        /* Desktop styles - side positioning */
        md:w-80 md:h-full md:shadow-md md:border-r md:border-gray-100 md:bg-white
        
        /* Mobile styles - bottom positioning */
        fixed bottom-0 left-0 right-0 
        md:relative
        bg-white
        max-h-[80vh] md:max-h-full
        overflow-y-auto
        rounded-t-2xl md:rounded-none
        shadow-lg
        z-50
        p-4 md:p-0
      `}
    >
      {/* Mobile handle/pull tab */}
      <div className="drag-handle w-16 h-1 bg-gray-300 rounded-full mx-auto mb-4 md:hidden"></div>

      {/* Search - different positioning for mobile vs desktop */}
      <div className="md:p-4">
        <Search searchTerm={localSearchTerm} handleSearchChange={handleQuery} />
      </div>

      {/* Bookmarks filter */}
      <div className="mb-6 md:px-4">
        <button
          className={`w-full flex items-center justify-between p-3 text-left rounded-lg transition-colors ${
            showBookmarks
              ? "bg-gray-900 text-white"
              : "bg-gray-50 hover:bg-gray-100"
          }`}
          onClick={() => setShowBookmarks(!showBookmarks)}
        >
          <span>Bookmarked hadith</span>
          <span>{showBookmarks ? "★" : "☆"}</span>
        </button>
      </div>

      {/* Collections dropdown */}
      <div className="md:px-4">
        <Dropdown
          type="collections"
          selectedOptions={collections}
          selectedItem={selectedCollection}
          setSelectedItem={setSelectedCollection}
        />
      </div>

      <div className="md:px-4">
        <Dropdown
          type="books"
          selectedOptions={bookOptions}
          selectedItem={selectedBook}
          setSelectedItem={setSelectedBook}
        />
      </div>

      {/* Reset filters button */}
      <div className="md:px-4">
        <button
          className="w-full py-3 text-sm text-gray-500 hover:text-gray-700"
          onClick={() => {
            resetFilters();
            setLocalSearchTerm("");
          }}
        >
          Reset filters
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 md:px-4">
        <p className="text-sm text-gray-400">
          {filteredHadiths.length} hadith
          {filteredHadiths.length !== 1 ? "s" : ""} found
        </p>
      </div>
    </div>
  );
};

export default FilterHadithSidebar;
