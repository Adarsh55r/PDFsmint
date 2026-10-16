"use client";

import type { PDFDocument, PDFPage } from "pdf-lib";

import { ToolError } from "@/lib/tool-error";
import type { ProgressCallback } from "@/lib/processing";

/** Max source pages — N-up embedding is heavier than a simple merge. */
export const MAX_NUP_PAGES = 150;

export type NUpPagesPerSheet = 2 | 4 | 6 | 9;
export type NUpOrientation = "portrait" | "landscape";
export type NUpPageSize = "a4" | "letter";

export type NUpLayoutOptions = {
  pagesPerSheet: NUpPagesPerSheet;
  orientation: NUpOrientation;
  pageSize: NUpPageSize;
  /** Draw a thin border around each page slot (default true). */
  showBorders?: boolean;
};

export type NUpLayoutResult = {
  blob: Blob;
  fileName: string;
  sourcePageCount: number;
  outputSheetCount: number;
  pagesPerSheet: NUpPagesPerSheet;
};

/** Physical page sizes in PDF points (1pt = 1/72"). */
const PAGE_SIZES_PT: Record<NUpPageSize, { width: number; height: number }> = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
};

/** Grid shape for each N-up preset (rows × columns). */
export const NUP_GRIDS: Record<
  NUpPagesPerSheet,
  { rows: number; cols: number; label: string }
> = {
  2: { rows: 1, cols: 2, label: "1×2" },
  4: { rows: 2, cols: 2, label: "2×2" },
  6: { rows: 2, cols: 3, label: "2×3" },
  9: { rows: 3, cols: 3, label: "3×3" },
};

const OUTER_MARGIN_PT = 18;
const SLOT_GAP_PT = 8;
const BORDER_RGB = [0.72, 0.76, 0.8] as const;
const BORDER_WIDTH = 0.75;

/**
 * Sensible orientation defaults:
 * - 2-up → landscape (two pages side-by-side reads naturally on a wide sheet)
 * - 4/6/9-up → portrait (taller sheet fits handout-style grids better)
 */
export function defaultOrientationFor(
  pagesPerSheet: NUpPagesPerSheet,
): NUpOrientation {
  return pagesPerSheet === 2 ? "landscape" : "portrait";
}

export function estimateSheetCount(
  sourcePageCount: number,
  pagesPerSheet: NUpPagesPerSheet,
): number {
  if (sourcePageCount <= 0) return 0;
  return Math.ceil(sourcePageCount / pagesPerSheet);
}

function sheetDimensions(
  pageSize: NUpPageSize,
  orientation: NUpOrientation,
): { width: number; height: number } {
  const base = PAGE_SIZES_PT[pageSize];
  if (orientation === "landscape") {
    return { width: base.height, height: base.width };
  }
  return { width: base.width, height: base.height };
}

function fitRect(
  srcW: number,
  srcH: number,
  maxW: number,
  maxH: number,
): { width: number; height: number } {
  const scale = Math.min(maxW / srcW, maxH / srcH);
  return { width: srcW * scale, height: srcH * scale };
}

async function loadSource(file: File): Promise<PDFDocument> {
  // Loaded on demand so pdf-lib stays out of the initial page bundle.
  const { PDFDocument } = await import("pdf-lib");
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    return await PDFDocument.load(bytes, { ignoreEncryption: false });
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (message.includes("encrypt") || message.includes("password")) {
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
}

/**
 * Combine multiple PDF pages onto fewer sheets (N-up / multi-page layout).
 * Fully client-side via pdf-lib. Leftover slots on the last sheet stay blank.
 */
export async function generateNUpLayout(
  file: File,
  options: NUpLayoutOptions,
  onProgress?: ProgressCallback,
): Promise<NUpLayoutResult> {
  // Loaded on demand so pdf-lib stays out of the initial page bundle.
  const { PDFDocument, rgb } = await import("pdf-lib");
  const {
    pagesPerSheet,
    orientation,
    pageSize,
    showBorders = true,
  } = options;

  const grid = NUP_GRIDS[pagesPerSheet];
  if (!grid) {
    throw new ToolError("INVALID_FILE", "Unsupported pages-per-sheet value.");
  }

  onProgress?.(5);

  const sourceDoc = await loadSource(file);
  const sourcePages = sourceDoc.getPages();
  const sourcePageCount = sourcePages.length;

  if (sourcePageCount === 0) {
    throw new ToolError("EMPTY_INPUT", "This PDF has no pages.");
  }

  if (sourcePageCount > MAX_NUP_PAGES) {
    throw new ToolError(
      "TOO_MANY_PAGES",
      `This PDF has ${sourcePageCount} pages. Please use a file with ${MAX_NUP_PAGES} pages or fewer.`,
    );
  }

  onProgress?.(12);

  const outDoc = await PDFDocument.create();
  const { width: sheetW, height: sheetH } = sheetDimensions(
    pageSize,
    orientation,
  );

  const gap = showBorders ? SLOT_GAP_PT : SLOT_GAP_PT * 0.5;
  const usableW = sheetW - OUTER_MARGIN_PT * 2 - gap * (grid.cols - 1);
  const usableH = sheetH - OUTER_MARGIN_PT * 2 - gap * (grid.rows - 1);
  const cellW = usableW / grid.cols;
  const cellH = usableH / grid.rows;

  const outputSheetCount = estimateSheetCount(sourcePageCount, pagesPerSheet);
  let sourceIndex = 0;

  for (let sheet = 0; sheet < outputSheetCount; sheet++) {
    const page = outDoc.addPage([sheetW, sheetH]);

    for (let slot = 0; slot < pagesPerSheet; slot++) {
      const row = Math.floor(slot / grid.cols);
      const col = slot % grid.cols;

      // PDF origin is bottom-left — flip row so slot 0 is top-left.
      const cellX = OUTER_MARGIN_PT + col * (cellW + gap);
      const cellY =
        sheetH - OUTER_MARGIN_PT - (row + 1) * cellH - row * gap;

      if (showBorders) {
        page.drawRectangle({
          x: cellX,
          y: cellY,
          width: cellW,
          height: cellH,
          borderColor: rgb(...BORDER_RGB),
          borderWidth: BORDER_WIDTH,
        });
      }

      if (sourceIndex >= sourcePageCount) {
        continue;
      }

      const sourcePage: PDFPage = sourcePages[sourceIndex]!;
      const embedded = await outDoc.embedPage(sourcePage);
      const srcSize = sourcePage.getSize();
      const fitted = fitRect(srcSize.width, srcSize.height, cellW, cellH);

      const drawX = cellX + (cellW - fitted.width) / 2;
      const drawY = cellY + (cellH - fitted.height) / 2;

      page.drawPage(embedded, {
        x: drawX,
        y: drawY,
        width: fitted.width,
        height: fitted.height,
      });

      sourceIndex += 1;
    }

    onProgress?.(
      Math.min(95, Math.round(15 + ((sheet + 1) / outputSheetCount) * 80)),
    );
  }

  const outputBytes = await outDoc.save({ useObjectStreams: true });
  onProgress?.(100);

  const baseName = file.name.replace(/\.pdf$/i, "") || "document";

  return {
    blob: new Blob([new Uint8Array(outputBytes)], { type: "application/pdf" }),
    fileName: `${baseName}-${pagesPerSheet}up.pdf`,
    sourcePageCount,
    outputSheetCount,
    pagesPerSheet,
  };
}
