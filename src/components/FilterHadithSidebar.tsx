import { useHadithStore } from "@src/store";
import Dropdown from "./Dropdown";
import Search from "./Search";

type Props = {
  isSidebarOpen: boolean;
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FilterHadithSidebar = ({
  isSidebarOpen,
  searchTerm,
  handleSearchChange,
}: Props) => {
  const {
    showBookmarks,
    setShowBookmarks,
    selectedCollection,
    setSelectedCollection,
    collections,
    advancedFiltersOpen,
    toggleAdvancedFilters,
    selectedBook,
    setSelectedBook,
    bookOptions,
    selectedNarrator,
    setSelectedNarrator,
    narrators,
    resetFilters,
    filteredHadiths,
  } = useHadithStore();

  if (!isSidebarOpen) return null;

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""} shadow-md`}>
      <Search searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

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

      {/* Advanced filters toggle */}
      <button
        className="flex items-center justify-between w-full mb-6 text-sm text-gray-500"
        onClick={toggleAdvancedFilters}
      >
        <span>Advanced Filters</span>
        <span>{advancedFiltersOpen ? "−" : "+"}</span>
      </button>

      {/* Advanced filters */}
      <div
        className={`space-y-4 mb-6 transition-all duration-300 ease-in-out ${
          advancedFiltersOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        {/* Book filter */}
        <Dropdown
          type="books"
          selectedOptions={bookOptions}
          selectedItem={selectedBook}
          setSelectedItem={setSelectedBook}
        />

        {/* Narrator filter */}
        <Dropdown
          type="narrators"
          selectedOptions={narrators}
          selectedItem={selectedNarrator}
          setSelectedItem={setSelectedNarrator}
        />
      </div>

      {/* Reset filters button */}
      <button
        className="w-full py-3 text-sm text-gray-500 hover:text-gray-700"
        onClick={resetFilters}
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
