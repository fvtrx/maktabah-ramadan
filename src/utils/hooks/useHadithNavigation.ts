import { useHadithStore } from "@src/store";
import { useEffect, useState } from "react";
import { Hadith } from "../queries/useGetAllHadith";

// Custom hook for URL and modal state management
const useHadithNavigation = (hadiths: Hadith[], initialHadithId?: string) => {
  const { setSelectedHadith } = useHadithStore();
  const [viewingHadithId, setViewingHadithId] = useState<number | null>(null);

  // Initialize with initial hadith ID if provided
  useEffect(() => {
    if (initialHadithId && hadiths.length > 0) {
      const id = parseInt(initialHadithId, 10);
      const hadith = hadiths.find((h) => h.id === id);

      if (hadith) {
        setSelectedHadith(hadith);
        setViewingHadithId(hadith.id);
      }
    }
  }, [initialHadithId, hadiths, setSelectedHadith]);

  // Handle browser navigation events
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
  }, [hadiths, viewingHadithId, setSelectedHadith]);

  // Functions to open and close hadith details
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

  return {
    viewingHadithId,
    openHadithDetails,
    closeHadithDetails,
  };
};

export default useHadithNavigation;
