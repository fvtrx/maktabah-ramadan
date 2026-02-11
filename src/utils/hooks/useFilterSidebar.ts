import { useEffect } from "react";

/**
 * Hook to handle sidebar responsiveness on mobile devices
 */
export const useFilterSidebar = (
  isMobile: boolean,
  isSidebarOpen: boolean,
  toggleSidebar: () => void,
) => {
  useEffect(() => {
    // Close sidebar when transitioning to mobile view
    if (isMobile && isSidebarOpen) {
      toggleSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, toggleSidebar]);
};
