"use client";

import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";

import { ToolError } from "@/lib/tool-error";
import type { ProgressCallback } from "@/lib/processing";

export type WatermarkPosition = "center" | "tile";

export type TextWatermarkOptions = {
  type: "text";
  text: string;
  opacity: number; // 0–1
  fontSize: number;
  rotation: number; // degrees
  color: { r: number; g: number; b: number }; // 0–1 each
  position: WatermarkPosition;
};

export type ImageWatermarkOptions = {
  type: "image";
  image: File;
  opacity: number; // 0–1
  scale: number; // 0–1 relative to page width
};

export type WatermarkOptions = TextWatermarkOptions | ImageWatermarkOptions;

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
    throw new ToolError("INVALID_FILE", "This file could not be read as a valid PDF.");
  }
}

/** Apply a text or image watermark to every page of a PDF, client-side. */
export async function watermarkPdf(
  file: File,
  options: WatermarkOptions,
  onProgress?: ProgressCallback,
): Promise<Blob> {
  const doc = await loadDoc(file);
  const pages = doc.getPages();
  const total = pages.length;
  onProgress?.(10);

  if (options.type === "text") {
    if (!options.text.trim()) {
      throw new ToolError("EMPTY_INPUT", "Enter the watermark text.");
    }
    const font = await doc.embedFont(StandardFonts.HelveticaBold);
    const { text, opacity, fontSize, rotation, color, position } = options;

    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);

      const drawOne = (x: number, y: number) => {
        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(color.r, color.g, color.b),
          opacity,
          rotate: degrees(rotation),
        });
      };

      if (position === "tile") {
        const stepX = textWidth + 120;
        const stepY = fontSize + 120;
        for (let y = 40; y < height; y += stepY) {
          for (let x = 20; x < width; x += stepX) {
            drawOne(x, y);
          }
        }
      } else {
        drawOne((width - textWidth) / 2, height / 2);
      }
      onProgress?.(10 + Math.round(((index + 1) / total) * 85));
    });
  } else {
    const imgBytes = new Uint8Array(await options.image.arrayBuffer());
    const imgType = options.image.type.toLowerCase();
    let embedded;
    try {
      embedded =
        imgType.includes("png") || options.image.name.toLowerCase().endsWith(".png")
          ? await doc.embedPng(imgBytes)
          : await doc.embedJpg(imgBytes);
    } catch {
      throw new ToolError(
        "INVALID_FILE",
        "The watermark image must be a valid PNG or JPG.",
      );
    }

    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      const drawW = width * options.scale;
      const drawH = (embedded.height / embedded.width) * drawW;
      page.drawImage(embedded, {
        x: (width - drawW) / 2,
        y: (height - drawH) / 2,
        width: drawW,
        height: drawH,
        opacity: options.opacity,
      });
      onProgress?.(10 + Math.round(((index + 1) / total) * 85));
    });
  }

  const bytes = await doc.save({ useObjectStreams: true });
  onProgress?.(100);
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}
