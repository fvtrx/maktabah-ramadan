import useToast from "@src/utils/hooks/useToast";
import { maktabahRamadanBaseUrl } from "@src/utils/queries";
import { AxiosError, AxiosResponse } from "axios";
import { useInfiniteQuery, UseInfiniteQueryOptions } from "react-query";

export const ALL_HADITH_PATH = "/all-hadith";
export const COUNT_PER_PAGE = 10;

type Params = {
  paginate?: boolean;
  pagination_number: number;
  next?: number;
  previous?: number;
};

export interface Hadith {
  id: number;
  title: string;
  arabic_text: string;
  meaning: string;
  source: string;
  collection: string;
  book: string;
  number: string;
  lesson: string[];
}

type HadithResponse = {
  data: Hadith[];
};

const useGetAllHadith = (
  params: Params,
  options?: UseInfiniteQueryOptions<AxiosResponse<HadithResponse>, AxiosError>,
) => {
  const toast = useToast();
  const { pagination_number, ...restParams } = params;

  return useInfiniteQuery<AxiosResponse<HadithResponse>, AxiosError>(
    [ALL_HADITH_PATH, params],
    ({ pageParam = 1 }) => {
      const nextValue =
        pageParam > 1 ? (pageParam - 1) * pagination_number : undefined;

      const requestParams: Params = {
        pagination_number,
        ...restParams,
      };

      if (nextValue !== undefined) {
        requestParams.next = nextValue;
      }

      return maktabahRamadanBaseUrl.post(ALL_HADITH_PATH, requestParams);
    },
    {
      // ✅ retry only on 429, up to 3 times
      retry: (failureCount, error) => {
        if (error.response?.status === 429 && failureCount < 3) return true;
        return false;
      },

      // ✅ exponential backoff — respects Retry-After header if present
      retryDelay: (attempt, error) => {
        const retryAfter = error?.response?.headers?.["retry-after"];
        if (retryAfter) return parseInt(retryAfter) * 1000;
        return Math.min(1000 * 2 ** attempt, 30000); // 2s → 4s → 8s (max 30s)
      },

      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.data?.data.length === pagination_number) {
          return allPages.length + 1;
        }
        return undefined;
      },

      onError: (error) => {
        if (error.response?.status === 429) {
          toast.open({
            content: "Too many requests. Please wait a moment...",
            variant: "error",
          });
          return;
        }

        if (
          error.response?.status &&
          ![400, 403].includes(error.response.status)
        ) {
          toast.open({
            content: "There was an error, please try again later",
            variant: "error",
          });
        }
      },

      ...options,
    },
  );
};

export default useGetAllHadith;
