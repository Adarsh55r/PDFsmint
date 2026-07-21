"use client";

import { useCallback, useState } from "react";
import { Download, FileImage, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { triggerDownload } from "@/lib/download";
import { formatBytes } from "@/lib/format-bytes";
import {
  convertToJpg,
  type ConvertToJpgResult,
} from "@/lib/image-utils/convert-to-jpg";
import { toFriendlyMessage } from "@/lib/tool-error";

const MAX_IMAGE_SIZE_BYTES = 30 * 1024 * 1024;
const IMAGE_ACCEPT: Record<string, string[]> = {
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "image/bmp": [".bmp"],
  "image/jpeg": [".jpg", ".jpeg"],
};

type WidgetState = "idle" | "ready" | "processing" | "result";

export function ConvertToJpgWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(92);
  const [state, setState] = useState<WidgetState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConvertToJpgResult | null>(null);

  const handleFiles = useCallback((files: File[]) => {
    setFile(files[0] ?? null);
    setError(null);
    setResult(null);
    setState(files[0] ? "ready" : "idle");
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) return;
    setState("processing");
    setProgress(0);
    setError(null);

    try {
      const res = await convertToJpg(file, { quality: quality / 100 }, setProgress);
      setResult(res);
      setState("result");
    } catch (err) {
      setError(toFriendlyMessage(err, "Failed to convert this image. Please try again."));
      setState("ready");
      setProgress(0);
    }
  }, [file, quality]);

  const reset = useCallback(() => {
    setFile(null);
    setQuality(92);
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
            Converted to JPG
          </p>
          <p className="text-sm text-neutral-600">
            {result.fileName} · {formatBytes(result.blob.size)}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => triggerDownload(result.blob, result.fileName)}
          >
            <Download className="h-4 w-4" strokeWidth={1.75} />
            Download JPG
          </Button>
          <Button variant="secondary" size="lg" className="gap-2" onClick={reset}>
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            Convert another image
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
        hint="PNG, WebP, GIF, BMP · Max 30 MB"
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
              JPG quality: {quality}%
            </span>
            <input
              type="range"
              min={40}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              disabled={disabled}
              className="w-full accent-primary-600"
            />
          </label>
        </>
      )}

      {state === "processing" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Converting…</span>
            <span className="font-medium text-neutral-800">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      )}

      {file && state === "ready" && (
        <Button size="lg" className="gap-2" onClick={handleConvert}>
          <FileImage className="h-4 w-4" strokeWidth={1.75} />
          Convert to JPG
        </Button>
      )}
    </div>
  );
}
