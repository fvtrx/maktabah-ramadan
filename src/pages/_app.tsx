import "@src/styles/globals.css";
import { ToastProvider } from "@src/utils/contexts/toastContext";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <Component {...pageProps} />
    </ToastProvider>
  );
}
