declare global {
  interface Window {
    html2canvas: (
      element: HTMLElement,
      options: {
        backgroundColor: string;
        scale: number;
        useCORS: boolean;
        logging: boolean;
        allowTaint: boolean;
        onclone: (event: Document) => void;
      }
    ) => Promise<HTMLCanvasElement>;
  }
}

/**
 * Creates a custom Hadith image for download with the Maktabah Ramadan header
 * while preserving the original title and removing only the star/X icons
 */
/**
 * Enhanced download function with improved UI and Maktabah Ramadan logo
 */
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

    // Store original styles
    let originalButtonDisplay = "flex";

    if (buttonSection) {
      originalButtonDisplay =
        (buttonSection as HTMLElement).style.display || "flex";
      (buttonSection as HTMLElement).style.display = "none";
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

    // Create footer element for the bottom-center logo
    const footerElement = document.createElement("div");
    footerElement.style.borderTop = "none";
    footerElement.style.padding = "30px 0 20px 0";
    footerElement.style.marginTop = "30px";
    footerElement.style.textAlign = "center";
    footerElement.style.backgroundColor = "white";
    footerElement.style.width = "100%";
    footerElement.style.display = "flex";
    footerElement.style.justifyContent = "center";
    footerElement.style.alignItems = "center";

    // Add the Maktabah Ramadan logo to the footer
    footerElement.innerHTML = `
  <div style="display: flex; align-items: center; justify-content: center; line-height: 1;">
    <span style="font-size: 20px; margin-right: 6px; color: #333; display: inline-block;">☪</span>
    <span style="font-weight: 600; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: inline-block;">
      <span style="color: #000000; font-size: 17px;">Maktabah</span>
      <span style="color: #8b5cf6; font-size: 17px;">Ramadan</span>
    </span>
  </div>
`;

    // Append the footer to the modal content
    modalRef.current.appendChild(footerElement);

    // Wait for styles to apply
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Capture the modal with improved styling
    const canvas = await window.html2canvas(modalRef.current, {
      allowTaint: true,
      useCORS: true,
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false,
      onclone: (clonedDoc) => {
        // Handle oklch colors
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

        // Enhance keyword chips in the cloned document
        const keywordChips = clonedDoc.querySelectorAll(
          ".text-xs.px-2.py-1.rounded-full.bg-gray-50.text-gray-500"
        );
        keywordChips.forEach((chip) => {
          (chip as HTMLElement).style.backgroundColor = "#f3f4f6";
          (chip as HTMLElement).style.color = "#4b5563";
          (chip as HTMLElement).style.padding = "4px 12px";
          (chip as HTMLElement).style.borderRadius = "9999px";
          (chip as HTMLElement).style.fontWeight = "500";
          (chip as HTMLElement).style.fontSize = "0.75rem";
          (chip as HTMLElement).style.margin = "0 4px 4px 0";
          (chip as HTMLElement).style.display = "inline-block";
        });

        // Fix modal height and other layout issues
        const clonedModal = clonedDoc.querySelector('[class*="rounded-xl"]');
        if (clonedModal) {
          (clonedModal as HTMLElement).style.maxHeight = "none";
          (clonedModal as HTMLElement).style.overflow = "visible";
          (clonedModal as HTMLElement).style.boxShadow =
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
        }
      },
    });

    // Clean up: Remove the footer element
    if (footerElement.parentNode === modalRef.current) {
      modalRef.current.removeChild(footerElement);
    }

    // Restore original ordered list styles
    originalOlStyles.forEach(({ element, listStyleType, paddingLeft }) => {
      element.style.listStyleType = listStyleType;
      element.style.paddingLeft = paddingLeft;
    });

    // Restore original list item styles
    originalListStyles.forEach(
      ({ element, position, paddingLeft, marginBottom }) => {
        element.style.position = position;
        element.style.paddingLeft = paddingLeft;
        element.style.marginBottom = marginBottom;
      }
    );

    // Restore button section
    if (buttonSection) {
      (buttonSection as HTMLElement).style.display = originalButtonDisplay;
    }

    // Restore buttons
    if (bookmarkButton) {
      (bookmarkButton as HTMLElement).style.display = "block";
    }

    if (closeButton) {
      (closeButton as HTMLElement).style.display = "block";
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
    modal.style.zIndex = "9999";
    modal.style.transition = "opacity 0.2s ease";
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
      <span style="background: linear-gradient(to right, #7c3aed, #c4b5fd); -webkit-background-clip: text; background-clip: text; color: transparent;">
        Ramadan
      </span>
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
      }, 200);
    };

    // Add close button to header
    modalHeader.appendChild(closeButtonModal);

    // Create image content area
    const imageContainer = document.createElement("div");
    imageContainer.style.padding = "20px";
    imageContainer.style.display = "flex";
    imageContainer.style.flexDirection = "column";
    imageContainer.style.alignItems = "center";
    imageContainer.style.overflowY = "auto";

    // Add image with border and shadow
    const img = document.createElement("img");
    img.src = dataUrl;
    img.style.maxWidth = "100%";
    img.style.borderRadius = "8px";
    img.style.border = "1px solid #eaeaea";
    img.style.boxShadow =
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";

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

    // Create footer element
    //     const modalFooterElement = document.createElement("div");
    //     modalFooterElement.style.borderTop = "1px solid #eaeaea";
    //     modalFooterElement.style.padding = "16px";
    //     modalFooterElement.style.marginTop = "20px";
    //     modalFooterElement.style.textAlign = "center";
    //     modalFooterElement.style.backgroundColor = "white";
    //     modalFooterElement.style.borderBottomLeftRadius = "12px";
    //     modalFooterElement.style.borderBottomRightRadius = "12px";

    //     // Add the Maktabah Ramadan logo to the footer
    //     modalFooterElement.innerHTML = `
    //   <div style="display: inline-flex; align-items: center; justify-content: center;">
    //     <span style="font-size: 20px; margin-right: 8px;">☪</span>
    //     <span style="font-size: 16px; font-weight: 600; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    //       <span style="color: #000000;">Maktabah</span>
    //       <span style="background: linear-gradient(to right, #7c3aed, #c4b5fd); -webkit-background-clip: text; background-clip: text; color: transparent;">
    //         Ramadan
    //       </span>
    //     </span>
    //   </div>
    // `;

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
    // container.appendChild(modalFooterElement);
    modal.appendChild(container);
    document.body.appendChild(modal);

    // Animate the modal entrance
    setTimeout(() => {
      modal.style.opacity = "1";
      container.style.transform = "scale(1)";
    }, 10);
  } catch (error) {
    console.error("Error capturing and downloading image:", error);
    alert("There was an error generating the image. Please try again.");
  }
};
