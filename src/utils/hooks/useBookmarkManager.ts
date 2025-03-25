import { Bookmark, useHadithStore } from "@src/store";
import { Hadith } from "../queries/useGetAllHadith";
import useToast from "./useToast";

// Custom hook for bookmark management
export const STORAGE_KEY_BOOKMARKS = "hadithBookmarks";

const useBookmarkManager = () => {
  const { bookmarks, setBookmarks } = useHadithStore();
  const toast = useToast();

  const loadSavedBookmarks = () => {
    try {
      const savedBookmarks = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
      toast.open({
        content: "Failed to load your bookmarks",
        variant: "error",
      });
    }
  };

  const updateBookmarks = (
    newBookmarks: (
      | Bookmark
      | { id: number; hadithId: number; dateAdded: string }
    )[],
    message: string
  ): void => {
    try {
      setBookmarks(newBookmarks);
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(newBookmarks));

      toast.open({
        content: message,
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to update bookmarks:", error);
      toast.open({
        content: "Failed to update bookmarks",
        variant: "error",
      });
    }
  };

  const toggleBookmark = (
    id: number,
    hadiths: Hadith[],
    event?: React.MouseEvent<HTMLButtonElement>
  ): void => {
    if (event) {
      event.stopPropagation();
    }

    const isBookmarked = bookmarks.some((bookmark) => bookmark.id === id);

    if (isBookmarked) {
      const newBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
      updateBookmarks(newBookmarks, "Hadith removed from bookmarks");
      return;
    }

    const hadithToBookmark = hadiths.find((hadith) => hadith.id === id);
    if (!hadithToBookmark) return;

    const newBookmark: Bookmark = {
      id: hadithToBookmark.id,
      hadithId: hadithToBookmark.id.toString(),
      dateAdded: new Date().toISOString(),
    };

    updateBookmarks([...bookmarks, newBookmark], "Hadith bookmarked!");
  };

  return {
    loadSavedBookmarks,
    toggleBookmark,
  };
};

export default useBookmarkManager;
