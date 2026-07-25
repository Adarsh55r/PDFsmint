"use client";

import { ToolError } from "@/lib/tool-error";
import type { ProgressCallback } from "@/lib/processing";

export type WordToPdfResult = {
  blob: Blob;
  fileName: string;
};

const RENDER_WIDTH_PX = 794; // ~A4 width at 96dpi
const MARGIN_PT = 48;
const PAGE_WIDTH_PT = 595.28; // A4
const PAGE_HEIGHT_PT = 841.89;

const PRINT_STYLES = `
  .pdfsmint-word-render, .pdfsmint-word-render * { box-sizing: border-box; }
  .pdfsmint-word-render {
    color: #111111 !important;
    background: #ffffff !important;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.55;
  }
  .pdfsmint-word-render h1 { font-size: 22pt; margin: 0 0 12pt; font-weight: 700; color: #111 !important; }
  .pdfsmint-word-render h2 { font-size: 17pt; margin: 16pt 0 8pt; font-weight: 700; color: #111 !important; }
  .pdfsmint-word-render h3 { font-size: 14pt; margin: 14pt 0 6pt; font-weight: 700; color: #111 !important; }
  .pdfsmint-word-render p { margin: 0 0 10pt; color: #111 !important; }
  .pdfsmint-word-render ul, .pdfsmint-word-render ol { margin: 0 0 10pt 22pt; padding: 0; }
  .pdfsmint-word-render li { margin: 0 0 4pt; color: #111 !important; }
  .pdfsmint-word-render table { width: 100%; border-collapse: collapse; margin: 0 0 12pt; }
  .pdfsmint-word-render td, .pdfsmint-word-render th {
    border: 1px solid #999; padding: 5px 7px; text-align: left; vertical-align: top; color: #111 !important;
  }
  .pdfsmint-word-render img { max-width: 100%; height: auto; display: block; }
  .pdfsmint-word-render strong { font-weight: 700; }
  .pdfsmint-word-render em { font-style: italic; }
  .pdfsmint-word-render a { color: #111 !important; text-decoration: underline; }
`;

function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));
  if (images.length === 0) return Promise.resolve();

  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
          // Safety timeout so a stuck image never hangs conversion.
          window.setTimeout(done, 4000);
        }),
    ),
  ).then(() => undefined);
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

/** Returns true when the canvas is essentially blank/white. */
function isBlankCanvas(canvas: HTMLCanvasElement): boolean {
  if (!canvas.width || !canvas.height) return true;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return true;

  const sampleW = Math.min(canvas.width, 120);
  const sampleH = Math.min(canvas.height, 120);
  const data = ctx.getImageData(0, 0, sampleW, sampleH).data;

  let nonWhite = 0;
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i] ?? 255;
    const g = data[i + 1] ?? 255;
    const b = data[i + 2] ?? 255;
    const a = data[i + 3] ?? 255;
    if (a > 8 && (r < 250 || g < 250 || b < 250)) {
      nonWhite += 1;
      if (nonWhite > 8) return false;
    }
  }
  return true;
}

async function renderHtmlToPdfBlob(
  html: string,
  onProgress?: ProgressCallback,
): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const html2canvas = (await import("html2canvas")).default;

  const host = document.createElement("div");
  host.setAttribute("data-pdfsmint-word-host", "true");
  // Keep fully opaque and in the layout tree. Off-screen with opacity:0 is a
  // common cause of blank html2canvas captures.
  Object.assign(host.style, {
    position: "fixed",
    left: "0",
    top: "0",
    width: `${RENDER_WIDTH_PX}px`,
    margin: "0",
    padding: "24px",
    background: "#ffffff",
    color: "#111111",
    opacity: "1",
    visibility: "visible",
    pointerEvents: "none",
    zIndex: "-1",
    transform: "translateX(-110vw)",
    overflow: "visible",
  } as CSSStyleDeclaration);

  const styleEl = document.createElement("style");
  styleEl.textContent = PRINT_STYLES;

  const content = document.createElement("div");
  content.className = "pdfsmint-word-render";
  content.innerHTML = html;

  host.appendChild(styleEl);
  host.appendChild(content);
  document.body.appendChild(host);

  try {
    await waitForImages(content);
    // Force layout so dimensions are real before capture.
    void host.offsetHeight;
    await nextFrame();

    onProgress?.(55);

    const canvas = await html2canvas(content, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      allowTaint: true,
      logging: false,
      imageTimeout: 5000,
      windowWidth: RENDER_WIDTH_PX,
      width: content.scrollWidth || RENDER_WIDTH_PX,
      height: Math.max(content.scrollHeight, content.offsetHeight, 1),
      onclone: (clonedDoc) => {
        const cloned = clonedDoc.querySelector(
          ".pdfsmint-word-render",
        ) as HTMLElement | null;
        if (!cloned) return;
        cloned.style.opacity = "1";
        cloned.style.visibility = "visible";
        cloned.style.color = "#111111";
        cloned.style.background = "#ffffff";
        cloned.style.transform = "none";
        cloned.style.position = "static";
      },
    });

    if (isBlankCanvas(canvas)) {
      throw new Error("BLANK_CANVAS");
    }

    onProgress?.(75);

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const contentWidthPt = PAGE_WIDTH_PT - MARGIN_PT * 2;
    const contentHeightPt = PAGE_HEIGHT_PT - MARGIN_PT * 2;
    const pxPerPt = canvas.width / contentWidthPt;
    const pageSliceHeightPx = Math.max(1, Math.floor(contentHeightPt * pxPerPt));

    let renderedPx = 0;
    let pageIndex = 0;

    while (renderedPx < canvas.height) {
      const sliceHeightPx = Math.min(
        pageSliceHeightPx,
        canvas.height - renderedPx,
      );

      // Skip trailing near-empty slices that would create blank trailing pages.
      if (sliceHeightPx < 2) break;

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeightPx;
      const ctx = pageCanvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context unavailable");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        canvas,
        0,
        renderedPx,
        canvas.width,
        sliceHeightPx,
        0,
        0,
        canvas.width,
        sliceHeightPx,
      );

      const imgData = pageCanvas.toDataURL("image/jpeg", 0.92);
      const sliceHeightPt = sliceHeightPx / pxPerPt;

      if (pageIndex > 0) doc.addPage();
      doc.addImage(
        imgData,
        "JPEG",
        MARGIN_PT,
        MARGIN_PT,
        contentWidthPt,
        sliceHeightPt,
      );

      renderedPx += sliceHeightPx;
      pageIndex += 1;
    }

    if (pageIndex === 0) {
      throw new Error("BLANK_CANVAS");
    }

    return doc.output("blob");
  } finally {
    host.remove();
  }
}

/**
 * Text fallback when canvas capture fails — still produces a usable PDF with
 * the document's readable content (formatting is simplified).
 */
async function renderTextFallbackToPdfBlob(
  arrayBuffer: ArrayBuffer,
  onProgress?: ProgressCallback,
): Promise<Blob> {
  const mammoth = await import("mammoth");
  const { jsPDF } = await import("jspdf");

  const { value: rawText } = await mammoth.extractRawText({ arrayBuffer });
  const text = rawText.replace(/\r\n/g, "\n").trim();
  if (!text) {
    throw new ToolError("EMPTY_INPUT", "This document appears to be empty.");
  }

  onProgress?.(70);

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const maxWidth = PAGE_WIDTH_PT - MARGIN_PT * 2;
  const lineHeight = 16;
  let y = MARGIN_PT;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(17, 17, 17);

  const paragraphs = text.split(/\n{2,}/);

  for (const paragraph of paragraphs) {
    const cleaned = paragraph.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
    if (!cleaned) continue;

    const lines = doc.splitTextToSize(cleaned, maxWidth) as string[];
    for (const line of lines) {
      if (y + lineHeight > PAGE_HEIGHT_PT - MARGIN_PT) {
        doc.addPage();
        y = MARGIN_PT;
      }
      doc.text(line, MARGIN_PT, y);
      y += lineHeight;
    }
    y += lineHeight * 0.6;
  }

  onProgress?.(95);
  return doc.output("blob");
}

/**
 * Convert a Word (.docx) document to PDF entirely in the browser.
 *
 * Approach: mammoth → HTML → canvas pages → PDF. If the browser cannot capture
 * the HTML visually, falls back to a plain-text PDF so the user still gets
 * their content.
 *
 * LIMITATION: not a pixel-perfect Word renderer. Complex layouts, headers,
 * footers, and exotic fonts may differ. Legacy .doc is not supported.
 */
export async function wordToPdf(
  file: File,
  onProgress?: ProgressCallback,
): Promise<WordToPdfResult> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".doc") && !name.endsWith(".docx")) {
    throw new ToolError(
      "INVALID_FILE",
      "Legacy .doc files aren't supported. Open it in Word and save as .docx first.",
    );
  }

  onProgress?.(10);

  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch {
    throw new ToolError(
      "MEMORY_LIMIT",
      "Could not read this file — it may be too large.",
    );
  }

  // Keep a copy — some browsers detach the buffer during mammoth parsing.
  const bufferForHtml = arrayBuffer.slice(0);
  const bufferForFallback = arrayBuffer.slice(0);

  const mammoth = await import("mammoth");
  let html: string;
  try {
    const result = await mammoth.convertToHtml({ arrayBuffer: bufferForHtml });
    html = result.value;
  } catch {
    throw new ToolError(
      "INVALID_FILE",
      "This file could not be read as a Word document. Make sure it's a valid .docx.",
    );
  }

  if (!html.trim()) {
    throw new ToolError("EMPTY_INPUT", "This document appears to be empty.");
  }

  onProgress?.(40);

  let blob: Blob;
  try {
    blob = await renderHtmlToPdfBlob(html, onProgress);
  } catch {
    // Visual capture failed (common with opacity/off-screen quirks) — still
    // deliver the document content via the text fallback.
    blob = await renderTextFallbackToPdfBlob(bufferForFallback, onProgress);
  }

  onProgress?.(100);

  return {
    blob,
    fileName: file.name.replace(/\.docx?$/i, "") + ".pdf",
  };
}
