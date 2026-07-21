"use client";

import { useCallback, useState } from "react";
import { Download, Minimize2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { triggerDownload } from "@/lib/download";
import { formatBytes, formatReductionPercent } from "@/lib/format-bytes";
import {
  compressImage,
  type CompressImageResult,
} from "@/lib/image-utils/compress-image";
import { toFriendlyMessage } from "@/lib/tool-error";

const MAX_IMAGE_SIZE_BYTES = 30 * 1024 * 1024;
const IMAGE_ACCEPT: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

type WidgetState = "idle" | "ready" | "processing" | "result";

export function CompressImageWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(70);
  const [state, setState] = useState<WidgetState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompressImageResult | null>(null);

  const handleFiles = useCallback((files: File[]) => {
    setFile(files[0] ?? null);
    setError(null);
    setResult(null);
    setState(files[0] ? "ready" : "idle");
  }, []);

  const handleCompress = useCallback(async () => {
    if (!file) return;
    setState("processing");
    setProgress(0);
    setError(null);

    try {
      const res = await compressImage(
        file,
        { quality: quality / 100, format: "image/jpeg" },
        setProgress,
      );
      setResult(res);
      setState("result");
    } catch (err) {
      setError(toFriendlyMessage(err, "Failed to compress this image. Please try again."));
      setState("ready");
      setProgress(0);
    }
  }, [file, quality]);

  const reset = useCallback(() => {
    setFile(null);
    setQuality(70);
    setState("idle");
    setProgress(0);
    setError(null);
    setResult(null);
  }, []);

  if (state === "result" && result) {
    const reduction = formatReductionPercent(
      result.originalSize,
      result.compressedSize,
    );
    const isSmaller = result.compressedSize < result.originalSize;

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-5">
          <p className="mb-4 text-sm font-medium text-primary-900">
            Compression complete
          </p>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-neutral-500">Original size</dt>
              <dd className="text-lg font-semibold text-neutral-900">
                {formatBytes(result.originalSize)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-neutral-500">New size</dt>
              <dd className="text-lg font-semibold text-neutral-900">
                {formatBytes(result.compressedSize)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-neutral-500">Reduction</dt>
              <dd
                className={`text-lg font-semibold ${isSmaller ? "text-primary-700" : "text-neutral-700"}`}
              >
                {isSmaller ? `${reduction}% smaller` : "Already optimized"}
              </dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => triggerDownload(result.blob, result.fileName)}
          >
            <Download className="h-4 w-4" strokeWidth={1.75} />
            Download compressed image
          </Button>
          <Button variant="secondary" size="lg" className="gap-2" onClick={reset}>
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            Compress another image
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

      {file && (
        <>
          <p className="text-sm text-neutral-600">
            Selected: <span className="font-medium">{file.name}</span> (
            {formatBytes(file.size)})
          </p>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-neutral-700">
              Quality: {quality}%
            </span>
            <input
              type="range"
              min={10}
              max={95}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              disabled={disabled}
              className="w-full accent-primary-600"
            />
            <span className="mt-1 block text-xs text-neutral-500">
              Lower quality means smaller files. Around 60–75% is a good balance
              for most photos.
            </span>
          </label>
        </>
      )}

      {state === "processing" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Compressing…</span>
            <span className="font-medium text-neutral-800">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      )}

      {file && state === "ready" && (
        <Button size="lg" className="gap-2" onClick={handleCompress}>
          <Minimize2 className="h-4 w-4" strokeWidth={1.75} />
          Compress image
        </Button>
      )}
    </div>
  );
}
