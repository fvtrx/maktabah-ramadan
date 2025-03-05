import type { ToastProps } from "@src/components/Toast";
import type { PropsWithChildren } from "react";

import Toast from "@src/components/Toast";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type ToastWithoutId = Omit<ToastProps, "close">;
type ToastConfig = { id: number } & ToastWithoutId;

export const ToastContext = createContext<{
  open: (config: ToastWithoutId) => void;
}>({
  open: () => {},
});

export const ToastProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [toasts, setToasts] = useState<ToastConfig[]>([]);
  const idCounterRef = useRef(0);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  const open = useCallback((config: ToastWithoutId) => {
    const { content, ctaLink, ctaText, ctaTextColor, variant } = config;

    setToasts((currentToasts) => [
      ...currentToasts,
      {
        content,
        ctaLink,
        ctaText,
        ctaTextColor,
        id: idCounterRef.current++,
        variant,
      },
    ]);
  }, []);

  const close = useCallback((id: number) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  const contextValue = useMemo(() => ({ open }), [open]);

  const toastElement =
    typeof window !== "undefined" && document.querySelector("#toast");

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {mounted && toastElement
        ? createPortal(
            <div className="fixed bottom-7 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center">
              {toasts.map((toast) => (
                <Toast
                  key={toast.id}
                  close={() => close(toast.id)}
                  content={toast.content}
                  ctaLink={toast.ctaLink}
                  ctaText={toast.ctaText}
                  ctaTextColor={toast.ctaTextColor}
                  variant={toast.variant}
                />
              ))}
            </div>,
            toastElement
          )
        : null}
    </ToastContext.Provider>
  );
};
