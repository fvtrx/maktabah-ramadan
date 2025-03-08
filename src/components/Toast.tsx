import CautionIcon from "@src/components/icons/CautionIcon";
import CloseIcon from "@src/components/icons/CloseIcon";
import InfoIcon from "@src/components/icons/InfoIcon";
import TickIcon from "@src/components/icons/TickIcon";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const TOAST_TIMEOUT = 5000;
const TOAST_FADEOUT_DELAY = 500;
const TOAST_FADEIN_DURATION = 300;

const iconStyle =
  "relative rounded-full p-3 mr-4 after:absolute after:rounded-full";

type ToastVariant = "caution" | "error" | "general" | "success";
type TextVariant = "default" | "highlight";

const ICON: Record<ToastVariant, React.ReactNode> = {
  caution: (
    <span className={`${iconStyle} bg-yellow-100`}>
      <CautionIcon className="h-4 w-4 text-yellow-700" />
    </span>
  ),
  error: (
    <span className={`${iconStyle} bg-red-100`}>
      <InfoIcon className="h-4 w-4 text-red-600" />
    </span>
  ),
  general: (
    <span className={`${iconStyle} bg-blue-100`}>
      <InfoIcon className="h-4 w-4 text-blue-600" />
    </span>
  ),
  success: (
    <span
      className={`${iconStyle} bg-green-100 p-4 after:inset-2.5 after:border-2 after:border-green-700`}
    >
      <TickIcon className="h-4 w-4 text-green-700" />
    </span>
  ),
};

const TEXT_COLOR: Record<TextVariant, string> = {
  default: "font-bold",
  highlight: "font-bold text-blue-600",
};

export type ToastProps = {
  close: () => void;
  content: string;
  ctaLink?: string;
  ctaText?: string;
  ctaTextColor?: TextVariant;
  variant?: ToastVariant;
};

const Toast = ({
  close,
  content,
  ctaLink,
  ctaText,
  ctaTextColor = "default",
  variant = "general",
}: ToastProps) => {
  const [fadeOut, triggerFadeOut] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    triggerFadeOut(true);
  };

  useEffect(() => {
    if (!fadeOut) return;

    const timeout = setTimeout(() => {
      close();
    }, TOAST_FADEOUT_DELAY);

    return () => {
      clearTimeout(timeout);
    };
  }, [fadeOut, close]);

  // Let Toast close by itself
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleClose();
    }, TOAST_TIMEOUT);

    return () => {
      clearTimeout(timeout);
    };
  }, [close]);

  return (
    <div
      className={`my-4 flex w-full max-w-[640px] mx-auto items-center rounded-lg bg-white p-4 shadow-2xl ${
        fadeOut ? "opacity-0" : fadeIn ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`}
      style={{
        transitionDuration: fadeOut
          ? `${TOAST_FADEOUT_DELAY}ms`
          : `${TOAST_FADEIN_DURATION}ms`,
      }}
    >
      {ICON[variant]}
      <div className="flex-1 min-w-0">
        <span className="text-black/65 text-sm sm:text-base break-words">
          {content}
        </span>
        {ctaText && ctaLink && (
          <Link href={ctaLink}>
            <button
              className={`block mt-1 text-sm sm:text-base ${TEXT_COLOR[ctaTextColor]}`}
            >
              {ctaText}
            </button>
          </Link>
        )}
      </div>
      <button className="ml-2 sm:ml-4 flex-shrink-0" onClick={handleClose}>
        <CloseIcon width={16} className="text-black font-bold" />
      </button>
    </div>
  );
};

export default Toast;
