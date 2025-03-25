import { useCallback } from "react";

// eslint-disable-next-line no-undef
function useInfiniteScroll(
  callbackParam = () => {},
  options?: IntersectionObserverInit,
) {
  const callback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        callbackParam();
      }
    },
    [callbackParam],
  );

  const infiniteScrollRef = useCallback((node: HTMLElement | null) => {
    if (!node) {
      return;
    }

    const intersectionObserver = new IntersectionObserver(
      callback,
      options ?? {},
    );
    intersectionObserver.observe(node);
  }, []);

  return infiniteScrollRef;
}

export default useInfiniteScroll;
