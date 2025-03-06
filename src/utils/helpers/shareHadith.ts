declare global {
  interface Window {
    html2canvas: (
      element: HTMLElement,
      options: {
        backgroundColor: string;
        scale: number;
        useCORS: boolean;
        allowTaint: boolean;
      }
    ) => Promise<HTMLCanvasElement>;
  }
}

// Function to capture and share the modal content without the buttons
export const captureAndShareModal = async (
  modalRef: React.RefObject<HTMLDivElement | null>,
  hadithInfo: string,
  platform?: "whatsapp" | "twitter" | "download"
) => {
  if (!modalRef.current) return;

  // Find the buttons container element
  const buttonsContainer = modalRef.current.querySelector(
    '[class*="mt-6 pt-4 border-t"]'
  );

  if (buttonsContainer) {
    try {
      // Temporarily hide the buttons by setting display: none
      const originalDisplay = (buttonsContainer as HTMLElement).style.display;
      (buttonsContainer as HTMLElement).style.display = "none";

      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Capture the modal content using html2canvas
      const canvas = await window.html2canvas(modalRef.current, {
        allowTaint: true,
        useCORS: true,
        scale: 2, // Higher scale for better quality
        backgroundColor: "#ffffff",
      });

      // Restore the buttons display
      (buttonsContainer as HTMLElement).style.display = originalDisplay;

      // Get blob from canvas
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/png", 0.95);
      });

      if (!blob) {
        throw new Error("Failed to convert canvas to blob");
      }

      // Create a file from the blob
      const file = new File([blob], "hadith-share.png", { type: "image/png" });

      // Handle sharing based on platform
      if (platform === "whatsapp") {
        await shareToWhatsApp(file, hadithInfo);
      } else if (platform === "twitter") {
        await shareToTwitter(file, hadithInfo);
      } else if (platform === "download") {
        downloadImage(canvas.toDataURL("image/png", 0.95));
      } else {
        // Show share options or use Web Share API if available
        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          try {
            await navigator.share({
              title: "Shared Hadith",
              text: hadithInfo,
              files: [file],
            });
          } catch (err) {
            console.error("Error sharing via Web Share API:", err);
            showShareFallback(
              file,
              canvas.toDataURL("image/png", 0.95),
              hadithInfo
            );
          }
        } else {
          showShareFallback(
            file,
            canvas.toDataURL("image/png", 0.95),
            hadithInfo
          );
        }
      }
    } catch (error) {
      console.error("Error in capture and share process:", error);
      // Restore display in case of error
      if (buttonsContainer) {
        (buttonsContainer as HTMLElement).style.display = "block";
      }
      alert("There was an error sharing the image. Please try again.");
    }
  }
};

// Helper function to share to WhatsApp
const shareToWhatsApp = async (file: File, text: string) => {
  try {
    // First try native sharing if supported
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        title: "Shared Hadith via WhatsApp",
        text: text,
        files: [file],
      });
      return;
    }
  } catch (err) {
    console.log("Native sharing not available or failed, using fallback");
  }

  // Fallback: Create a temporary shareable URL and open WhatsApp
  const dataUrl = await fileToDataUrl(file);

  // Create a downloadable link for the image
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "hadith-share.png";
  link.click();

  // Open WhatsApp with text
  const encodedText = encodeURIComponent(
    `${text}\n\n(Please attach the downloaded image)`
  );
  window.open(`https://wa.me/?text=${encodedText}`, "_blank");
};

// Helper function to share to Twitter
const shareToTwitter = async (file: File, text: string) => {
  try {
    // First try native sharing if supported
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        title: "Shared Hadith via Twitter",
        text: text,
        files: [file],
      });
      return;
    }
  } catch (err) {
    console.log("Native sharing not available or failed, using fallback");
  }

  // Fallback: Create a temporary shareable URL and open Twitter
  const dataUrl = await fileToDataUrl(file);

  // Create a downloadable link for the image
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "hadith-share.png";
  link.click();

  // Open Twitter with text
  const encodedText = encodeURIComponent(text);
  window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, "_blank");
};

// Helper function to convert File to DataURL
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper function to download the image
const downloadImage = (dataUrl: string) => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "hadith-share.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper function to show share fallback UI
const showShareFallback = (file: File, dataUrl: string, text: string) => {
  // Create a modal for share options
  const modalContainer = document.createElement("div");
  modalContainer.style.position = "fixed";
  modalContainer.style.top = "0";
  modalContainer.style.left = "0";
  modalContainer.style.width = "100%";
  modalContainer.style.height = "100%";
  modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  modalContainer.style.display = "flex";
  modalContainer.style.alignItems = "center";
  modalContainer.style.justifyContent = "center";
  modalContainer.style.zIndex = "9999";

  const sharePanel = document.createElement("div");
  sharePanel.style.backgroundColor = "white";
  sharePanel.style.borderRadius = "8px";
  sharePanel.style.padding = "20px";
  sharePanel.style.width = "300px";
  sharePanel.style.maxWidth = "90%";

  // Add title
  const title = document.createElement("h3");
  title.textContent = "Share to:";
  title.style.marginBottom = "20px";
  title.style.textAlign = "center";
  sharePanel.appendChild(title);

  // Add preview image
  const previewContainer = document.createElement("div");
  previewContainer.style.marginBottom = "15px";
  previewContainer.style.textAlign = "center";

  const previewImg = document.createElement("img");
  previewImg.src = dataUrl;
  previewImg.style.maxWidth = "100%";
  previewImg.style.maxHeight = "150px";
  previewImg.style.borderRadius = "4px";
  previewImg.style.border = "1px solid #e0e0e0";

  previewContainer.appendChild(previewImg);
  sharePanel.appendChild(previewContainer);

  // Add share buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-around";
  buttonContainer.style.marginBottom = "20px";

  // WhatsApp button
  const whatsappBtn = document.createElement("button");
  whatsappBtn.textContent = "WhatsApp";
  whatsappBtn.style.backgroundColor = "#25D366";
  whatsappBtn.style.color = "white";
  whatsappBtn.style.border = "none";
  whatsappBtn.style.borderRadius = "4px";
  whatsappBtn.style.padding = "10px 15px";
  whatsappBtn.style.cursor = "pointer";
  whatsappBtn.style.fontWeight = "bold";
  whatsappBtn.onclick = async () => {
    modalContainer.remove();
    await shareToWhatsApp(file, text);
  };

  // Twitter button
  const twitterBtn = document.createElement("button");
  twitterBtn.textContent = "Twitter";
  twitterBtn.style.backgroundColor = "#1DA1F2";
  twitterBtn.style.color = "white";
  twitterBtn.style.border = "none";
  twitterBtn.style.borderRadius = "4px";
  twitterBtn.style.padding = "10px 15px";
  twitterBtn.style.cursor = "pointer";
  twitterBtn.style.fontWeight = "bold";
  twitterBtn.onclick = async () => {
    modalContainer.remove();
    await shareToTwitter(file, text);
  };

  // Download button
  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "Download";
  downloadBtn.style.backgroundColor = "#6c757d";
  downloadBtn.style.color = "white";
  downloadBtn.style.border = "none";
  downloadBtn.style.borderRadius = "4px";
  downloadBtn.style.padding = "10px 15px";
  downloadBtn.style.cursor = "pointer";
  downloadBtn.style.fontWeight = "bold";
  downloadBtn.onclick = () => {
    modalContainer.remove();
    downloadImage(dataUrl);
  };

  buttonContainer.appendChild(whatsappBtn);
  buttonContainer.appendChild(twitterBtn);
  buttonContainer.appendChild(downloadBtn);
  sharePanel.appendChild(buttonContainer);

  // Add close button
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.style.width = "100%";
  closeBtn.style.padding = "8px";
  closeBtn.style.borderRadius = "4px";
  closeBtn.style.border = "none";
  closeBtn.style.backgroundColor = "#f8f9fa";
  closeBtn.style.cursor = "pointer";
  closeBtn.onclick = () => modalContainer.remove();
  sharePanel.appendChild(closeBtn);

  modalContainer.appendChild(sharePanel);
  document.body.appendChild(modalContainer);

  // Close when clicking outside
  modalContainer.onclick = (e) => {
    if (e.target === modalContainer) {
      modalContainer.remove();
    }
  };
};

// This helper function was removed and replaced with inline button creation
