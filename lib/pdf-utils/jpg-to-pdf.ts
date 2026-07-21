"use client";

import { PDFDocument, type PDFImage } from "pdf-lib";

import { ToolError } from "@/lib/tool-error";
import type { ProgressCallback } from "@/lib/processing";

export type PageSizeOption = "fit" | "a4" | "letter";

export type JpgToPdfOptions = {
  pageSize: PageSizeOption;
  /** Margin in points, applied for a4/letter. Default 24. */
  margin?: number;
};

const PAGE_DIMENSIONS: Record<Exclude<PageSizeOption, "fit">, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

async function embedImage(doc: PDFDocument, file: File): Promise<PDFImage> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (type.includes("png") || name.endsWith(".png")) {
    return doc.embedPng(bytes);
  }
  if (
    type.includes("jpeg") ||
    type.includes("jpg") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg")
  ) {
    return doc.embedJpg(bytes);
  }

  // Fallback: try JPG then PNG
  try {
    return await doc.embedJpg(bytes);
  } catch {
    return doc.embedPng(bytes);
  }
}

/** Convert one or more images (JPG/PNG) into a single PDF, one image per page. */
export async function jpgToPdf(
  files: File[],
  options: JpgToPdfOptions,
  onProgress?: ProgressCallback,
): Promise<Blob> {
  if (files.length === 0) {
    throw new ToolError("EMPTY_INPUT", "Add at least one image to convert.");
  }

  const doc = await PDFDocument.create();
  const margin = options.margin ?? 24;
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i]!;
    let image: PDFImage;
    try {
      image = await embedImage(doc, file);
    } catch {
      throw new ToolError(
        "INVALID_FILE",
        `"${file.name}" is not a supported image (use JPG or PNG).`,
      );
    }

    if (options.pageSize === "fit") {
      const page = doc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    } else {
      const [pw, ph] = PAGE_DIMENSIONS[options.pageSize];
      const page = doc.addPage([pw, ph]);
      const maxW = pw - margin * 2;
      const maxH = ph - margin * 2;
      const scale = Math.min(maxW / image.width, maxH / image.height, 1);
      const drawW = image.width * scale;
      const drawH = image.height * scale;
      page.drawImage(image, {
        x: (pw - drawW) / 2,
        y: (ph - drawH) / 2,
        width: drawW,
        height: drawH,
      });
    }

    onProgress?.(Math.round(((i + 1) / total) * 95));
  }

  const bytes = await doc.save({ useObjectStreams: true });
  onProgress?.(100);
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}
