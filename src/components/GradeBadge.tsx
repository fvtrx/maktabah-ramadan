import { HadithGrade } from "@src/store";
import startCase from "lodash/startCase";
import { FC } from "react";

type Props = {
  grade: HadithGrade;
};

const VARIANT_COLORS: Record<HadithGrade, string> = {
  sahih: "bg-green-400 text-white",
  hasan: "bg-orange-400 text-white",
  hasan_sahih: "bg-yellow-500 text-white",
  daif: "bg-red-400 text-white",
};

export type ChipVariant = keyof typeof VARIANT_COLORS | string;

const getVariantColor = (variant: ChipVariant): string => {
  return VARIANT_COLORS[variant as keyof typeof VARIANT_COLORS];
};

const GradeBadge: FC<Props> = ({ grade }) => {
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${getVariantColor(grade)}`}
    >
      {startCase(grade)}
    </span>
  );
};

export default GradeBadge;
