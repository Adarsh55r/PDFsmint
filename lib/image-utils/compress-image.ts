"use client";

import {
  canvasToBlob,
  extensionForFormat,
  getContext,
  loadImage,
  type OutputFormat,
} from "@/lib/image-utils/canvas";
import type { ProgressCallback } from "@/lib/processing";

export type CompressImageOptions = {
  /** Encoding quality 0–1. Default 0.7. */
  quality?: number;
  /** Optionally cap the longest edge (px) to shrink dimensions too. */
  maxDimension?: number;
  /** Output format. Default keeps JPEG; PNG is re-encoded as JPEG for real savings. */
  format?: OutputFormat;
};

export type CompressImageResult = {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  fileName: string;
};

/** Compress an image by re-encoding (and optionally downscaling) it on a canvas. */
export async function compressImage(
  file: File,
  options: CompressImageOptions = {},
  onProgress?: ProgressCallback,
): Promise<CompressImageResult> {
  const quality = options.quality ?? 0.7;
  const format: OutputFormat = options.format ?? "image/jpeg";

  onProgress?.(20);
  const img = await loadImage(file);
  onProgress?.(50);

  let targetW = img.naturalWidth;
  let targetH = img.naturalHeight;

  if (options.maxDimension && options.maxDimension > 0) {
    const longest = Math.max(targetW, targetH);
    if (longest > options.maxDimension) {
      const ratio = options.maxDimension / longest;
      targetW = Math.round(targetW * ratio);
      targetH = Math.round(targetH * ratio);
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = getContext(canvas);

  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetW, targetH);
  }
  ctx.drawImage(img, 0, 0, targetW, targetH);
  onProgress?.(80);

  const blob = await canvasToBlob(canvas, format, quality);
  onProgress?.(100);

  const ext = extensionForFormat(format);
  const baseName = file.name.replace(/\.[^./\\]+$/, "");

  return {
    blob,
    originalSize: file.size,
    compressedSize: blob.size,
    fileName: `${baseName}-compressed.${ext}`,
  };
}
