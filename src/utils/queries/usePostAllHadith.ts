import useToast from "@src/utils/hooks/useToast";
import { maktabahRamadanBaseUrl } from "@src/utils/queries";
import { AxiosError, AxiosResponse } from "axios";
import { useInfiniteQuery, UseInfiniteQueryOptions } from "react-query";

export const ALL_HADITH_PATH = "/all-hadith";

export const COUNT_PER_PAGE = 25;

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

interface HadithResponse {
  data: Hadith[];
}

const usePostAllHadith = (
  params: Params,
  options?: UseInfiniteQueryOptions<AxiosResponse<HadithResponse>, AxiosError>
) => {
  const toast = useToast();
  const { pagination_number, ...restParams } = params;

  return useInfiniteQuery<AxiosResponse<HadithResponse>, AxiosError>(
    [ALL_HADITH_PATH, params],
    (_params) => {
      return maktabahRamadanBaseUrl.post(
        ALL_HADITH_PATH,
        {
          pagination_number: pagination_number ?? COUNT_PER_PAGE,
          ...restParams,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            ["X-Access-Token"]: process.env.NEXT_PUBLIC_API_KEY,
          },
        }
      );
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.data?.data?.length) {
          return allPages.length + 1;
        }
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

export default usePostAllHadith;
