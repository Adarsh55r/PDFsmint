"use client";

import { useCallback, useState } from "react";
import { ArrowDown, ArrowUp, Download, FileImage, RefreshCw, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { triggerDownload } from "@/lib/download";
import { formatBytes } from "@/lib/format-bytes";
import { jpgToPdf, type PageSizeOption } from "@/lib/pdf-utils/jpg-to-pdf";
import { toFriendlyMessage } from "@/lib/tool-error";

const MAX_IMAGE_SIZE_BYTES = 30 * 1024 * 1024;
const MAX_IMAGE_FILES = 30;
const MAX_IMAGE_TOTAL_BYTES = 150 * 1024 * 1024;
const IMAGE_ACCEPT: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

type QueuedFile = { id: string; file: File };
type WidgetState = "idle" | "processing" | "result";

export function JpgToPdfWidget() {
  const [items, setItems] = useState<QueuedFile[]>([]);
  const [pageSize, setPageSize] = useState<PageSizeOption>("fit");
  const [state, setState] = useState<WidgetState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const totalBytes = items.reduce((sum, item) => sum + item.file.size, 0);

  const addFiles = useCallback((files: File[]) => {
    // Files arrive already validated + capped by FileDropzone; just queue them.
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        file,
      })),
    ]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const move = useCallback((index: number, direction: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  }, []);

  const handleConvert = useCallback(async () => {
    if (items.length === 0) {
      setError("Add at least one image.");
      return;
    }
    setState("processing");
    setProgress(0);
    setError(null);

    try {
      const blob = await jpgToPdf(
        items.map((item) => item.file),
        { pageSize },
        setProgress,
      );
      setResultBlob(blob);
      setState("result");
    } catch (err) {
      setError(toFriendlyMessage(err, "Failed to create PDF. Please try again."));
      setState("idle");
      setProgress(0);
    }
  }, [items, pageSize]);

  const reset = useCallback(() => {
    setItems([]);
    setPageSize("fit");
    setState("idle");
    setProgress(0);
    setError(null);
    setResultBlob(null);
  }, []);

  if (state === "result" && resultBlob) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-5">
          <p className="mb-1 text-sm font-medium text-primary-900">
            Your PDF is ready
          </p>
          <p className="text-sm text-neutral-600">
            {items.length} image{items.length > 1 ? "s" : ""} · {formatBytes(resultBlob.size)}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => triggerDownload(resultBlob, "images.pdf")}
          >
            <Download className="h-4 w-4" strokeWidth={1.75} />
            Download PDF
          </Button>
          <Button variant="secondary" size="lg" className="gap-2" onClick={reset}>
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            Convert more images
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept={IMAGE_ACCEPT}
        multiple
        maxSizeBytes={MAX_IMAGE_SIZE_BYTES}
        maxFiles={MAX_IMAGE_FILES}
        maxTotalBytes={MAX_IMAGE_TOTAL_BYTES}
        currentFileCount={items.length}
        currentTotalBytes={totalBytes}
        disabled={state === "processing"}
        error={error}
        hint={`JPG or PNG · up to ${MAX_IMAGE_FILES} images, 150 MB total`}
        onValidationError={setError}
        onFilesAccepted={addFiles}
      />

      {items.length > 0 && (
        <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200">
          {items.map((item, index) => (
            <li key={item.id} className="flex items-center gap-3 px-4 py-3">
              <FileImage className="h-5 w-5 shrink-0 text-primary-600" strokeWidth={1.75} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-800">
                  {item.file.name}
                </p>
                <p className="text-xs text-neutral-500">
                  {formatBytes(item.file.size)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move ${item.file.name} up`}
                  className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  aria-label={`Move ${item.file.name} down`}
                  className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.file.name}`}
                  className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <fieldset className="space-y-3" disabled={state === "processing"}>
        <legend className="text-sm font-medium text-neutral-700">Page size</legend>
        <div className="flex flex-wrap gap-3">
          {(
            [
              { value: "fit", label: "Fit to image" },
              { value: "a4", label: "A4" },
              { value: "letter", label: "US Letter" },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                pageSize === opt.value
                  ? "border-primary-500 bg-primary-50 text-primary-800"
                  : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
              }`}
            >
              <input
                type="radio"
                name="page-size"
                value={opt.value}
                checked={pageSize === opt.value}
                onChange={() => setPageSize(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {state === "processing" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Building PDF…</span>
            <span className="font-medium text-neutral-800">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      )}

      {items.length > 0 && state !== "processing" && (
        <Button size="lg" className="gap-2" onClick={handleConvert}>
          <FileImage className="h-4 w-4" strokeWidth={1.75} />
          Convert to PDF
        </Button>
      )}
    </div>
  );
}
