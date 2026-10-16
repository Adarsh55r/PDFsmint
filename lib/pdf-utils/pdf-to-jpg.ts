"use client";

import type { NamedBlob } from "@/lib/download";
import { ToolError } from "@/lib/tool-error";
import type { ProgressCallback } from "@/lib/processing";

export type PdfImageFormat = "jpeg" | "png";

/** Max pages processed in-browser — guards against memory exhaustion. */
const MAX_PAGES = 150;

export type PdfToJpgOptions = {
  format: PdfImageFormat;
  /** Render scale. Higher = sharper & larger. Default 2. */
  scale?: number;
  /** JPEG quality 0–1. Default 0.85. */
  quality?: number;
};

async function loadPdfJs() {
  // Legacy build: it bundles polyfills (e.g. Map.prototype.getOrInsertComputed)
  // that the modern build assumes. Without them rendering fails on browsers
  // that don't ship those built-ins yet. Worker in /public must match.
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjs;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: PdfImageFormat,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Encode failed"))),
      format === "png" ? "image/png" : "image/jpeg",
      format === "png" ? undefined : quality,
    );
  });
}

/** Render each PDF page to an image (JPG or PNG) entirely in the browser. */
export async function pdfToImages(
  file: File,
  options: PdfToJpgOptions,
  onProgress?: ProgressCallback,
): Promise<NamedBlob[]> {
  const scale = options.scale ?? 2;
  const quality = options.quality ?? 0.85;
  const ext = options.format === "png" ? "png" : "jpg";
  const baseName = file.name.replace(/\.pdf$/i, "");

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

  const results: NamedBlob[] = [];

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) {
      throw new ToolError(
        "PROCESSING_FAILED",
        "Your browser could not initialise image rendering. Try another browser.",
      );
    }

    if (options.format === "jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    await page.render({ canvasContext: context, viewport, canvas }).promise;
    const blob = await canvasToBlob(canvas, options.format, quality);
    results.push({
      name: `${baseName}-page-${i}.${ext}`,
      blob,
    });

    page.cleanup();
    onProgress?.(Math.round((i / pageCount) * 100));
  }

  await loadingTask.destroy();
  return results;
}
