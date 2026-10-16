"use client";

import type { PDFDocument } from "pdf-lib";

import { ToolError } from "@/lib/tool-error";
import type { ProgressCallback } from "@/lib/processing";

/** Max pages rendered for signing — protects browser memory. */
export const MAX_SIGN_PAGES = 150;

/** Target preview width in CSS pixels (height scales with aspect). */
export const PREVIEW_TARGET_WIDTH = 720;

export type SignPagePreview = {
  pageIndex: number;
  dataUrl: string;
  canvasWidth: number;
  canvasHeight: number;
  pdfWidth: number;
  pdfHeight: number;
  /** canvasWidth / pdfWidth */
  scale: number;
};

export type SignaturePlacement = {
  id: string;
  pageIndex: number;
  /** Top-left position in preview canvas pixels. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Transparent PNG data URL. */
  imageDataUrl: string;
  kind: "signature" | "date";
};

export type SignPdfResult = {
  blob: Blob;
  fileName: string;
  placementCount: number;
};

async function loadPdfJs() {
  // Legacy build: it bundles polyfills (e.g. Map.prototype.getOrInsertComputed)
  // that the modern build assumes. Without them rendering fails on browsers
  // that don't ship those built-ins yet. Worker in /public must match.
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjs;
}

function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(() => resolve(), { timeout: 80 });
    } else {
      setTimeout(resolve, 0);
    }
  });
}

/**
 * Render PDF pages progressively for the signing UI.
 * Calls `onPage` as each page is ready so the UI can stream in previews.
 */
export async function loadSignPagePreviews(
  file: File,
  onProgress?: ProgressCallback,
  onPage?: (page: SignPagePreview, done: number, total: number) => void,
): Promise<SignPagePreview[]> {
  const pdfjs = await loadPdfJs();

  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await file.arrayBuffer());
  } catch {
    throw new ToolError(
      "MEMORY_LIMIT",
      "Could not read this file — it may be too large.",
    );
  }

  // pdf.js may detach the buffer — keep a copy for later pdf-lib use is separate.
  const loadingTask = pdfjs.getDocument({ data: bytes.slice(0) });
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
    throw new ToolError(
      "INVALID_FILE",
      "This file could not be read as a valid PDF.",
    );
  }

  const pageCount = pdf.numPages;
  if (pageCount === 0) {
    await loadingTask.destroy();
    throw new ToolError("EMPTY_INPUT", "This PDF has no pages.");
  }
  if (pageCount > MAX_SIGN_PAGES) {
    await loadingTask.destroy();
    throw new ToolError(
      "TOO_MANY_PAGES",
      `This PDF has ${pageCount} pages. Please use a file with ${MAX_SIGN_PAGES} pages or fewer.`,
    );
  }

  const pages: SignPagePreview[] = [];

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = PREVIEW_TARGET_WIDTH / baseViewport.width;
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

    const preview: SignPagePreview = {
      pageIndex: i - 1,
      dataUrl: canvas.toDataURL("image/jpeg", 0.82),
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      pdfWidth: baseViewport.width,
      pdfHeight: baseViewport.height,
      scale,
    };

    pages.push(preview);
    onPage?.(preview, i, pageCount);
    onProgress?.(Math.round((i / pageCount) * 100));
    page.cleanup();

    // Yield between pages so large PDFs stay responsive.
    if (pageCount > 8 && i < pageCount) {
      await yieldToMain();
    }
  }

  await loadingTask.destroy();
  return pages;
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1];
  if (!base64) {
    throw new ToolError(
      "PROCESSING_FAILED",
      "Could not read a signature image. Try creating it again.",
    );
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Embed placed signatures into the PDF with pdf-lib.
 * Preview coords are top-left origin; PDF coords are bottom-left — Y is flipped.
 */
export async function applySignaturesToPdf(
  file: File,
  placements: SignaturePlacement[],
  pageMeta: Pick<
    SignPagePreview,
    "pageIndex" | "canvasWidth" | "canvasHeight" | "pdfWidth" | "pdfHeight"
  >[],
  onProgress?: ProgressCallback,
): Promise<SignPdfResult> {
  // Loaded on demand so pdf-lib stays out of the initial page bundle.
  const { PDFDocument } = await import("pdf-lib");
  if (placements.length === 0) {
    throw new ToolError(
      "EMPTY_INPUT",
      "Place at least one signature or date stamp before downloading.",
    );
  }

  onProgress?.(5);

  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await file.arrayBuffer());
  } catch {
    throw new ToolError(
      "MEMORY_LIMIT",
      "Could not read this file — it may be too large.",
    );
  }

  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(bytes, { ignoreEncryption: false });
  } catch (error) {
    const msg = error instanceof Error ? error.message.toLowerCase() : "";
    if (msg.includes("encrypt") || msg.includes("password")) {
      throw new ToolError(
        "PASSWORD_PROTECTED",
        "This PDF is password-protected. Remove the password and try again.",
      );
    }
    throw new ToolError(
      "INVALID_FILE",
      "This file could not be read as a valid PDF.",
    );
  }

  onProgress?.(15);

  const metaByPage = new Map(pageMeta.map((p) => [p.pageIndex, p]));
  const imageCache = new Map<string, Awaited<ReturnType<PDFDocument["embedPng"]>>>();

  for (let i = 0; i < placements.length; i++) {
    const placement = placements[i]!;
    const meta = metaByPage.get(placement.pageIndex);
    const page = doc.getPage(placement.pageIndex);

    if (!meta || !page) {
      throw new ToolError(
        "PROCESSING_FAILED",
        `Could not place a signature on page ${placement.pageIndex + 1}.`,
      );
    }

    let embedded = imageCache.get(placement.imageDataUrl);
    if (!embedded) {
      const pngBytes = dataUrlToUint8Array(placement.imageDataUrl);
      embedded = await doc.embedPng(pngBytes);
      imageCache.set(placement.imageDataUrl, embedded);
    }

    const scaleX = meta.pdfWidth / meta.canvasWidth;
    const scaleY = meta.pdfHeight / meta.canvasHeight;
    const drawW = placement.width * scaleX;
    const drawH = placement.height * scaleY;
    const drawX = placement.x * scaleX;
    // Flip Y: canvas top-left → PDF bottom-left
    const drawY = meta.pdfHeight - placement.y * scaleY - drawH;

    page.drawImage(embedded, {
      x: drawX,
      y: drawY,
      width: drawW,
      height: drawH,
    });

    onProgress?.(
      Math.min(90, Math.round(20 + ((i + 1) / placements.length) * 70)),
    );
  }

  const outputBytes = await doc.save({ useObjectStreams: true });
  onProgress?.(100);

  const baseName = file.name.replace(/\.pdf$/i, "") || "document";

  return {
    blob: new Blob([new Uint8Array(outputBytes)], { type: "application/pdf" }),
    fileName: `${baseName}-signed.pdf`,
    placementCount: placements.length,
  };
}

/** Render typed text to a transparent PNG data URL. */
export async function renderTextToPngDataUrl(options: {
  text: string;
  fontFamily: string;
  fontSize?: number;
  color?: string;
}): Promise<{ dataUrl: string; width: number; height: number }> {
  const text = options.text.trim();
  if (!text) {
    throw new ToolError("EMPTY_INPUT", "Enter some text for your signature.");
  }

  // Ensure webfonts are ready before measuring.
  if (typeof document !== "undefined" && document.fonts?.ready) {
    await document.fonts.ready;
  }

  const fontSize = options.fontSize ?? 64;
  const color = options.color ?? "#111827";
  const font = `700 ${fontSize}px ${options.fontFamily}, cursive`;

  const measure = document.createElement("canvas");
  const mctx = measure.getContext("2d");
  if (!mctx) {
    throw new ToolError(
      "PROCESSING_FAILED",
      "Your browser could not render the signature text.",
    );
  }
  mctx.font = font;
  const metrics = mctx.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const ascent = Math.ceil(
    metrics.actualBoundingBoxAscent || fontSize * 0.8,
  );
  const descent = Math.ceil(
    metrics.actualBoundingBoxDescent || fontSize * 0.3,
  );
  const pad = Math.ceil(fontSize * 0.25);
  const width = Math.max(1, textWidth + pad * 2);
  const height = Math.max(1, ascent + descent + pad * 2);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new ToolError(
      "PROCESSING_FAILED",
      "Your browser could not render the signature text.",
    );
  }
  ctx.clearRect(0, 0, width, height);
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, pad, pad + ascent);

  return {
    dataUrl: canvas.toDataURL("image/png"),
    width,
    height,
  };
}

/** Load an uploaded image as a PNG data URL (keeps transparency if present). */
export async function imageFileToPngDataUrl(
  file: File,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!allowed.includes(file.type) && !/\.(png|jpe?g|webp)$/i.test(file.name)) {
    throw new ToolError(
      "INVALID_FILE",
      "Please upload a PNG, JPG, or WebP image for your signature.",
    );
  }

  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new ToolError(
        "PROCESSING_FAILED",
        "Your browser could not process this image.",
      );
    }
    ctx.drawImage(bitmap, 0, 0);
    return {
      dataUrl: canvas.toDataURL("image/png"),
      width: canvas.width,
      height: canvas.height,
    };
  } finally {
    bitmap.close();
  }
}

/** Format today's date for stamp overlays (locale-friendly short form). */
export function formatSignatureDate(date = new Date()): string {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
