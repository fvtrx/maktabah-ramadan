type TickIconProps = {
  className?: string;
};

const TickIcon = ({ className }: TickIconProps) => (
  <svg
    className={`h-3 w-3 fill-current ${className}`}
    fill="none"
    viewBox="0 0 10 8"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.473.807a.667.667 0 0 0-.947 0L3.56 5.78 1.473 3.687a.681.681 0 1 0-.947.98l2.56 2.56a.666.666 0 0 0 .947 0l5.44-5.44a.667.667 0 0 0 0-.98Z"
      fill="currentColor"
    />
  </svg>
);

export default TickIcon;
