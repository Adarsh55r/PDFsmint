"use client";

import { PDFDocument } from "pdf-lib";

import type { NamedBlob } from "@/lib/download";
import { ToolError } from "@/lib/tool-error";
import type { ProgressCallback } from "@/lib/processing";

export type SplitMode = "each" | "ranges";

export type SplitPdfOptions = {
  mode: SplitMode;
  /** Only used when mode === "ranges". e.g. "1-3, 5, 8-10" */
  ranges?: string;
};

export type SplitPdfResult = {
  files: NamedBlob[];
  pageCount: number;
};

/**
 * Parse a human range string like "1-3, 5, 8-10" into inclusive [start, end] pairs.
 * Validates against the total page count (1-indexed).
 */
export function parseRanges(
  input: string,
  pageCount: number,
): Array<[number, number]> {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new ToolError(
      "EMPTY_INPUT",
      "Enter at least one page or range (e.g. 1-3, 5).",
    );
  }

  const parts = trimmed.split(",").map((p) => p.trim()).filter(Boolean);
  const result: Array<[number, number]> = [];

  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    const singleMatch = part.match(/^(\d+)$/);

    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (start < 1 || end > pageCount || start > end) {
        throw new ToolError(
          "INVALID_FILE",
          `Range "${part}" is out of bounds. This PDF has ${pageCount} pages.`,
        );
      }
      result.push([start, end]);
    } else if (singleMatch) {
      const page = Number(singleMatch[1]);
      if (page < 1 || page > pageCount) {
        throw new ToolError(
          "INVALID_FILE",
          `Page ${page} is out of bounds. This PDF has ${pageCount} pages.`,
        );
      }
      result.push([page, page]);
    } else {
      throw new ToolError(
        "INVALID_FILE",
        `"${part}" is not a valid page or range. Use formats like 1-3 or 5.`,
      );
    }
  }

  return result;
}

async function loadDoc(file: File): Promise<PDFDocument> {
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

async function extractPages(
  source: PDFDocument,
  pageIndices: number[],
): Promise<Blob> {
  const out = await PDFDocument.create();
  const copied = await out.copyPages(source, pageIndices);
  copied.forEach((page) => out.addPage(page));
  const bytes = await out.save({ useObjectStreams: true });
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}

/** Split a PDF into multiple files, either one-per-page or by custom ranges. */
export async function splitPdf(
  file: File,
  options: SplitPdfOptions,
  onProgress?: ProgressCallback,
): Promise<SplitPdfResult> {
  const source = await loadDoc(file);
  const pageCount = source.getPageCount();
  const baseName = file.name.replace(/\.pdf$/i, "");
  onProgress?.(10);

  const files: NamedBlob[] = [];

  if (options.mode === "each") {
    for (let i = 0; i < pageCount; i++) {
      const blob = await extractPages(source, [i]);
      files.push({ name: `${baseName}-page-${i + 1}.pdf`, blob });
      onProgress?.(10 + Math.round(((i + 1) / pageCount) * 90));
    }
  } else {
    const ranges = parseRanges(options.ranges ?? "", pageCount);
    for (let r = 0; r < ranges.length; r++) {
      const [start, end] = ranges[r]!;
      const indices = Array.from({ length: end - start + 1 }, (_, k) => start - 1 + k);
      const blob = await extractPages(source, indices);
      const label = start === end ? `page-${start}` : `pages-${start}-${end}`;
      files.push({ name: `${baseName}-${label}.pdf`, blob });
      onProgress?.(10 + Math.round(((r + 1) / ranges.length) * 90));
    }
  }

  onProgress?.(100);
  return { files, pageCount };
}
