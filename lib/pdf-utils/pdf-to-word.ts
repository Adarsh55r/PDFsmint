"use client";

import { ToolError } from "@/lib/tool-error";
import type { ProgressCallback } from "@/lib/processing";

export type PdfToWordResult = {
  blob: Blob;
  fileName: string;
  pageCount: number;
  characters: number;
};

/** Max pages processed in-browser — guards against memory exhaustion. */
const MAX_PAGES = 150;

async function loadPdfJs() {
  // Legacy build: it bundles polyfills (e.g. Map.prototype.getOrInsertComputed)
  // that the modern build assumes. Without them rendering fails on browsers
  // that don't ship those built-ins yet. Worker in /public must match.
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjs;
}

type TextItemLike = {
  str: string;
  transform: number[];
  hasEOL?: boolean;
};

/**
 * Group a page's text items into lines using their vertical position, then
 * assemble lines into paragraphs based on the vertical gap between them.
 */
function itemsToParagraphs(items: TextItemLike[]): string[] {
  const rows: { y: number; x: number; text: string }[] = [];

  for (const item of items) {
    const text = item.str;
    if (!text) continue;
    const x = item.transform[4] ?? 0;
    const y = item.transform[5] ?? 0;
    rows.push({ y, x, text });
  }

  if (rows.length === 0) return [];

  // Group into lines by similar y (within a small tolerance).
  rows.sort((a, b) => b.y - a.y || a.x - b.x);
  const lines: { y: number; text: string }[] = [];
  const tolerance = 3;

  for (const row of rows) {
    const last = lines[lines.length - 1];
    if (last && Math.abs(last.y - row.y) <= tolerance) {
      last.text += (last.text.endsWith(" ") || row.text.startsWith(" ") ? "" : " ") + row.text;
    } else {
      lines.push({ y: row.y, text: row.text });
    }
  }

  // Estimate a typical line height from consecutive gaps.
  const gaps: number[] = [];
  for (let i = 1; i < lines.length; i++) {
    gaps.push(Math.abs(lines[i - 1]!.y - lines[i]!.y));
  }
  gaps.sort((a, b) => a - b);
  const medianGap = gaps.length ? gaps[Math.floor(gaps.length / 2)]! : 12;

  // Merge lines into paragraphs; a larger-than-usual gap starts a new paragraph.
  const paragraphs: string[] = [];
  let current = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const prev = lines[i - 1];
    const gap = prev ? Math.abs(prev.y - line.y) : 0;

    if (prev && gap > medianGap * 1.6) {
      if (current.trim()) paragraphs.push(current.trim());
      current = line.text;
    } else {
      current = current ? `${current} ${line.text}` : line.text;
    }
  }
  if (current.trim()) paragraphs.push(current.trim());

  return paragraphs;
}

/**
 * Convert a PDF's text layer into an editable Word (.docx) document.
 *
 * LIMITATION: this extracts the digital text content and paragraph flow. It does
 * not reproduce exact page layout, columns, fonts, or embedded images, and it
 * cannot read scanned/image-only PDFs (which have no text layer, no OCR).
 */
export async function pdfToWord(
  file: File,
  onProgress?: ProgressCallback,
): Promise<PdfToWordResult> {
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

  const { Document, Packer, Paragraph, TextRun, PageBreak } = await import("docx");

  const docParagraphs: InstanceType<typeof Paragraph>[] = [];
  let totalChars = 0;

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const items = textContent.items as TextItemLike[];
    const paragraphs = itemsToParagraphs(items);

    for (const text of paragraphs) {
      totalChars += text.length;
      docParagraphs.push(
        new Paragraph({
          children: [new TextRun(text)],
          spacing: { after: 160 },
        }),
      );
    }

    if (i < pageCount) {
      docParagraphs.push(new Paragraph({ children: [new PageBreak()] }));
    }

    page.cleanup();
    onProgress?.(Math.round((i / pageCount) * 90));
  }

  await loadingTask.destroy();

  if (totalChars === 0) {
    throw new ToolError(
      "NO_TEXT_FOUND",
      "No selectable text was found. This looks like a scanned or image-only PDF, which needs OCR to convert.",
    );
  }

  const doc = new Document({
    sections: [{ properties: {}, children: docParagraphs }],
  });

  const blob = await Packer.toBlob(doc);
  onProgress?.(100);

  return {
    blob,
    fileName: file.name.replace(/\.pdf$/i, "") + ".docx",
    pageCount,
    characters: totalChars,
  };
}
