import { create } from "zustand";

// Type definitions
export type DisplayLanguage = "arabic" | "english" | "both";
export type HadithGrade = "sahih" | "hasan" | "hasan_sahih" | "daif";

export interface Hadith {
  id: number;
  collection: string;
  book: string;
  number: string;
  narrator: string;
  text: string;
  arabicText: string;
  grade: HadithGrade;
  chapter: string;
  topics: string[];
  reference: string;
}

export interface Bookmark {
  id: number;
  hadithId: string;
  dateAdded: Date;
  notes?: string;
}

interface HadithState {
  // Data
  hadiths: Hadith[];
  filteredHadiths: Hadith[];
  collections: string[];
  books: string[];
  bookOptions: string[];
  narrators: string[];
  bookmarks: (Bookmark | { id: number; hadithId: number; dateAdded: string })[];

  // UI state
  isLoading: boolean;
  selectedHadith: Hadith | null;
  showBookmarks: boolean;
  displayLanguage: DisplayLanguage;

  // Search and filters
  searchTerm: string;
  selectedCollection: string;
  selectedBook: string;
  selectedNarrator: string;
  selectedGrade: string;
  advancedFiltersOpen: boolean;
  isSidebarOpen: boolean;

  // Actions
  setHadiths: (hadiths: Hadith[]) => void;
  setFilteredHadiths: (filteredHadiths: Hadith[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSelectedHadith: (hadith: Hadith | null) => void;
  setCollections: (collections: string[]) => void;
  setBooks: (books: string[]) => void;
  setBookOptions: (bookOptions: string[]) => void;
  setNarrators: (narrators: string[]) => void;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: number) => void;
  setBookmarks: (
    bookmarks: (
      | Bookmark
      | { id: number; hadithId: number; dateAdded: string }
    )[]
  ) => void;
  setShowBookmarks: (show: boolean) => void;
  setDisplayLanguage: (language: DisplayLanguage) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCollection: (collection: string) => void;
  setSelectedBook: (book: string) => void;
  setSelectedNarrator: (narrator: string) => void;
  setSelectedGrade: (grade: string) => void;
  toggleAdvancedFilters: () => void;
  toggleSidebar: () => void;

  // Additional actions for convenience
  resetFilters: () => void;
  updateFilteredHadiths: () => void;
}

export const useHadithStore = create<HadithState>((set, get) => ({
  // Initial state
  hadiths: [],
  filteredHadiths: [],
  isLoading: true,
  selectedHadith: null,
  collections: [],
  books: [],
  bookOptions: [],
  narrators: [],
  bookmarks: [],
  showBookmarks: false,
  displayLanguage: "both",

  // Search and filters initial state
  searchTerm: "",
  selectedCollection: "all",
  selectedBook: "all",
  selectedNarrator: "all",
  selectedGrade: "all",
  advancedFiltersOpen: false,
  isSidebarOpen: true,

  // State setters
  setHadiths: (hadiths) => set({ hadiths }),
  setFilteredHadiths: (filteredHadiths) => set({ filteredHadiths }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSelectedHadith: (selectedHadith) => set({ selectedHadith }),
  setCollections: (collections) => set({ collections }),
  setBooks: (books) => set({ books }),
  setBookOptions: (bookOptions) => set({ bookOptions }),
  setNarrators: (narrators) => set({ narrators }),
  addBookmark: (bookmark) =>
    set((state) => ({
      bookmarks: [...state.bookmarks, bookmark],
    })),
  removeBookmark: (id) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter((b) => b.id !== id),
    })),
  setBookmarks: (bookmarks) => set({ bookmarks }),
  setShowBookmarks: (showBookmarks) => set({ showBookmarks }),
  setDisplayLanguage: (displayLanguage) => set({ displayLanguage }),

  // Search and filter setters
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSelectedCollection: (selectedCollection) =>
    set({
      selectedCollection,
      // Reset book when collection changes
      selectedBook: "all",
    }),
  setSelectedBook: (selectedBook) => set({ selectedBook }),
  setSelectedNarrator: (selectedNarrator) => set({ selectedNarrator }),
  setSelectedGrade: (selectedGrade) => set({ selectedGrade }),
  toggleAdvancedFilters: () =>
    set((state) => ({
      advancedFiltersOpen: !state.advancedFiltersOpen,
    })),
  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),

  // Additional actions
  resetFilters: () =>
    set({
      searchTerm: "",
      selectedCollection: "all",
      selectedBook: "all",
      selectedNarrator: "all",
      selectedGrade: "all",
      showBookmarks: false,
    }),

  // Logic to filter hadiths based on current filters
  updateFilteredHadiths: () => {
    const {
      hadiths,
      searchTerm,
      selectedCollection,
      selectedBook,
      selectedNarrator,
      selectedGrade,
    } = get();

    let filtered = [...hadiths];

    // Apply collection filter
    if (selectedCollection !== "all") {
      filtered = filtered.filter((h) => h.collection === selectedCollection);
    }

    // Apply book filter
    if (selectedBook !== "all") {
      filtered = filtered.filter((h) => h.book === selectedBook);
    }

    // Apply narrator filter
    if (selectedNarrator !== "all") {
      filtered = filtered.filter((h) => h.narrator === selectedNarrator);
    }

    // Apply grade filter
    if (selectedGrade !== "all") {
      filtered = filtered.filter((h) => h.grade === selectedGrade);
    }

    // Apply search term filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.text.toLowerCase().includes(term) ||
          h.text.toLowerCase().includes(term)
      );
    }

    set({ filteredHadiths: filtered });
  },
}));
