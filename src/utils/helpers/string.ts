type Props = {
  text: string;
  arabicText?: string;
  displayLanguage: string;
};

export const copyHadithText = async (
  callback: (val: boolean) => void,
  { text }: Props,
) => {
  let copyText = "";

  // if (displayLanguage === "both") {
  //   copyText = `${text}\n\n${arabicText}`;
  // } else if (displayLanguage === "arabic") {
  //   copyText = arabicText;
  // } else {
  //   copyText = text;
  // }

  copyText = text;

  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(copyText);
    } else {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = copyText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    callback(true);
    setTimeout(() => callback(false), 2000);
  } catch (err) {
    console.error("Failed to copy text:", err);
  }
};
