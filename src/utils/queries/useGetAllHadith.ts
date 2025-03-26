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
  options?: UseInfiniteQueryOptions<AxiosResponse<HadithResponse>, AxiosError>
) => {
  const toast = useToast();
  const { pagination_number, ...restParams } = params;

  return useInfiniteQuery<AxiosResponse<HadithResponse>, AxiosError>(
    [ALL_HADITH_PATH, params],
    ({ pageParam = 1 }) => {
      // Calculate the correct 'next' value based on the current page
      // For the first page, don't send a 'next' parameter
      // For subsequent pages, calculate the proper offset
      const nextValue =
        pageParam > 1 ? (pageParam - 1) * pagination_number : undefined;

      // Create a clean request object without undefined values
      const requestParams = {
        pagination_number,
        ...restParams,
      };

      // Only add next parameter if it's defined
      if (nextValue !== undefined) {
        requestParams.next = nextValue;
      }

      return maktabahRamadanBaseUrl.post(ALL_HADITH_PATH, requestParams);
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        // Check if we received the maximum number of items per page
        // If so, there might be more data to fetch
        if (lastPage?.data?.data.length === pagination_number) {
          return allPages.length + 1;
        }
        // If we got fewer items than the maximum, we've reached the end
        return undefined;
      },
      onError: (error) => {
        if (
          error.response?.status &&
          ![400, 403].includes(error.response?.status)
        ) {
          toast.open({
            content: "There was an error, please try again later",
            variant: "error",
          });
        }
      },
      ...options,
    }
  );
};

export default useGetAllHadith;
