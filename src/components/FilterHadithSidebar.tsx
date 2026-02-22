import { useHadithStore } from "@src/store";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import Dropdown from "./Dropdown";
import Search from "./Search";

type Props = {
  isSidebarOpen: boolean;
  toggleSidebar?: () => void;
};

const CLOSE_DRAG_THRESHOLD = 150;
const DRAG_RESISTANCE = 0.7;
const ANIMATION_MS = 320;

const FilterHadithSidebar = ({ isSidebarOpen, toggleSidebar }: Props) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const lastScrollTop = useRef(0);

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMounted, setIsMounted] = useState(isSidebarOpen);
  const [isVisible, setIsVisible] = useState(isSidebarOpen);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Double-RAF guarantees the "hidden" frame is painted before transitioning in,
  // preventing the jitter of a skipped initial frame.
  useEffect(() => {
    if (isSidebarOpen) {
      setIsMounted(true);
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setIsVisible(true)),
      );
      return () => cancelAnimationFrame(raf);
    } else {
      setIsVisible(false);
      const t = setTimeout(() => setIsMounted(false), ANIMATION_MS);
      return () => clearTimeout(t);
    }
  }, [isSidebarOpen]);

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

  useEffect(() => setLocalSearchTerm(searchTerm), [searchTerm]);

  const debouncedSetQuery = useRef(
    debounce((query: string) => setSearchTerm(query), 500),
  ).current;

  useEffect(() => () => debouncedSetQuery.cancel(), [debouncedSetQuery]);

  const handleQuery: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const query = e.currentTarget.value;
    setLocalSearchTerm(query);
    debouncedSetQuery(query);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const isDragHandle =
      target.classList.contains("drag-handle") ||
      target.parentElement?.classList.contains("drag-handle");

    if (sidebarRef.current?.scrollTop === 0 || isDragHandle) {
      touchStartY.current = e.touches[0].clientY;
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null || !isDragging) return;
    const diff = e.touches[0].clientY - touchStartY.current;
    if (diff > 0) {
      setDragOffset(diff * DRAG_RESISTANCE);
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    if (dragOffset > CLOSE_DRAG_THRESHOLD) toggleSidebar?.();
    setIsDragging(false);
    setDragOffset(0);
    touchStartY.current = null;
  };

  const handleScroll = useCallback(() => {
    if (!sidebarRef.current) return;
    const { scrollTop } = sidebarRef.current;
    if (scrollTop < 10 && scrollTop > lastScrollTop.current && isSidebarOpen) {
      toggleSidebar?.();
    }
    lastScrollTop.current = scrollTop;
  }, [isSidebarOpen, toggleSidebar]);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    sidebar.addEventListener("scroll", handleScroll);
    return () => sidebar.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (!isMounted) return null;

  const hiddenTransform = isDesktop ? "translateX(-100%)" : "translateY(100%)";
  const visibleTransform = isDesktop
    ? `translateX(${-dragOffset}px)`
    : `translateY(${dragOffset}px)`;

  return (
    <div
      ref={sidebarRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        transform: isVisible ? visibleTransform : hiddenTransform,
        opacity: isVisible ? 1 : 0,
        transition: isDragging
          ? "none"
          : `transform ${ANIMATION_MS}ms ${isSidebarOpen ? "cubic-bezier(0.22, 1, 0.36, 1)" : "cubic-bezier(0.4, 0, 1, 1)"}, opacity ${ANIMATION_MS}ms ease`,
      }}
      className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-white rounded-t-2xl shadow-lg
        max-h-[80vh] overflow-y-auto p-4
        md:relative md:right-auto md:w-80 md:h-full md:max-h-full
        md:rounded-none md:shadow-md md:border-r md:border-gray-100 md:p-0
      `}
    >
      <div className="drag-handle w-16 h-1 bg-gray-300 rounded-full mx-auto mb-4 md:hidden" />

      <div className="md:p-4">
        <Search searchTerm={localSearchTerm} handleSearchChange={handleQuery} />
      </div>

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
