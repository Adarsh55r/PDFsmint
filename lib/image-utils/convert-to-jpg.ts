"use client";

import {
  canvasToBlob,
  getContext,
  loadImage,
} from "@/lib/image-utils/canvas";
import type { ProgressCallback } from "@/lib/processing";

export type ConvertToJpgOptions = {
  /** JPEG quality 0–1. Default 0.92. */
  quality?: number;
  /** Background colour for transparent areas. Default white. */
  background?: string;
};

export type ConvertToJpgResult = {
  blob: Blob;
  fileName: string;
};

/**
 * Convert any browser-decodable image (PNG, WebP, GIF, BMP, etc.) to JPG.
 * Transparent pixels are flattened onto a solid background.
 */
export async function convertToJpg(
  file: File,
  options: ConvertToJpgOptions = {},
  onProgress?: ProgressCallback,
): Promise<ConvertToJpgResult> {
  const quality = options.quality ?? 0.92;
  const background = options.background ?? "#ffffff";

  onProgress?.(25);
  const img = await loadImage(file);
  onProgress?.(55);

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = getContext(canvas);

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  onProgress?.(85);

  const blob = await canvasToBlob(canvas, "image/jpeg", quality);
  onProgress?.(100);

  const baseName = file.name.replace(/\.[^./\\]+$/, "");

  return {
    blob,
    fileName: `${baseName}.jpg`,
  };
}
