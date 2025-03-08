declare global {
  interface Window {
    html2canvas: (
      element: HTMLElement,
      options: {
        backgroundColor: string | null;
        scale: number;
        useCORS: boolean;
        logging: boolean;
        allowTaint: boolean;
        onclone: (event: Document) => void;
      }
    ) => Promise<HTMLCanvasElement>;
  }
}

export const directDownload = async (
  modalRef: React.RefObject<HTMLDivElement | null>
): Promise<void> => {
  if (!modalRef.current) return;

  try {
    // Find elements to temporarily hide or modify
    const buttonSection = modalRef.current.querySelector(
      '[class*="px-6 pt-4 border-t"], [class*="px-3 sm:px-6 pt-3 sm:pt-4 border-t"]'
    );

    const bookmarkButton = modalRef.current.querySelector(
      ".text-lg.text-gray-400.hover\\:text-yellow-500, .text-lg.sm\\:text-lg.text-gray-400.hover\\:text-yellow-500"
    );

    // const closeButton = modalRef.current.querySelector(
    //   ".text-gray-400.hover\\:text-gray-600"
    // );

    // Add close button
    const closeButton = document.createElement("button");
    closeButton.className =
      "p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors";
    closeButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;

    // Find keywords section to hide
    const keywordsSection = modalRef.current.querySelector(
      ".flex.flex-wrap.pt-6.gap-2.items-center, .flex.flex-wrap.pt-4.sm\\:pt-6.gap-1.sm\\:gap-2.items-center"
    );

    // Store original styles
    let originalButtonDisplay = "flex";
    let originalKeywordsDisplay = "flex";
    let originalOverflowY = "auto";
    let originalMaxHeight = "70vh";

    // Find the scrollable content div and remove its height constraints
    const scrollableDiv = modalRef.current.querySelector(
      ".p-4.px-6\\.5.pt-2\\.5.overflow-y-auto.max-h-\\[70vh\\], .p-3.sm\\:p-4.sm\\:px-6.sm\\:pt-2\\.5.overflow-y-auto.max-h-\\[60vh\\].sm\\:max-h-\\[70vh\\]"
    );

    if (scrollableDiv) {
      originalOverflowY =
        (scrollableDiv as HTMLElement).style.overflowY || "auto";
      originalMaxHeight =
        (scrollableDiv as HTMLElement).style.maxHeight || "70vh";

      // Remove scroll constraints for the screenshot
      (scrollableDiv as HTMLElement).style.overflowY = "visible";
      (scrollableDiv as HTMLElement).style.maxHeight = "none";
    }

    if (buttonSection) {
      originalButtonDisplay =
        (buttonSection as HTMLElement).style.display || "flex";
      (buttonSection as HTMLElement).style.display = "none";
    }

    // Hide keywords section
    if (keywordsSection) {
      originalKeywordsDisplay =
        (keywordsSection as HTMLElement).style.display || "flex";
      (keywordsSection as HTMLElement).style.display = "none";
    }

    // Hide buttons
    if (bookmarkButton) {
      (bookmarkButton as HTMLElement).style.display = "none";
    }

    if (closeButton) {
      (closeButton as HTMLElement).style.display = "none";
    }

    // Load html2canvas if needed
    if (!window.html2canvas) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    const orderedLists = modalRef.current.querySelectorAll("ol");
    const orderedListItems = modalRef.current.querySelectorAll("ol > li");

    // Save original styles
    const originalOlStyles = Array.from(orderedLists).map((ol) => {
      const element = ol as HTMLElement;
      return {
        element,
        listStyleType: element.style.listStyleType,
        paddingLeft: element.style.paddingLeft,
      };
    });

    const originalListStyles = Array.from(orderedListItems).map((li) => {
      const element = li as HTMLElement;
      return {
        element,
        position: element.style.position,
        paddingLeft: element.style.paddingLeft,
        marginBottom: element.style.marginBottom,
      };
    });

    // Apply consistent styling to ordered lists
    orderedLists.forEach((ol) => {
      const element = ol as HTMLElement;
      element.style.listStyleType = "decimal";
      element.style.paddingLeft = "20px";
    });

    // Apply consistent styling to list items
    orderedListItems.forEach((li) => {
      const element = li as HTMLElement;
      element.style.position = "relative";
      element.style.paddingLeft = "15px";
      element.style.marginBottom = "10px";
    });

    // Create a temporary container for the gradient background
    const gradientContainer = document.createElement("div");
    gradientContainer.style.width = "1200px";
    gradientContainer.style.minHeight = "800px";
    gradientContainer.style.position = "fixed";
    gradientContainer.style.left = "-9999px";
    gradientContainer.style.top = "-9999px";
    gradientContainer.style.background =
      "linear-gradient(135deg, #fde047 0%, #fb923c 100%)";
    gradientContainer.style.padding = "60px";
    gradientContainer.style.boxSizing = "border-box";
    gradientContainer.style.display = "flex";
    gradientContainer.style.justifyContent = "center";
    gradientContainer.style.alignItems = "center";

    // Create a white card for the content
    const whiteCard = document.createElement("div");
    whiteCard.style.backgroundColor = "white";
    whiteCard.style.borderRadius = "24px";
    whiteCard.style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.1)";
    whiteCard.style.padding = "40px";
    whiteCard.style.boxSizing = "border-box";
    whiteCard.style.width = "100%";
    whiteCard.style.maxWidth = "800px";

    // Clone the modal content
    const contentClone = modalRef.current.cloneNode(true) as HTMLElement;

    // Extract the main content area from the clone
    const mainContent = contentClone.querySelector(
      ".p-4.px-6\\.5.pt-2\\.5.overflow-y-auto, .p-3.sm\\:p-4.sm\\:px-6.sm\\:pt-2\\.5.overflow-y-auto"
    );
    if (mainContent) {
      // Extract the title from the header section
      const headerArea = contentClone.querySelector(
        ".flex.justify-between.items-center.p-6, .flex.justify-between.items-center.p-3.sm\\:p-6"
      );
      const titleElement = headerArea?.querySelector("h2") || null;

      if (titleElement) {
        // Create a new heading element for the white card
        const heading = document.createElement("h1");
        heading.textContent = titleElement.textContent || "";
        heading.style.fontSize = "28px";
        heading.style.fontWeight = "600";
        heading.style.marginBottom = "10px";
        heading.style.color = "#111827";
        whiteCard.appendChild(heading);

        // Add the source if available
        const sourceElement = headerArea?.querySelector(
          ".text-sm.text-gray-400, .text-xs.sm\\:text-sm.text-gray-400"
        );
        if (sourceElement) {
          const sourceText = document.createElement("p");
          sourceText.textContent = sourceElement.textContent || "";
          sourceText.style.fontSize = "14px";
          sourceText.style.color = "#6B7280";
          sourceText.style.marginBottom = "20px";
          whiteCard.appendChild(sourceText);
        }
      }

      // Add a divider
      const divider = document.createElement("hr");
      divider.style.border = "none";
      divider.style.borderTop = "1px solid #E5E7EB";
      divider.style.margin = "20px 0";
      whiteCard.appendChild(divider);

      // Remove any buttons or UI elements
      const buttonsToRemove = mainContent.querySelectorAll(
        "button, [role='button']"
      );
      buttonsToRemove.forEach((button) => {
        if (button.parentNode) {
          button.parentNode.removeChild(button);
        }
      });

      // Hide keywords section in the clone
      const keywordsToHide = mainContent.querySelector(
        ".flex.flex-wrap.pt-6.gap-2.items-center, .flex.flex-wrap.pt-4.sm\\:pt-6.gap-1.sm\\:gap-2.items-center"
      );
      if (keywordsToHide && keywordsToHide.parentNode) {
        keywordsToHide.parentNode.removeChild(keywordsToHide);
      }

      // Reset styles on the main content
      (mainContent as HTMLElement).style.padding = "0";
      (mainContent as HTMLElement).style.maxHeight = "none";
      (mainContent as HTMLElement).style.overflowY = "visible";

      // Add the content to the white card
      whiteCard.appendChild(mainContent);
    }

    // Add footer with Maktabah Ramadan logo
    const footerElement = document.createElement("div");
    footerElement.style.borderTop = "1px solid #E5E7EB";
    footerElement.style.paddingTop = "20px";
    footerElement.style.marginTop = "30px";
    footerElement.style.textAlign = "center";
    footerElement.style.display = "flex";
    footerElement.style.justifyContent = "center";
    footerElement.style.alignItems = "center";

    footerElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; line-height: 1;">
        <span style="font-size: 20px; margin-right: 6px; color: #333; display: inline-block;">☪</span>
        <span style="font-weight: 600; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: inline-block;">
          <span style="color: #000000; font-size: 17px;">Maktabah</span>
          <span style="color: #8b5cf6; font-size: 17px;">Ramadan</span>
        </span>
      </div>
    `;

    whiteCard.appendChild(footerElement);
    gradientContainer.appendChild(whiteCard);
    document.body.appendChild(gradientContainer);

    // Wait for styles to apply
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Add a loading indicator
    const loadingIndicator = document.createElement("div");
    loadingIndicator.style.position = "fixed";
    loadingIndicator.style.top = "50%";
    loadingIndicator.style.left = "50%";
    loadingIndicator.style.transform = "translate(-50%, -50%)";
    loadingIndicator.style.padding = "15px 25px";
    loadingIndicator.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    loadingIndicator.style.color = "white";
    loadingIndicator.style.borderRadius = "8px";
    loadingIndicator.style.zIndex = "99999";
    loadingIndicator.style.fontSize = "14px";
    loadingIndicator.style.fontWeight = "500";
    loadingIndicator.innerHTML = "Generating image...";
    document.body.appendChild(loadingIndicator);

    // Capture the styled container
    await new Promise((resolve) => setTimeout(resolve, 100));
    const canvas = await window.html2canvas(gradientContainer, {
      allowTaint: true,
      useCORS: true,
      scale: 2,
      backgroundColor: null,
      logging: false,
      onclone: (clonedDoc) => {
        // Ensure ordered lists are visible in the clone
        const clonedLists = clonedDoc.querySelectorAll("ol");
        clonedLists.forEach((ol) => {
          (ol as HTMLElement).style.listStyleType = "decimal";
          (ol as HTMLElement).style.paddingLeft = "40px";
        });

        const clonedListItems = clonedDoc.querySelectorAll("li");
        clonedListItems.forEach((li) => {
          (li as HTMLElement).style.marginBottom = "12px";
          (li as HTMLElement).style.color = "#374151";
        });

        // Handle oklch colors to prevent parsing errors
        const allElements = clonedDoc.querySelectorAll("*");
        allElements.forEach((element) => {
          const computedStyle = window.getComputedStyle(element);
          const replacementProps = [
            "color",
            "background-color",
            "border-color",
          ];

          for (const prop of replacementProps) {
            const value = computedStyle.getPropertyValue(prop);
            if (value && value.includes("oklch")) {
              if (prop === "color") {
                (element as HTMLElement).style.color = "#333333";
              } else if (prop === "background-color") {
                (element as HTMLElement).style.backgroundColor = "#ffffff";
              } else if (prop === "border-color") {
                (element as HTMLElement).style.borderColor = "#cccccc";
              }
            }
          }
        });
      },
    });

    // Clean up: Remove the temporary container
    if (gradientContainer.parentNode) {
      document.body.removeChild(gradientContainer);
    }

    // Restore original styles
    orderedLists.forEach((ol, index) => {
      if (index < originalOlStyles.length) {
        const { element, listStyleType, paddingLeft } = originalOlStyles[index];
        element.style.listStyleType = listStyleType;
        element.style.paddingLeft = paddingLeft;
      }
    });

    orderedListItems.forEach((li, index) => {
      if (index < originalListStyles.length) {
        const { element, position, paddingLeft, marginBottom } =
          originalListStyles[index];
        element.style.position = position;
        element.style.paddingLeft = paddingLeft;
        element.style.marginBottom = marginBottom;
      }
    });

    // Restore button section
    if (buttonSection) {
      (buttonSection as HTMLElement).style.display = originalButtonDisplay;
    }

    // Restore keywords section
    if (keywordsSection) {
      (keywordsSection as HTMLElement).style.display = originalKeywordsDisplay;
    }

    // Restore scroll settings
    if (scrollableDiv) {
      (scrollableDiv as HTMLElement).style.overflowY = originalOverflowY;
      (scrollableDiv as HTMLElement).style.maxHeight = originalMaxHeight;
    }

    // Restore buttons
    if (bookmarkButton) {
      (bookmarkButton as HTMLElement).style.display = "block";
    }

    if (closeButton) {
      (closeButton as HTMLElement).style.display = "block";
    }

    // Remove the loading indicator
    if (loadingIndicator.parentNode) {
      document.body.removeChild(loadingIndicator);
    }

    // Get data URL for the image
    const dataUrl = canvas.toDataURL("image/png", 1.0);

    // Create a modal container that will adapt to screen size
    const modalContainer = document.createElement("div");
    modalContainer.className =
      "fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50";
    modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
    modalContainer.style.backdropFilter = "blur(5px)";
    modalContainer.style.opacity = "0";
    modalContainer.style.transition = "opacity 0.3s ease";

    // Create a modal content div that will use Tailwind classes
    const modalContent = document.createElement("div");
    modalContent.className =
      "bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden transform scale-95 transition-all duration-300";
    modalContent.style.opacity = "0";
    modalContent.style.transition =
      "transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)";

    // Create header with responsive classes
    const modalHeader = document.createElement("div");
    modalHeader.className =
      "flex justify-between items-center p-3 sm:p-6 border-b border-gray-100";

    // Add title
    const titleDiv = document.createElement("div");
    titleDiv.className = "flex items-center";
    titleDiv.innerHTML = `
      <h2 class="text-lg sm:text-2xl font-bold">
        <span class="text-lg sm:text-2xl mr-1 sm:mr-2" style="color: #333;">☪</span>
        <span class="text-black">Maktabah</span>
        <span class="text-violet-500">Ramadan</span>
      </h2>
    `;

    // Create body with responsive classes
    const modalBody = document.createElement("div");
    modalBody.className =
      "p-3 sm:p-6 overflow-y-auto max-h-[60vh] sm:max-h-[65vh]";

    // Add image
    const img = new Image();
    img.className = "w-full rounded-lg border border-gray-200 shadow-sm";
    img.style.opacity = "0";
    img.style.transition = "opacity 0.3s ease";
    img.onload = function () {
      img.style.opacity = "1";
    };
    img.src = dataUrl;

    // Create footer with responsive classes
    const modalFooter = document.createElement("div");
    modalFooter.className =
      "p-3 sm:p-6 pt-2 sm:pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center";

    // Add download button
    const downloadBtn = document.createElement("a");
    downloadBtn.className =
      "flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm sm:text-base transition-colors w-full sm:w-auto";
    downloadBtn.href = dataUrl;
    downloadBtn.download = "hadith-maktabah-ramadan.png";
    downloadBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Download Image
    `;

    // Add share button (only for mobile devices or if Web Share API is supported)
    const shareBtn = document.createElement("button");
    shareBtn.className =
      "flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm sm:text-base transition-colors w-full sm:w-auto";
    shareBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
      Share
    `;

    // Handle sharing when supported
    shareBtn.onclick = async () => {
      try {
        const blob = await fetch(dataUrl).then((r) => r.blob());
        const file = new File([blob], "hadith-maktabah-ramadan.png", {
          type: "image/png",
        });

        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          await navigator.share({
            title: "Hadith from Maktabah Ramadan",
            files: [file],
          });
        } else {
          alert(
            "Web Share API is not supported in your browser. Please use the download button instead."
          );
        }
      } catch (error) {
        console.error("Error sharing:", error);
      }
    };

    // Close button functionality
    closeButton.onclick = () => {
      modalContainer.style.opacity = "0";
      modalContent.style.transform = "scale(0.95)";
      modalContent.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(modalContainer);
      }, 300);
    };

    // Assemble the modal
    modalHeader.appendChild(titleDiv);
    modalHeader.appendChild(closeButton);

    modalBody.appendChild(img);

    modalFooter.appendChild(downloadBtn);

    // Only add share button if Web Share API is likely supported or on mobile
    if (
      !!navigator.share ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      modalFooter.appendChild(shareBtn);
    }

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);

    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);

    // Force a reflow and animate in
    void modalContainer.offsetWidth;

    requestAnimationFrame(() => {
      setTimeout(() => {
        modalContainer.style.opacity = "1";
        modalContent.style.opacity = "1";
      }, 50);
    });
  } catch (error) {
    console.error("Error capturing and downloading image:", error);
    alert("There was an error generating the image. Please try again.");
  }
};
