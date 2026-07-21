"use client";

import { useCallback, useRef, useState } from "react";
import { Download, RefreshCw, Stamp } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { triggerDownload } from "@/lib/download";
import { formatBytes } from "@/lib/format-bytes";
import {
  watermarkPdf,
  type WatermarkPosition,
} from "@/lib/pdf-utils/watermark-pdf";
import { toFriendlyMessage } from "@/lib/tool-error";

const MAX_PDF_SIZE_BYTES = 100 * 1024 * 1024;
const PDF_ACCEPT: Record<string, string[]> = { "application/pdf": [".pdf"] };

type WatermarkType = "text" | "image";
type WidgetState = "idle" | "processing" | "result";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const parsed = hex.replace("#", "");
  const r = parseInt(parsed.substring(0, 2), 16) / 255;
  const g = parseInt(parsed.substring(2, 4), 16) / 255;
  const b = parseInt(parsed.substring(4, 6), 16) / 255;
  return { r, g, b };
}

export function WatermarkPdfWidget() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [wmType, setWmType] = useState<WatermarkType>("text");
  const [text, setText] = useState("CONFIDENTIAL");
  const [color, setColor] = useState("#ff0000");
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(48);
  const [rotation, setRotation] = useState(45);
  const [position, setPosition] = useState<WatermarkPosition>("center");
  const [wmImage, setWmImage] = useState<File | null>(null);
  const [imageScale, setImageScale] = useState(0.4);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<WidgetState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handlePdf = useCallback((files: File[]) => {
    setPdfFile(files[0] ?? null);
    setError(null);
    setState("idle");
  }, []);

  const handleApply = useCallback(async () => {
    if (!pdfFile) {
      setError("Please add a PDF first.");
      return;
    }
    if (wmType === "text" && !text.trim()) {
      setError("Enter the watermark text.");
      return;
    }
    if (wmType === "image" && !wmImage) {
      setError("Choose a watermark image.");
      return;
    }

    setState("processing");
    setProgress(0);
    setError(null);

    try {
      const blob = await watermarkPdf(
        pdfFile,
        wmType === "text"
          ? {
              type: "text",
              text: text.trim(),
              opacity,
              fontSize,
              rotation,
              color: hexToRgb(color),
              position,
            }
          : {
              type: "image",
              image: wmImage!,
              opacity,
              scale: imageScale,
            },
        setProgress,
      );
      setResultBlob(blob);
      setState("result");
    } catch (err) {
      setError(toFriendlyMessage(err, "Failed to add watermark. Please try again."));
      setState("idle");
      setProgress(0);
    }
  }, [pdfFile, wmType, text, opacity, fontSize, rotation, color, position, wmImage, imageScale]);

  const reset = useCallback(() => {
    setPdfFile(null);
    setState("idle");
    setProgress(0);
    setError(null);
    setResultBlob(null);
    setWmImage(null);
  }, []);

  if (state === "result" && resultBlob) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-5">
          <p className="mb-1 text-sm font-medium text-primary-900">
            Watermark applied
          </p>
          <p className="text-sm text-neutral-600">{formatBytes(resultBlob.size)}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="gap-2"
            onClick={() =>
              triggerDownload(resultBlob, `watermarked-${pdfFile?.name ?? "file.pdf"}`)
            }
          >
            <Download className="h-4 w-4" strokeWidth={1.75} />
            Download PDF
          </Button>
          <Button variant="secondary" size="lg" className="gap-2" onClick={reset}>
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            Watermark another PDF
          </Button>
        </div>
      </div>
    );
  }

  const disabled = state === "processing";

  return (
    <div className="space-y-5">
      <FileDropzone
        accept={PDF_ACCEPT}
        maxSizeBytes={MAX_PDF_SIZE_BYTES}
        disabled={disabled}
        error={error}
        hint="PDF only · Max 100 MB"
        onValidationError={setError}
        onFilesAccepted={handlePdf}
      />

      {pdfFile && (
        <>
          <fieldset className="space-y-3" disabled={disabled}>
            <legend className="text-sm font-medium text-neutral-700">
              Watermark type
            </legend>
            <div className="flex flex-wrap gap-3">
              {(
                [
                  { value: "text", label: "Text" },
                  { value: "image", label: "Image / Logo" },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    wmType === opt.value
                      ? "border-primary-500 bg-primary-50 text-primary-800"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="wm-type"
                    value={opt.value}
                    checked={wmType === opt.value}
                    onChange={() => setWmType(opt.value)}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>

          {wmType === "text" ? (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Watermark text
                </span>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={disabled}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Colour
                  </span>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    disabled={disabled}
                    className="h-10 w-full cursor-pointer rounded-lg border border-neutral-300"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Placement
                  </span>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as WatermarkPosition)}
                    disabled={disabled}
                    className="h-10 w-full rounded-lg border border-neutral-300 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="center">Centre</option>
                    <option value="tile">Tiled (repeat)</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Opacity: {Math.round(opacity * 100)}%
                </span>
                <input
                  type="range"
                  min={5}
                  max={100}
                  value={opacity * 100}
                  onChange={(e) => setOpacity(Number(e.target.value) / 100)}
                  disabled={disabled}
                  className="w-full accent-primary-600"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Font size: {fontSize}pt
                  </span>
                  <input
                    type="range"
                    min={12}
                    max={120}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    disabled={disabled}
                    className="w-full accent-primary-600"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Rotation: {rotation}°
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={90}
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    disabled={disabled}
                    className="w-full accent-primary-600"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <span className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Watermark image
                </span>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  disabled={disabled}
                  onChange={(e) => setWmImage(e.target.files?.[0] ?? null)}
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={disabled}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                >
                  {wmImage ? wmImage.name : "Choose image (PNG or JPG)"}
                </button>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Opacity: {Math.round(opacity * 100)}%
                </span>
                <input
                  type="range"
                  min={5}
                  max={100}
                  value={opacity * 100}
                  onChange={(e) => setOpacity(Number(e.target.value) / 100)}
                  disabled={disabled}
                  className="w-full accent-primary-600"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Size: {Math.round(imageScale * 100)}% of page width
                </span>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={imageScale * 100}
                  onChange={(e) => setImageScale(Number(e.target.value) / 100)}
                  disabled={disabled}
                  className="w-full accent-primary-600"
                />
              </label>
            </div>
          )}
        </>
      )}

      {state === "processing" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Applying watermark…</span>
            <span className="font-medium text-neutral-800">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      )}

      {pdfFile && state !== "processing" && (
        <Button size="lg" className="gap-2" onClick={handleApply}>
          <Stamp className="h-4 w-4" strokeWidth={1.75} />
          Apply watermark
        </Button>
      )}
    </div>
  );
}
