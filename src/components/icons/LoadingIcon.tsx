import { cn } from "@src/utils";

type LoadingIconProps = {
  className?: string;
};

const LoadingIcon = ({ className }: LoadingIconProps) => (
  <svg
    className={cn(`h-8 w-8 animate-spin ${className}`)}
    viewBox="0 0 44 44"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M42 22c0 11.046-8.954 20-20 20S2 33.046 2 22 10.954 2 22 2"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="4"
    />
  </svg>
);

export default LoadingIcon;
