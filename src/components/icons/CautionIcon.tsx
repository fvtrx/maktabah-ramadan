import type { ComponentProps } from "react";

const CautionIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      fill="currentColor"
      height={18}
      viewBox="0 0 18 18"
      width={18}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M9 4.833a.833.833 0 0 0-.833.834V9a.833.833 0 0 0 1.666 0V5.667A.833.833 0 0 0 9 4.833Zm.767 7.184a.632.632 0 0 0-.075-.15l-.1-.125a.833.833 0 0 0-.909-.175.956.956 0 0 0-.275.175.833.833 0 0 0-.175.908.75.75 0 0 0 .45.45.783.783 0 0 0 .634 0 .75.75 0 0 0 .45-.45.834.834 0 0 0 .066-.317 1.133 1.133 0 0 0 0-.166.532.532 0 0 0-.066-.15ZM9 .667a8.333 8.333 0 1 0 0 16.666A8.333 8.333 0 0 0 9 .667Zm0 15A6.666 6.666 0 1 1 9 2.334a6.666 6.666 0 0 1 0 13.333Z" />
    </svg>
  );
};

export default CautionIcon;
