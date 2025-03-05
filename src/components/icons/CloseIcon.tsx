import type { ComponentProps } from "react";

type CloseIconProps = ComponentProps<"svg">;

const CloseIcon = (props: CloseIconProps) => {
  return (
    <svg
      height={16}
      width={16}
      {...props}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m8.94 8 4.2-4.193a.67.67 0 0 0-.946-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.666.666 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.194 4.2a.665.665 0 0 0 .946 0 .665.665 0 0 0 0-.947L8.94 8Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default CloseIcon;
