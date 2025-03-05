import { HadithGrade } from "@src/store";

export const HADITH_GRADES: { [K in HadithGrade]: true } = {
  sahih: true,
  hasan: true,
  hasan_sahih: true,
  daif: true,
};
