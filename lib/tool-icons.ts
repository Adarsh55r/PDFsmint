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
  LayoutGrid,
  Maximize2,
  Minimize2,
  PenLine,
  Scissors,
  Stamp,
} from "lucide-react";

/** Shared card hover border — mint green, matches the brand. */
const GREEN_CARD_HOVER = "group-hover:border-primary-300";

export type ToolTheme = {
  icon: LucideIcon;
  /** Icon badge background (idle state). */
  iconBg: string;
  /** Icon color. */
  iconText: string;
  /** Icon badge background on card hover. */
  iconBgHover: string;
  /** Soft border accent on card hover. */
  accentRing: string;
};

/**
 * Lucide icons match the live site set; each tool gets its own colorful badge.
 * Card hover border stays brand green.
 */
export const toolThemeMap: Record<string, ToolTheme> = {
  "/tools/compress-pdf": {
    icon: Minimize2,
    iconBg: "bg-teal-100",
    iconText: "text-teal-700",
    iconBgHover: "group-hover:bg-teal-200",
    accentRing: GREEN_CARD_HOVER,
  },
  "/tools/merge-pdf": {
    icon: Layers,
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-700",
    iconBgHover: "group-hover:bg-indigo-200",
    accentRing: GREEN_CARD_HOVER,
  },
  "/tools/split-pdf": {
    icon: Scissors,
    iconBg: "bg-amber-100",
    iconText: "text-amber-700",
    iconBgHover: "group-hover:bg-amber-200",
    accentRing: GREEN_CARD_HOVER,
  },
  "/tools/jpg-to-pdf": {
    icon: FileOutput,
    iconBg: "bg-sky-100",
    iconText: "text-sky-700",
    iconBgHover: "group-hover:bg-sky-200",
    accentRing: GREEN_CARD_HOVER,
  },
  "/tools/pdf-to-jpg": {
    icon: FileImage,
    iconBg: "bg-fuchsia-100",
    iconText: "text-fuchsia-700",
    iconBgHover: "group-hover:bg-fuchsia-200",
    accentRing: GREEN_CARD_HOVER,
  },
  "/tools/pdf-to-word": {
    icon: FileType,
    iconBg: "bg-blue-100",
    iconText: "text-blue-700",
    iconBgHover: "group-hover:bg-blue-200",
    accentRing: GREEN_CARD_HOVER,
  },
  "/tools/word-to-pdf": {
    icon: FileInput,
    iconBg: "bg-violet-100",
    iconText: "text-violet-700",
    iconBgHover: "group-hover:bg-violet-200",
    accentRing: GREEN_CARD_HOVER,
  },
  "/tools/edit-pdf": {
    icon: FilePen,
    iconBg: "bg-orange-100",
    iconText: "text-orange-700",
    iconBgHover: "group-hover:bg-orange-200",
    accentRing: GREEN_CARD_HOVER,
  },
  "/tools/n-up-pdf": {
    icon: LayoutGrid,
    iconBg: "bg-lime-100",
    iconText: "text-lime-700",
    iconBgHover: "group-hover:bg-lime-200",
    accentRing: GREEN_CARD_HOVER,
  },
  "/tools/watermark-pdf": {
    icon: Stamp,
    iconBg: "bg-rose-100",
    iconText: "text-rose-700",
    iconBgHover: "group-hover:bg-rose-200",
    accentRing: GREEN_CARD_HOVER,
  },
  "/tools/sign-pdf": {
    icon: PenLine,
    iconBg: "bg-slate-100",
    iconText: "text-slate-700",
    iconBgHover: "group-hover:bg-slate-200",
    accentRing: GREEN_CARD_HOVER,
  },
  "/tools/resize-image": {
    icon: Maximize2,
    iconBg: "bg-cyan-100",
    iconText: "text-cyan-700",
    iconBgHover: "group-hover:bg-cyan-200",
    accentRing: GREEN_CARD_HOVER,
  },
  "/tools/compress-image": {
    icon: ImageDown,
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-700",
    iconBgHover: "group-hover:bg-emerald-200",
    accentRing: GREEN_CARD_HOVER,
  },
  "/tools/convert-to-jpg": {
    icon: Image,
    iconBg: "bg-pink-100",
    iconText: "text-pink-700",
    iconBgHover: "group-hover:bg-pink-200",
    accentRing: GREEN_CARD_HOVER,
  },
};

const fallbackTheme: ToolTheme = {
  icon: FileOutput,
  iconBg: "bg-primary-100",
  iconText: "text-primary-700",
  iconBgHover: "group-hover:bg-primary-200",
  accentRing: GREEN_CARD_HOVER,
};

export function getToolTheme(href: string): ToolTheme {
  return toolThemeMap[href] ?? fallbackTheme;
}

export function getToolIcon(href: string): LucideIcon {
  return getToolTheme(href).icon;
}
