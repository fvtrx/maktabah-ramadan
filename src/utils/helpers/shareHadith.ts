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
        onclone: (doc: Document) => void;
      },
    ) => Promise<HTMLCanvasElement>;
  }
}

// ─── Selectors ────────────────────────────────────────────────────────────────

const SELECTORS = {
  buttonSection:
    '[class*="px-6 pt-4 border-t"], [class*="px-3 sm:px-6 pt-3 sm:pt-4 border-t"]',
  bookmarkButton:
    ".text-lg.text-gray-400.hover\\:text-yellow-500, .text-lg.sm\\:text-lg.text-gray-400.hover\\:text-yellow-500",
  keywordsSection:
    ".flex.flex-wrap.pt-6.gap-2.items-center, .flex.flex-wrap.pt-4.sm\\:pt-6.gap-1.sm\\:gap-2.items-center",
  scrollableDiv:
    ".p-4.px-6\\.5.pt-2\\.5.overflow-y-auto.max-h-\\[70vh\\], .p-3.sm\\:p-4.sm\\:px-6.sm\\:pt-2\\.5.overflow-y-auto.max-h-\\[60vh\\].sm\\:max-h-\\[70vh\\]",
  headerArea:
    ".flex.justify-between.items-center.p-6, .flex.justify-between.items-center.p-3.sm\\:p-6",
  mainContent:
    ".p-4.px-6\\.5.pt-2\\.5.overflow-y-auto, .p-3.sm\\:p-4.sm\\:px-6.sm\\:pt-2\\.5.overflow-y-auto",
  sourceText: ".text-sm.text-gray-400, .text-xs.sm\\:text-sm.text-gray-400",
} as const;

// ─── StyleManager ─────────────────────────────────────────────────────────────

/**
 * Saves and restores inline styles on DOM elements so we can temporarily
 * mutate them for html2canvas without leaving side-effects.
 */
class StyleManager {
  private snapshot = new Map<HTMLElement, Record<string, string>>();

  save(element: HTMLElement, props: string[]): void {
    const saved: Record<string, string> = {};
    for (const prop of props) {
      saved[prop] = element.style.getPropertyValue(this.toKebab(prop));
    }
    this.snapshot.set(element, saved);
  }

  restoreAll(): void {
    this.snapshot.forEach((saved, el) => {
      if (!el) return;
      // Clear every saved prop first so inherited styles can re-apply.
      for (const prop of Object.keys(saved)) {
        el.style.removeProperty(this.toKebab(prop));
      }
      void el.offsetHeight; // force reflow
      // Re-apply only props that had an explicit inline value.
      for (const [prop, value] of Object.entries(saved)) {
        if (value) el.style.setProperty(this.toKebab(prop), value);
      }
    });
    this.snapshot.clear();
  }

  private toKebab(prop: string): string {
    return prop.replace(/([A-Z])/g, "-$1").toLowerCase();
  }
}

// ─── ImageDownloader ──────────────────────────────────────────────────────────

export class ImageDownloader {
  private styles = new StyleManager();
  private root: HTMLDivElement;

  constructor(private modalRef: React.RefObject<HTMLDivElement | null>) {
    if (!this.modalRef.current) throw new Error("modalRef is not mounted");
    this.root = this.modalRef.current;
  }

  // ── Public entry point ──────────────────────────────────────────────────────

  async download(): Promise<void> {
    const loading = this.showLoading();
    try {
      this.prepareForCapture();
      await this.ensureHtml2Canvas();

      const container = this.buildGradientContainer();
      document.body.appendChild(container);
      await this.wait(300); // let styles settle

      const canvas = await this.capture(container);
      document.body.removeChild(container);

      const dataUrl = canvas.toDataURL("image/png", 1.0);
      this.showPreviewModal(dataUrl);
    } catch (err) {
      console.error("ImageDownloader error:", err);
      alert("There was an error generating the image. Please try again.");
    } finally {
      this.styles.restoreAll();
      loading.remove();
    }
  }

  // ── DOM preparation ─────────────────────────────────────────────────────────

  private prepareForCapture(): void {
    const hide = (selector: string) => {
      const el = this.root.querySelector<HTMLElement>(selector);
      if (!el) return;
      this.styles.save(el, ["display"]);
      el.style.display = "none";
    };

    hide(SELECTORS.buttonSection);
    hide(SELECTORS.bookmarkButton);
    hide(SELECTORS.keywordsSection);

    const scrollable = this.root.querySelector<HTMLElement>(
      SELECTORS.scrollableDiv,
    );
    if (scrollable) {
      this.styles.save(scrollable, ["overflowY", "maxHeight"]);
      scrollable.style.overflowY = "visible";
      scrollable.style.maxHeight = "none";
    }

    this.root.querySelectorAll<HTMLElement>("ol").forEach((ol) => {
      this.styles.save(ol, ["listStyleType", "paddingLeft"]);
      ol.style.listStyleType = "decimal";
      ol.style.paddingLeft = "20px";
    });

    this.root.querySelectorAll<HTMLElement>("ol > li").forEach((li) => {
      this.styles.save(li, ["position", "paddingLeft", "marginBottom"]);
      li.style.position = "relative";
      li.style.paddingLeft = "15px";
      li.style.marginBottom = "10px";
    });
  }

  // ── Canvas capture ──────────────────────────────────────────────────────────

  private capture(container: HTMLElement): Promise<HTMLCanvasElement> {
    return window.html2canvas(container, {
      allowTaint: true,
      useCORS: true,
      scale: 2,
      backgroundColor: null,
      logging: false,
      onclone: (doc) => this.patchClone(doc),
    });
  }

  private patchClone(doc: Document): void {
    doc.querySelectorAll<HTMLElement>("ol").forEach((ol) => {
      ol.style.listStyleType = "decimal";
      ol.style.paddingLeft = "40px";
    });

    doc.querySelectorAll<HTMLElement>("li").forEach((li) => {
      li.style.marginBottom = "12px";
      li.style.color = "#374151";
    });

    // Replace oklch colours that html2canvas can't parse.
    const COLOR_FALLBACKS: Record<string, string> = {
      color: "#333333",
      "background-color": "#ffffff",
      "border-color": "#cccccc",
    };

    doc.querySelectorAll<HTMLElement>("*").forEach((el) => {
      const cs = window.getComputedStyle(el);
      for (const [prop, fallback] of Object.entries(COLOR_FALLBACKS)) {
        if (cs.getPropertyValue(prop).includes("oklch")) {
          el.style.setProperty(prop, fallback);
        }
      }
    });
  }

  // ── Gradient container builder ──────────────────────────────────────────────

  private buildGradientContainer(): HTMLElement {
    const container = el("div", {
      width: "1200px",
      minHeight: "800px",
      position: "fixed",
      left: "-9999px",
      top: "-9999px",
      background: "linear-gradient(135deg, #fde047 0%, #fb923c 100%)",
      padding: "60px",
      boxSizing: "border-box",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    });

    const card = el("div", {
      backgroundColor: "white",
      borderRadius: "24px",
      boxShadow: "0 10px 25px -5px rgba(0,0,0,.1)",
      padding: "40px",
      boxSizing: "border-box",
      width: "100%",
      maxWidth: "800px",
    });

    this.populateCard(card);
    container.appendChild(card);
    return container;
  }

  private populateCard(card: HTMLElement): void {
    const clone = this.root.cloneNode(true) as HTMLElement;
    const headerArea = clone.querySelector(SELECTORS.headerArea);
    const mainContent = clone.querySelector<HTMLElement>(SELECTORS.mainContent);

    // Title
    const title = headerArea?.querySelector("h2");
    if (title) {
      const h1 = el("h1", {
        fontSize: "28px",
        fontWeight: "600",
        marginBottom: "10px",
        color: "#111827",
      });
      h1.textContent = title.textContent ?? "";
      card.appendChild(h1);
    }

    // Source
    const source = headerArea?.querySelector<HTMLElement>(SELECTORS.sourceText);
    if (source) {
      const p = el("p", {
        fontSize: "14px",
        color: "#6B7280",
        marginBottom: "20px",
      });
      p.textContent = source.textContent ?? "";
      card.appendChild(p);
    }

    // Divider
    const hr = el("hr", {
      border: "none",
      borderTop: "1px solid #E5E7EB",
      margin: "20px 0",
    });
    card.appendChild(hr);

    // Main content
    if (mainContent) {
      mainContent
        .querySelectorAll("button, [role='button']")
        .forEach((b) => b.remove());

      mainContent.querySelector(SELECTORS.keywordsSection)?.remove();

      mainContent.style.padding = "0";
      mainContent.style.maxHeight = "none";
      mainContent.style.overflowY = "visible";

      card.appendChild(mainContent);
    }

    // Footer
    const footer = el("div", {
      borderTop: "1px solid #E5E7EB",
      paddingTop: "20px",
      marginTop: "30px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    });
    footer.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;line-height:1;">
        <span style="font-size:20px;margin-right:6px;color:#333;">☪</span>
        <span style="font-weight:600;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <span style="color:#000;font-size:17px;">Maktabah</span>
          <span style="color:#8b5cf6;font-size:17px;">Ramadan</span>
        </span>
      </div>`;
    card.appendChild(footer);
  }

  // ── Preview modal ───────────────────────────────────────────────────────────

  private showPreviewModal(dataUrl: string): void {
    const overlay = el("div", {
      position: "fixed",
      inset: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px",
      zIndex: "50",
      backgroundColor: "rgba(0,0,0,.75)",
      backdropFilter: "blur(5px)",
      opacity: "0",
      transition: "opacity .3s ease",
    });

    const panel = el("div", {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 20px 40px rgba(0,0,0,.2)",
      width: "100%",
      maxWidth: "48rem",
      maxHeight: "90vh",
      overflow: "hidden",
      transform: "scale(.95)",
      opacity: "0",
      transition:
        "transform .3s cubic-bezier(.4,0,.2,1), opacity .3s cubic-bezier(.4,0,.2,1)",
    });

    // Header
    const header = el("div", {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 24px",
      borderBottom: "1px solid #F3F4F6",
    });
    header.innerHTML = `
      <h2 style="font-size:1.25rem;font-weight:700;display:flex;align-items:center;gap:6px;">
        <span style="color:#333;">☪</span>
        <span style="color:#000;">Maktabah</span>
        <span style="color:#8b5cf6;">Ramadan</span>
      </h2>`;

    const closeBtn = this.buildCloseButton(() =>
      this.dismissModal(overlay, panel),
    );
    header.appendChild(closeBtn);

    // Body
    const body = el("div", {
      padding: "16px 24px",
      overflowY: "auto",
      maxHeight: "65vh",
    });
    const img = document.createElement("img");
    img.style.cssText =
      "width:100%;border-radius:8px;border:1px solid #E5E7EB;opacity:0;transition:opacity .3s ease;";
    img.onload = () => (img.style.opacity = "1");
    img.src = dataUrl;
    body.appendChild(img);

    // Footer
    const footer = el("div", {
      padding: "12px 24px",
      borderTop: "1px solid #F3F4F6",
      display: "flex",
      gap: "12px",
      justifyContent: "center",
      flexWrap: "wrap",
    });
    footer.appendChild(this.buildDownloadButton(dataUrl));
    if (this.canShare()) footer.appendChild(this.buildShareButton(dataUrl));

    panel.append(header, body, footer);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() =>
      setTimeout(() => {
        overlay.style.opacity = "1";
        panel.style.opacity = "1";
        panel.style.transform = "scale(1)";
      }, 50),
    );
  }

  private dismissModal(overlay: HTMLElement, panel: HTMLElement): void {
    overlay.style.opacity = "0";
    panel.style.transform = "scale(.95)";
    panel.style.opacity = "0";
    setTimeout(() => overlay.remove(), 300);
  }

  private buildCloseButton(onClick: () => void): HTMLElement {
    const btn = el("button", {
      padding: "6px",
      color: "#9CA3AF",
      background: "none",
      border: "none",
      cursor: "pointer",
    });
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>`;
    btn.onclick = onClick;
    return btn;
  }

  private buildDownloadButton(dataUrl: string): HTMLElement {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "hadith-maktabah-ramadan.png";
    a.style.cssText = btnStyle("#4F46E5", "#fff");
    a.innerHTML = `${downloadIcon()} Download Image`;
    return a;
  }

  private buildShareButton(dataUrl: string): HTMLElement {
    const btn = el("button", {});
    btn.style.cssText = btnStyle("#F3F4F6", "#374151");
    btn.innerHTML = `${shareIcon()} Share`;
    btn.onclick = async () => {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "hadith-maktabah-ramadan.png", {
          type: "image/png",
        });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            title: "Hadith from Maktabah Ramadan",
            files: [file],
          });
        } else {
          alert(
            "Sharing is not supported in this browser. Please download instead.",
          );
        }
      } catch (err) {
        console.error("Share error:", err);
      }
    };
    return btn;
  }

  // ── Utilities ───────────────────────────────────────────────────────────────

  private canShare(): boolean {
    return (
      !!navigator.share ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    );
  }

  private showLoading(): HTMLElement {
    const div = el("div", {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      padding: "15px 25px",
      backgroundColor: "rgba(0,0,0,.7)",
      color: "white",
      borderRadius: "8px",
      zIndex: "99999",
      fontSize: "14px",
      fontWeight: "500",
    });
    div.textContent = "Generating image…";
    document.body.appendChild(div);
    return div;
  }

  private async ensureHtml2Canvas(): Promise<void> {
    if (window.html2canvas !== undefined) return;
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ─── Standalone helpers ────────────────────────────────────────────────────────

/** Creates an HTMLElement with inline styles applied. */
function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  styles: Partial<CSSStyleDeclaration>,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  Object.assign(element.style, styles);
  return element;
}

function btnStyle(bg: string, color: string): string {
  return `display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:${bg};color:${color};font-weight:500;border-radius:8px;font-size:14px;cursor:pointer;border:none;text-decoration:none;`;
}

function downloadIcon(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>`;
}

function shareIcon(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>`;
}

// ─── Convenience wrapper (drop-in replacement for the old function) ────────────

export const directDownload = (
  modalRef: React.RefObject<HTMLDivElement | null>,
): Promise<void> => new ImageDownloader(modalRef).download();
