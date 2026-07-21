"use client";

import { ToolError } from "@/lib/tool-error";
import type { ProgressCallback } from "@/lib/processing";

export type WordToPdfResult = {
  blob: Blob;
  fileName: string;
};

const RENDER_WIDTH_PX = 794; // ~A4 width at 96dpi
const MARGIN_PT = 40;

const PRINT_STYLES = `
  * { box-sizing: border-box; }
  body-render { display: block; }
  h1 { font-size: 22pt; margin: 0 0 12pt; font-weight: 700; }
  h2 { font-size: 17pt; margin: 16pt 0 8pt; font-weight: 700; }
  h3 { font-size: 14pt; margin: 14pt 0 6pt; font-weight: 700; }
  p { margin: 0 0 10pt; }
  ul, ol { margin: 0 0 10pt 20pt; padding: 0; }
  li { margin: 0 0 4pt; }
  table { width: 100%; border-collapse: collapse; margin: 0 0 12pt; }
  td, th { border: 1px solid #999; padding: 5px 7px; text-align: left; vertical-align: top; }
  img { max-width: 100%; height: auto; }
  strong { font-weight: 700; }
  em { font-style: italic; }
`;

/**
 * Convert a Word (.docx) document to PDF entirely in the browser.
 *
 * Approach: mammoth extracts the document into semantic HTML (headings, lists,
 * tables, bold/italic, and embedded images), which is then rendered to PDF.
 *
 * LIMITATION: this reproduces common Office formatting well, but it is not a
 * pixel-perfect Word renderer. Complex layouts, precise fonts, headers/footers,
 * and exotic styling may differ. Only the modern .docx format is supported
 * (legacy .doc files must be re-saved as .docx first).
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
    throw new ToolError("MEMORY_LIMIT", "Could not read this file — it may be too large.");
  }

  const mammoth = await import("mammoth");
  let html: string;
  try {
    const result = await mammoth.convertToHtml({ arrayBuffer });
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

  onProgress?.(45);

  const { jsPDF } = await import("jspdf");
  const html2canvas = (await import("html2canvas")).default;

  const container = document.createElement("div");
  container.innerHTML = `<style>${PRINT_STYLES}</style>${html}`;
  Object.assign(container.style, {
    width: `${RENDER_WIDTH_PX}px`,
    position: "fixed",
    left: "0",
    top: "0",
    zIndex: "-1",
    opacity: "0",
    pointerEvents: "none",
    background: "#ffffff",
    color: "#111111",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSize: "12pt",
    lineHeight: "1.5",
    padding: "0",
  } as CSSStyleDeclaration);
  document.body.appendChild(container);

  try {
    // Render the document to a single tall canvas, then slice it into A4 pages.
    // This is far more reliable than jsPDF's built-in .html(), which often
    // produces blank output for off-screen containers.
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      windowWidth: RENDER_WIDTH_PX,
      width: RENDER_WIDTH_PX,
    });

    if (!canvas.width || !canvas.height) {
      throw new Error("Empty render");
    }

    onProgress?.(75);

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidthPt = doc.internal.pageSize.getWidth();
    const pageHeightPt = doc.internal.pageSize.getHeight();
    const contentWidthPt = pageWidthPt - MARGIN_PT * 2;
    const contentHeightPt = pageHeightPt - MARGIN_PT * 2;

    // Canvas pixels per PDF point (based on fitting canvas width to content width).
    const pxPerPt = canvas.width / contentWidthPt;
    const pageSliceHeightPx = Math.floor(contentHeightPt * pxPerPt);

    let renderedPx = 0;
    let pageIndex = 0;

    while (renderedPx < canvas.height) {
      const sliceHeightPx = Math.min(
        pageSliceHeightPx,
        canvas.height - renderedPx,
      );

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeightPx;
      const ctx = pageCanvas.getContext("2d");
      if (!ctx) {
        throw new Error("Canvas context unavailable");
      }
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

    onProgress?.(95);
    const blob = doc.output("blob");
    onProgress?.(100);

    return {
      blob,
      fileName: file.name.replace(/\.docx?$/i, "") + ".pdf",
    };
  } catch {
    throw new ToolError(
      "PROCESSING_FAILED",
      "We couldn't render this document to PDF. Try simplifying its layout and retry.",
    );
  } finally {
    document.body.removeChild(container);
  }
}
