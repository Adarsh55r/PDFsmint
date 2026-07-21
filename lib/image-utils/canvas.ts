"use client";

import { ToolError } from "@/lib/tool-error";

/** Load a File into an HTMLImageElement, resolving with natural dimensions. */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new ToolError(
          "INVALID_FILE",
          "This file could not be read as an image. Try a JPG, PNG, or WebP.",
        ),
      );
    };
    img.src = url;
  });
}

export type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: OutputFormat,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(
              new ToolError("PROCESSING_FAILED", "Could not encode the output image."),
            ),
      format,
      quality,
    );
  });
}

export function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new ToolError(
      "PROCESSING_FAILED",
      "Your browser could not initialise image processing. Try another browser.",
    );
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return ctx;
}

/** Infer an output extension from a mime type. */
export function extensionForFormat(format: OutputFormat): string {
  if (format === "image/png") return "png";
  if (format === "image/webp") return "webp";
  return "jpg";
}
