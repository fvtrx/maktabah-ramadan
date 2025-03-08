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
      '[class*="px-6 pt-4 border-t"]'
    );

    const bookmarkButton = modalRef.current.querySelector(
      ".text-lg.text-gray-400.hover\\:text-yellow-500"
    );

    const closeButton = modalRef.current.querySelector(
      ".text-gray-400.hover\\:text-gray-600"
    );

    // Find keywords section to hide
    const keywordsSection = modalRef.current.querySelector(
      ".flex.flex-wrap.pt-6.gap-2.items-center"
    );

    // Store original styles
    let originalButtonDisplay = "flex";
    let originalKeywordsDisplay = "flex";
    let originalOverflowY = "auto";
    let originalMaxHeight = "70vh";

    // Find the scrollable content div and remove its height constraints
    const scrollableDiv = modalRef.current.querySelector(
      ".p-4.px-6\\.5.pt-2\\.5.overflow-y-auto.max-h-\\[70vh\\]"
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
      ".p-4.px-6\\.5.pt-2\\.5.overflow-y-auto"
    );
    if (mainContent) {
      // Extract the title from the header section
      const headerArea = contentClone.querySelector(
        ".flex.justify-between.items-center.p-6"
      );
      let titleElement = headerArea?.querySelector("h2") || null;

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
          ".text-sm.text-gray-400"
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
        ".flex.flex-wrap.pt-6.gap-2.items-center"
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

    // Create a beautiful modal to show the generated image
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
    modal.style.backdropFilter = "blur(5px)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "99999"; // Increase z-index to ensure it's on top
    modal.style.transition = "opacity 0.3s ease";
    modal.style.opacity = "0";

    // Create container with beautiful styling
    const container = document.createElement("div");
    container.style.backgroundColor = "white";
    container.style.borderRadius = "12px";
    container.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
    container.style.overflow = "hidden";
    container.style.width = "90%";
    container.style.maxWidth = "768px";
    container.style.maxHeight = "90vh";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.transform = "scale(0.95)";
    container.style.transition = "transform 0.3s ease";
    container.style.willChange = "transform"; // Optimize for animations

    // Create modal header with Maktabah Ramadan branding
    const modalHeader = document.createElement("div");
    modalHeader.style.padding = "16px 20px";
    modalHeader.style.borderBottom = "1px solid #f0f0f0";
    modalHeader.style.display = "flex";
    modalHeader.style.alignItems = "center";
    modalHeader.style.justifyContent = "space-between";
    modalHeader.innerHTML = `
  <div style="display: flex; align-items: center;">
    <h2 style="margin: 0; font-size: 24px; font-weight: 700; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <span style="font-size: 24px; margin-right: 8px; color: #000000;">☪</span>
      <span style="color: #000000;">Maktabah</span>
      <span style="color: #8b5cf6;">Ramadan</span>
    </h2>
  </div>
`;

    // Create close button
    const closeButtonModal = document.createElement("button");
    closeButtonModal.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    closeButtonModal.style.background = "none";
    closeButtonModal.style.border = "none";
    closeButtonModal.style.cursor = "pointer";
    closeButtonModal.style.color = "#6b7280";
    closeButtonModal.style.display = "flex";
    closeButtonModal.style.alignItems = "center";
    closeButtonModal.style.justifyContent = "center";
    closeButtonModal.style.padding = "8px";
    closeButtonModal.style.borderRadius = "6px";
    closeButtonModal.style.transition = "background-color 0.2s";

    // Add hover effect to close button
    closeButtonModal.onmouseover = function () {
      closeButtonModal.style.backgroundColor = "#f3f4f6";
      closeButtonModal.style.color = "#374151";
    };
    closeButtonModal.onmouseout = function () {
      closeButtonModal.style.backgroundColor = "transparent";
      closeButtonModal.style.color = "#6b7280";
    };

    closeButtonModal.onclick = () => {
      modal.style.opacity = "0";
      container.style.transform = "scale(0.95)";
      setTimeout(() => {
        document.body.removeChild(modal);
        // Clean up the style tag we added
        if (styleTag.parentNode) {
          styleTag.parentNode.removeChild(styleTag);
        }
      }, 300);
    };

    // Add close button to header
    modalHeader.appendChild(closeButtonModal);

    // Create image content area with improved styling
    const imageContainer = document.createElement("div");
    imageContainer.style.padding = "20px";
    imageContainer.style.display = "flex";
    imageContainer.style.flexDirection = "column";
    imageContainer.style.alignItems = "center";
    imageContainer.style.overflowY = "auto";
    imageContainer.style.overflowX = "hidden"; // Prevent horizontal scrolling
    imageContainer.style.setProperty("-ms-overflow-style", "none");
    imageContainer.style.scrollbarWidth = "none"; // Hide scrollbars in Firefox

    // Add custom scrollbar hiding for WebKit browsers
    const styleTag = document.createElement("style");
    styleTag.textContent = `
      .modal-image-container::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(styleTag);
    imageContainer.classList.add("modal-image-container");

    // Add image with border and shadow - preload handling to prevent flickering
    const img = new Image();
    img.onload = function () {
      // Image is loaded, ensure smooth display
      img.style.opacity = "1";
    };
    img.style.opacity = "0";
    img.style.transition = "opacity 0.3s ease";
    img.style.maxWidth = "100%";
    img.style.borderRadius = "8px";
    img.style.border = "1px solid #eaeaea";
    img.style.boxShadow =
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
    img.src = dataUrl; // Set src after setting up the onload handler

    // Create action buttons container
    const actionContainer = document.createElement("div");
    actionContainer.style.display = "flex";
    actionContainer.style.justifyContent = "center";
    actionContainer.style.marginTop = "20px";
    actionContainer.style.gap = "12px";

    // Create download button
    const downloadBtn = document.createElement("a");
    downloadBtn.href = dataUrl;
    downloadBtn.download = "hadith-maktabah-ramadan.png";
    downloadBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: -3px;">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Download Image
    `;
    downloadBtn.style.display = "inline-flex";
    downloadBtn.style.alignItems = "center";
    downloadBtn.style.justifyContent = "center";
    downloadBtn.style.padding = "10px 20px";
    downloadBtn.style.backgroundColor = "#6366f1";
    downloadBtn.style.color = "white";
    downloadBtn.style.borderRadius = "8px";
    downloadBtn.style.fontWeight = "600";
    downloadBtn.style.textDecoration = "none";
    downloadBtn.style.boxShadow = "0 4px 6px -1px rgba(99, 102, 241, 0.4)";
    downloadBtn.style.transition = "all 0.2s";

    // Add hover effects to download button
    downloadBtn.onmouseover = function () {
      downloadBtn.style.backgroundColor = "#4f46e5";
      downloadBtn.style.transform = "translateY(-1px)";
      downloadBtn.style.boxShadow = "0 6px 10px -1px rgba(99, 102, 241, 0.5)";
    };
    downloadBtn.onmouseout = function () {
      downloadBtn.style.backgroundColor = "#6366f1";
      downloadBtn.style.transform = "translateY(0)";
      downloadBtn.style.boxShadow = "0 4px 6px -1px rgba(99, 102, 241, 0.4)";
    };

    // Create share button (optional)
    const shareBtn = document.createElement("button");
    shareBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: -3px;">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
      Share
    `;
    shareBtn.style.display = "inline-flex";
    shareBtn.style.alignItems = "center";
    shareBtn.style.justifyContent = "center";
    shareBtn.style.padding = "10px 20px";
    shareBtn.style.backgroundColor = "#f3f4f6";
    shareBtn.style.color = "#374151";
    shareBtn.style.border = "none";
    shareBtn.style.borderRadius = "8px";
    shareBtn.style.fontWeight = "600";
    shareBtn.style.cursor = "pointer";
    shareBtn.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
    shareBtn.style.transition = "all 0.2s";

    // Add hover effects to share button
    shareBtn.onmouseover = function () {
      shareBtn.style.backgroundColor = "#e5e7eb";
    };
    shareBtn.onmouseout = function () {
      shareBtn.style.backgroundColor = "#f3f4f6";
    };

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

    // Add buttons to action container
    actionContainer.appendChild(downloadBtn);

    // Only add share button if Web Share API is likely supported (mainly mobile devices)
    if (
      !!navigator.share ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      actionContainer.appendChild(shareBtn);
    }

    // Assemble the modal
    imageContainer.appendChild(img);
    imageContainer.appendChild(actionContainer);
    container.appendChild(modalHeader);
    container.appendChild(imageContainer);
    modal.appendChild(container);
    document.body.appendChild(modal);

    // Force a reflow before starting animations to prevent layout glitches
    void modal.offsetWidth;

    // Animate the modal entrance with a slight delay
    requestAnimationFrame(() => {
      setTimeout(() => {
        modal.style.opacity = "1";
        container.style.transform = "scale(1)";
      }, 50);
    });
  } catch (error) {
    console.error("Error capturing and downloading image:", error);
    alert("There was an error generating the image. Please try again.");
  }
};
