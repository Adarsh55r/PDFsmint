import type { LucideIcon } from "lucide-react";
import {
  FileImage,
  FileInput,
  FileOutput,
  FilePen,
  FileType,
  Image,
  ImageDown,
  Layers,
  Maximize2,
  Minimize2,
  Scissors,
  Stamp,
} from "lucide-react";

export const toolIconMap: Record<string, LucideIcon> = {
  "/tools/compress-pdf": Minimize2,
  "/tools/merge-pdf": Layers,
  "/tools/split-pdf": Scissors,
  "/tools/jpg-to-pdf": FileOutput,
  "/tools/pdf-to-jpg": FileImage,
  "/tools/pdf-to-word": FileType,
  "/tools/word-to-pdf": FileInput,
  "/tools/edit-pdf": FilePen,
  "/tools/watermark-pdf": Stamp,
  "/tools/resize-image": Maximize2,
  "/tools/compress-image": ImageDown,
  "/tools/convert-to-jpg": Image,
};

export function getToolIcon(href: string): LucideIcon {
  return toolIconMap[href] ?? FileOutput;
}
