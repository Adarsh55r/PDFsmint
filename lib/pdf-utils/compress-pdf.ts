"use client";

import type { ProgressCallback } from "@/lib/processing";

export type PdfCompressionErrorCode =
  | "INVALID_FILE"
  | "PASSWORD_PROTECTED"
  | "TOO_MANY_PAGES"
  | "MEMORY_LIMIT"
  | "PROCESSING_FAILED";

export class PdfCompressionError extends Error {
  readonly code: PdfCompressionErrorCode;

  constructor(code: PdfCompressionErrorCode, message: string) {
    super(message);
    this.name = "PdfCompressionError";
    this.code = code;
  }
}

/**
 * Compression presets. Higher `scale` = higher render DPI = sharper output.
 * The old single mode rendered at scale 1.35 (~97 DPI), which is what made
 * text look blurry. Every preset here renders at a noticeably higher DPI so
 * output stays crisp; `quality` controls how aggressively images are squeezed.
 */
export type CompressionLevel = "low" | "standard" | "extreme";

export const LEVEL_SETTINGS: Record<
  CompressionLevel,
  { scale: number; quality: number }
> = {
  // Highest fidelity — ~144 DPI, light JPEG compression.
  low: { scale: 2.0, quality: 0.85 },
  // Balanced — ~130 DPI.
  standard: { scale: 1.8, quality: 0.72 },
  // Smallest — ~108 DPI, stronger JPEG compression.
  extreme: { scale: 1.5, quality: 0.5 },
};

export type CompressPdfOptions = {
  /** Compression preset. Default "standard". */
  level?: CompressionLevel;
  /** Override JPEG quality when rasterizing pages (0–1). */
  quality?: number;
  /** Override render scale factor (higher = sharper & larger). */
  scale?: number;
  /** Maximum pages processed in-browser. Default 150 */
  maxPages?: number;
};

export type CompressPdfResult = {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  /** Which preset was used. */
  level: CompressionLevel;
  /** How the smallest output was produced. "original" = file was already optimal. */
  method: "rasterize" | "optimize" | "original";
};

const DEFAULT_MAX_PAGES = 150;

/**
 * Only accept the rasterized (potentially softer) output when it saves at least
 * this fraction MORE than the lossless, text-preserving option. This keeps
 * vector/text PDFs perfectly sharp while still compressing image-heavy files.
 */
const RASTER_ADVANTAGE_THRESHOLD = 0.05;

async function loadPdfJs() {
  // Legacy build: it bundles polyfills (e.g. Map.prototype.getOrInsertComputed)
  // that the modern build assumes. Without them rendering fails on browsers
  // that don't ship those built-ins yet. Worker in /public must match.
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjs;
}

async function canvasToJpegBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to encode JPEG"));
      },
      "image/jpeg",
      quality,
    );
  });
}

async function optimizeWithPdfLib(bytes: Uint8Array): Promise<Uint8Array> {
  // Loaded on demand so pdf-lib stays out of the initial page bundle.
  const { PDFDocument } = await import("pdf-lib");
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: false });
  return doc.save({ useObjectStreams: true });
}

type RasterOptions = { scale: number; quality: number; maxPages: number };

async function rasterizePdf(
  bytes: Uint8Array,
  options: RasterOptions,
  onProgress?: ProgressCallback,
): Promise<Uint8Array> {
  // Loaded on demand so pdf-lib stays out of the initial page bundle.
  const { PDFDocument } = await import("pdf-lib");
  const pdfjs = await loadPdfJs();
  // pdf.js transfers (detaches) the ArrayBuffer it is given. Hand it a copy so
  // the caller's original `bytes` stay usable (e.g. as the "original" fallback).
  const loadingTask = pdfjs.getDocument({ data: bytes.slice(0) });
  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;

  if (pageCount > options.maxPages) {
    throw new PdfCompressionError(
      "TOO_MANY_PAGES",
      `This PDF has ${pageCount} pages. Please use a file with ${options.maxPages} pages or fewer.`,
    );
  }

  const outputDoc = await PDFDocument.create();

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: options.scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const context = canvas.getContext("2d");
    if (!context) {
      throw new PdfCompressionError(
        "PROCESSING_FAILED",
        "Your browser could not initialize image processing. Try a different browser.",
      );
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: context, viewport, canvas }).promise;

    const jpegBlob = await canvasToJpegBlob(canvas, options.quality);
    const jpegBytes = new Uint8Array(await jpegBlob.arrayBuffer());
    const image = await outputDoc.embedJpg(jpegBytes);

    const pdfPage = outputDoc.addPage([canvas.width, canvas.height]);
    pdfPage.drawImage(image, {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    });

    page.cleanup();
    onProgress?.(Math.round((i / pageCount) * 100));
  }

  await loadingTask.destroy();
  return outputDoc.save({ useObjectStreams: true });
}

function mapPdfJsError(error: unknown): PdfCompressionError {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error);

  if (
    message.includes("password") ||
    message.includes("encrypted") ||
    message.includes("need a password")
  ) {
    return new PdfCompressionError(
      "PASSWORD_PROTECTED",
      "This PDF is password-protected. Remove the password and try again.",
    );
  }

  if (
    message.includes("invalid pdf") ||
    message.includes("corrupt") ||
    message.includes("format error") ||
    message.includes("missing pdf")
  ) {
    return new PdfCompressionError(
      "INVALID_FILE",
      "This file does not appear to be a valid PDF. Try a different file.",
    );
  }

  if (
    message.includes("memory") ||
    message.includes("allocation") ||
    message.includes("out of memory")
  ) {
    return new PdfCompressionError(
      "MEMORY_LIMIT",
      "This file is too large for your browser to process. Try a smaller PDF or close other tabs.",
    );
  }

  return new PdfCompressionError(
    "PROCESSING_FAILED",
    "We couldn't compress this PDF. The file may be unsupported or damaged.",
  );
}

/**
 * Compress a PDF entirely in the browser by re-rendering pages as optimized JPEGs
 * and rebuilding the document with pdf-lib. Falls back to pdf-lib stream optimization
 * when that produces a smaller file (common for text-heavy PDFs).
 */
export async function compressPdf(
  file: File,
  onProgress?: ProgressCallback,
  options?: CompressPdfOptions,
): Promise<CompressPdfResult> {
  const level = options?.level ?? "standard";
  const preset = LEVEL_SETTINGS[level];
  const rasterOpts: RasterOptions = {
    scale: options?.scale ?? preset.scale,
    quality: options?.quality ?? preset.quality,
    maxPages: options?.maxPages ?? DEFAULT_MAX_PAGES,
  };
  const originalSize = file.size;

  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await file.arrayBuffer());
  } catch {
    throw new PdfCompressionError(
      "MEMORY_LIMIT",
      "Could not read this file. It may be too large for available memory.",
    );
  }

  onProgress?.(5);

  // Lossless path: re-pack streams with pdf-lib. Keeps text/vectors perfectly
  // sharp. Reductions are usually modest but there is zero quality loss.
  let optimizedBytes: Uint8Array | null = null;
  try {
    optimizedBytes = await optimizeWithPdfLib(bytes);
  } catch (error) {
    const mapped = mapPdfJsError(error);
    if (mapped.code === "PASSWORD_PROTECTED" || mapped.code === "INVALID_FILE") {
      throw mapped;
    }
  }

  onProgress?.(15);

  // Lossy path: re-render pages at the preset's DPI and re-encode as JPEG.
  let rasterizedBytes: Uint8Array;
  try {
    rasterizedBytes = await rasterizePdf(bytes, rasterOpts, (pageProgress) => {
      onProgress?.(15 + Math.round(pageProgress * 0.85));
    });
  } catch (error) {
    if (error instanceof PdfCompressionError) throw error;
    throw mapPdfJsError(error);
  }

  // Start from the sharpest option that isn't larger than the original.
  let outputBytes: Uint8Array = bytes;
  let method: CompressPdfResult["method"] = "original";

  if (optimizedBytes && optimizedBytes.length < outputBytes.length) {
    outputBytes = optimizedBytes;
    method = "optimize";
  }

  // Only switch to the rasterized version when it saves meaningfully more,
  // so text-based PDFs keep their crisp vector text instead of going blurry.
  if (
    rasterizedBytes.length <
    outputBytes.length * (1 - RASTER_ADVANTAGE_THRESHOLD)
  ) {
    outputBytes = rasterizedBytes;
    method = "rasterize";
  }

  onProgress?.(100);

  return {
    blob: new Blob([new Uint8Array(outputBytes)], { type: "application/pdf" }),
    originalSize,
    compressedSize: outputBytes.length,
    level,
    method,
  };
}

export function getCompressionErrorMessage(error: unknown): string {
  if (error instanceof PdfCompressionError) return error.message;
  return "Something went wrong while compressing your PDF. Please try again.";
}

/** @deprecated Import ProgressCallback from @/lib/processing */
export type { ProgressCallback } from "@/lib/processing";
