import { useHadithStore } from "@src/store";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import Search from "./Search";

type Props = {
  isSidebarOpen: boolean;
};

const FilterHadithSidebar = ({ isSidebarOpen }: Props) => {
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
    [setSearchTerm],
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

  if (!isSidebarOpen) return null;

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""} shadow-md`}>
      <Search searchTerm={localSearchTerm} handleSearchChange={handleQuery} />

      {/* Bookmarks filter */}
      <div className="mb-6">
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
      <Dropdown
        type="collections"
        selectedOptions={collections}
        selectedItem={selectedCollection}
        setSelectedItem={setSelectedCollection}
      />

      <Dropdown
        type="books"
        selectedOptions={bookOptions}
        selectedItem={selectedBook}
        setSelectedItem={setSelectedBook}
      />

      {/* Reset filters button */}
      <button
        className="w-full py-3 text-sm text-gray-500 hover:text-gray-700"
        onClick={() => {
          resetFilters();
          setLocalSearchTerm("");
        }}
      >
        Reset filters
      </button>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-sm text-gray-400">
          {filteredHadiths.length} hadith
          {filteredHadiths.length !== 1 ? "s" : ""} found
        </p>
      </div>
    </div>
  );
};

export default FilterHadithSidebar;
