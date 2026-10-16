"use client";


import { ToolError } from "@/lib/tool-error";
import type { ProgressCallback } from "@/lib/processing";

export type PageThumbnail = {
  /** Index of the page in the original document (0-based). */
  originalIndex: number;
  /** Data URL of the rendered thumbnail. */
  thumbnail: string;
};

export type LoadedPdf = {
  pageCount: number;
  thumbnails: PageThumbnail[];
};

export type EditedPage = {
  originalIndex: number;
  /** Extra clockwise rotation to apply, in degrees (0/90/180/270). */
  rotation: number;
};

/** Max pages we render previews for in-browser — guards against memory exhaustion. */
const MAX_PAGES = 150;

async function loadPdfJs() {
  // Legacy build: it bundles polyfills (e.g. Map.prototype.getOrInsertComputed)
  // that the modern build assumes. Without them rendering fails on browsers
  // that don't ship those built-ins yet. Worker in /public must match.
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjs;
}

/** Render small preview thumbnails for every page of a PDF. */
export async function loadPdfThumbnails(
  file: File,
  onProgress?: ProgressCallback,
): Promise<LoadedPdf> {
  const pdfjs = await loadPdfJs();

  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await file.arrayBuffer());
  } catch {
    throw new ToolError("MEMORY_LIMIT", "Could not read this file — it may be too large.");
  }

  const loadingTask = pdfjs.getDocument({ data: bytes });
  let pdf;
  try {
    pdf = await loadingTask.promise;
  } catch (error) {
    const msg = error instanceof Error ? error.message.toLowerCase() : "";
    if (msg.includes("password") || msg.includes("encrypt")) {
      throw new ToolError(
        "PASSWORD_PROTECTED",
        "This PDF is password-protected. Remove the password and try again.",
      );
    }
    throw new ToolError("INVALID_FILE", "This file could not be read as a valid PDF.");
  }

  const pageCount = pdf.numPages;

  if (pageCount > MAX_PAGES) {
    await loadingTask.destroy();
    throw new ToolError(
      "TOO_MANY_PAGES",
      `This PDF has ${pageCount} pages. Please use a file with ${MAX_PAGES} pages or fewer.`,
    );
  }

  const thumbnails: PageThumbnail[] = [];

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const baseViewport = page.getViewport({ scale: 1 });
    const targetWidth = 200;
    const scale = targetWidth / baseViewport.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) {
      throw new ToolError(
        "PROCESSING_FAILED",
        "Your browser could not render page previews. Try another browser.",
      );
    }
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: context, viewport, canvas }).promise;

    thumbnails.push({
      originalIndex: i - 1,
      thumbnail: canvas.toDataURL("image/jpeg", 0.7),
    });

    page.cleanup();
    onProgress?.(Math.round((i / pageCount) * 100));
  }

  await loadingTask.destroy();
  return { pageCount, thumbnails };
}

/**
 * Rebuild a PDF from an ordered list of pages, applying per-page rotation and
 * dropping any pages the user removed. Uses pdf-lib so text stays selectable.
 */
export async function saveEditedPdf(
  file: File,
  pages: EditedPage[],
  onProgress?: ProgressCallback,
): Promise<Blob> {
  // Loaded on demand so pdf-lib stays out of the initial page bundle.
  const { degrees, PDFDocument } = await import("pdf-lib");
  if (pages.length === 0) {
    throw new ToolError(
      "EMPTY_INPUT",
      "You've removed every page. Keep at least one page to save.",
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const source = await PDFDocument.load(bytes, { ignoreEncryption: false });
  const out = await PDFDocument.create();
  onProgress?.(10);

  const indices = pages.map((p) => p.originalIndex);
  const copied = await out.copyPages(source, indices);

  copied.forEach((page, i) => {
    const extra = pages[i]!.rotation % 360;
    if (extra !== 0) {
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + extra) % 360));
    }
    out.addPage(page);
    onProgress?.(10 + Math.round(((i + 1) / copied.length) * 85));
  });

  const outBytes = await out.save({ useObjectStreams: true });
  onProgress?.(100);
  return new Blob([new Uint8Array(outBytes)], { type: "application/pdf" });
}
