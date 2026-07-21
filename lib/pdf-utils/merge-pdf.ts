"use client";

import { PDFDocument } from "pdf-lib";

import { ToolError } from "@/lib/tool-error";
import type { ProgressCallback } from "@/lib/processing";

/**
 * Merge multiple PDF files into a single document, preserving the given order.
 * Runs fully client-side with pdf-lib.
 */
export async function mergePdf(
  files: File[],
  onProgress?: ProgressCallback,
): Promise<Blob> {
  if (files.length < 2) {
    throw new ToolError(
      "EMPTY_INPUT",
      "Select at least two PDF files to merge.",
    );
  }

  const mergedDoc = await PDFDocument.create();
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i]!;
    let sourceDoc: PDFDocument;

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      sourceDoc = await PDFDocument.load(bytes, { ignoreEncryption: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message.toLowerCase() : "";
      if (message.includes("encrypt") || message.includes("password")) {
        throw new ToolError(
          "PASSWORD_PROTECTED",
          `"${file.name}" is password-protected. Remove its password and try again.`,
        );
      }
      throw new ToolError(
        "INVALID_FILE",
        `"${file.name}" could not be read as a valid PDF.`,
      );
    }

    const copiedPages = await mergedDoc.copyPages(
      sourceDoc,
      sourceDoc.getPageIndices(),
    );
    copiedPages.forEach((page) => mergedDoc.addPage(page));

    onProgress?.(Math.round(((i + 1) / total) * 95));
  }

  const outputBytes = await mergedDoc.save({ useObjectStreams: true });
  onProgress?.(100);

  return new Blob([new Uint8Array(outputBytes)], { type: "application/pdf" });
}
