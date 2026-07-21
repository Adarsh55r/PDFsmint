"use client";

import { useCallback, useState } from "react";
import { Download, Link2, Link2Off, Maximize, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { triggerDownload } from "@/lib/download";
import { formatBytes } from "@/lib/format-bytes";
import type { OutputFormat } from "@/lib/image-utils/canvas";
import {
  readImageDimensions,
  resizeImage,
  type ResizeImageResult,
} from "@/lib/image-utils/resize-image";
import { toFriendlyMessage } from "@/lib/tool-error";

const MAX_IMAGE_SIZE_BYTES = 30 * 1024 * 1024;
const IMAGE_ACCEPT: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

type WidgetState = "idle" | "ready" | "processing" | "result";

export function ResizeImageWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [natural, setNatural] = useState<{ width: number; height: number } | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lockAspect, setLockAspect] = useState(true);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [state, setState] = useState<WidgetState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResizeImageResult | null>(null);

  const handleFiles = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setError(null);
    setResult(null);
    setFile(f);
    try {
      const dims = await readImageDimensions(f);
      setNatural(dims);
      setWidth(String(dims.width));
      setHeight(String(dims.height));
      setState("ready");
    } catch (err) {
      setError(toFriendlyMessage(err));
      setState("idle");
    }
  }, []);

  const handleWidthChange = useCallback(
    (value: string) => {
      setWidth(value);
      if (lockAspect && natural && value) {
        const w = Number(value);
        if (w > 0) {
          setHeight(String(Math.round((w / natural.width) * natural.height)));
        }
      }
    },
    [lockAspect, natural],
  );

  const handleHeightChange = useCallback(
    (value: string) => {
      setHeight(value);
      if (lockAspect && natural && value) {
        const h = Number(value);
        if (h > 0) {
          setWidth(String(Math.round((h / natural.height) * natural.width)));
        }
      }
    },
    [lockAspect, natural],
  );

  const handleResize = useCallback(async () => {
    if (!file) return;
    const w = Number(width);
    const h = Number(height);
    if (!w || !h || w < 1 || h < 1) {
      setError("Enter a valid width and height.");
      return;
    }
    setState("processing");
    setProgress(0);
    setError(null);

    try {
      const res = await resizeImage(
        file,
        { width: w, height: h, format, quality: 0.9 },
        setProgress,
      );
      setResult(res);
      setState("result");
    } catch (err) {
      setError(toFriendlyMessage(err, "Failed to resize this image. Please try again."));
      setState("ready");
      setProgress(0);
    }
  }, [file, width, height, format]);

  const reset = useCallback(() => {
    setFile(null);
    setNatural(null);
    setWidth("");
    setHeight("");
    setLockAspect(true);
    setFormat("image/jpeg");
    setState("idle");
    setProgress(0);
    setError(null);
    setResult(null);
  }, []);

  if (state === "result" && result) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-5">
          <p className="mb-1 text-sm font-medium text-primary-900">
            Image resized
          </p>
          <p className="text-sm text-neutral-600">
            {result.width} × {result.height} px · {formatBytes(result.blob.size)}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => triggerDownload(result.blob, result.fileName)}
          >
            <Download className="h-4 w-4" strokeWidth={1.75} />
            Download image
          </Button>
          <Button variant="secondary" size="lg" className="gap-2" onClick={reset}>
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            Resize another image
          </Button>
        </div>
      </div>
    );
  }

  const disabled = state === "processing";

  return (
    <div className="space-y-5">
      <FileDropzone
        accept={IMAGE_ACCEPT}
        maxSizeBytes={MAX_IMAGE_SIZE_BYTES}
        disabled={disabled}
        error={error}
        hint="JPG, PNG, or WebP · Max 30 MB"
        onValidationError={setError}
        onFilesAccepted={handleFiles}
      />

      {file && natural && (
        <>
          <p className="text-sm text-neutral-600">
            Original: {natural.width} × {natural.height} px ({formatBytes(file.size)})
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-neutral-700">
                Width (px)
              </span>
              <input
                type="number"
                min={1}
                value={width}
                onChange={(e) => handleWidthChange(e.target.value)}
                disabled={disabled}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-neutral-700">
                Height (px)
              </span>
              <input
                type="number"
                min={1}
                value={height}
                onChange={(e) => handleHeightChange(e.target.value)}
                disabled={disabled}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setLockAspect((v) => !v)}
              disabled={disabled}
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700"
            >
              {lockAspect ? (
                <Link2 className="h-4 w-4 text-primary-600" strokeWidth={1.75} />
              ) : (
                <Link2Off className="h-4 w-4 text-neutral-400" strokeWidth={1.75} />
              )}
              {lockAspect ? "Aspect ratio locked" : "Aspect ratio unlocked"}
            </button>

            <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
              Format
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as OutputFormat)}
                disabled={disabled}
                className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </select>
            </label>
          </div>
        </>
      )}

      {state === "processing" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Resizing…</span>
            <span className="font-medium text-neutral-800">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      )}

      {file && state === "ready" && (
        <Button size="lg" className="gap-2" onClick={handleResize}>
          <Maximize className="h-4 w-4" strokeWidth={1.75} />
          Resize image
        </Button>
      )}
    </div>
  );
}
