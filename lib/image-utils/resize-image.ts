"use client";

import {
  canvasToBlob,
  extensionForFormat,
  getContext,
  loadImage,
  type OutputFormat,
} from "@/lib/image-utils/canvas";
import { ToolError } from "@/lib/tool-error";
import type { ProgressCallback } from "@/lib/processing";

export type ResizeImageOptions = {
  width: number;
  height: number;
  format: OutputFormat;
  quality?: number;
};

export type ResizeImageResult = {
  blob: Blob;
  width: number;
  height: number;
  fileName: string;
};

/** Read a file's natural dimensions without resizing. */
export async function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  const img = await loadImage(file);
  return { width: img.naturalWidth, height: img.naturalHeight };
}

/** Resize an image to exact pixel dimensions using the Canvas API. */
export async function resizeImage(
  file: File,
  options: ResizeImageOptions,
  onProgress?: ProgressCallback,
): Promise<ResizeImageResult> {
  const width = Math.round(options.width);
  const height = Math.round(options.height);

  if (width < 1 || height < 1 || !Number.isFinite(width) || !Number.isFinite(height)) {
    throw new ToolError("INVALID_FILE", "Enter valid width and height values in pixels.");
  }
  if (width > 20000 || height > 20000) {
    throw new ToolError(
      "MEMORY_LIMIT",
      "Those dimensions are too large to process in the browser.",
    );
  }

  onProgress?.(20);
  const img = await loadImage(file);
  onProgress?.(50);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = getContext(canvas);

  if (options.format === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(img, 0, 0, width, height);
  onProgress?.(80);

  const blob = await canvasToBlob(canvas, options.format, options.quality ?? 0.9);
  onProgress?.(100);

  const ext = extensionForFormat(options.format);
  const baseName = file.name.replace(/\.[^./\\]+$/, "");

  return {
    blob,
    width,
    height,
    fileName: `${baseName}-${width}x${height}.${ext}`,
  };
}
