import "@src/styles/globals.css";
import { ToastProvider } from "@src/utils/contexts/toastContext";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

interface ErrorWithResponse {
  response?: {
    status?: number;
  };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (_failureCount: number, error: unknown) => {
        // Type guard to safely check if error has the expected structure
        const hasResponseStatus = (err: unknown): err is ErrorWithResponse => {
          return Boolean(
            err &&
              typeof err === "object" &&
              "response" in err &&
              err.response &&
              typeof err.response === "object" &&
              "status" in err.response
          );
        };

        // Check if error has a response status that matches our list
        if (hasResponseStatus(error)) {
          return ![400, 401, 403].includes(error.response?.status ?? 0);
        }

        // Default to retry for other error types
        return true;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
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
