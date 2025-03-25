import "@src/styles/globals.css";
import { ToastProvider } from "@src/utils/contexts/toastContext";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (_failureCount: number, error: any) =>
        [400, 401, 403].includes(error?.response?.status),
      staleTime: 1000 * 60 * 5, // 5 minute
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools position="bottom-right" />
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </QueryClientProvider>
  );
}
