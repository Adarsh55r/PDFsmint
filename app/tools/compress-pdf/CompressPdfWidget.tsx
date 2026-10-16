"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Gauge, RefreshCw, Sparkles, X, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatBytes, formatReductionPercent } from "@/lib/format-bytes";
import {
  compressPdf,
  getCompressionErrorMessage,
  type CompressionLevel,
  type CompressPdfResult,
} from "@/lib/pdf-utils/compress-pdf";

const MAX_PDF_SIZE_BYTES = 50 * 1024 * 1024;
const PDF_ACCEPT: Record<string, string[]> = { "application/pdf": [".pdf"] };

type WidgetState = "idle" | "choosing" | "processing" | "result";

type LevelOption = {
  level: CompressionLevel;
  title: string;
  savings: string;
  description: string;
  icon: LucideIcon;
  recommended?: boolean;
};

const LEVEL_OPTIONS: LevelOption[] = [
  {
    level: "extreme",
    title: "Extreme",
    savings: "Up to 40% smaller",
    description: "Strongest compression. Best for email and quick sharing.",
    icon: Zap,
  },
  {
    level: "standard",
    title: "Standard",
    savings: "Around 20% smaller",
    description: "Balanced size and quality. Great for most documents.",
    icon: Gauge,
    recommended: true,
  },
  {
    level: "low",
    title: "Low",
    savings: "Around 10% smaller",
    description: "Highest quality with the lightest possible compression.",
    icon: Sparkles,
  },
];

const LEVEL_LABELS: Record<CompressionLevel, string> = {
  extreme: "Extreme",
  standard: "Standard",
  low: "Low",
};

export function CompressPdfWidget() {
  const [state, setState] = useState<WidgetState>("idle");
  const [progress, setProgress] = useState(0);
  const [dropzoneError, setDropzoneError] = useState<string | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [result, setResult] = useState<CompressPdfResult | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const firstOptionRef = useRef<HTMLButtonElement>(null);

  const cleanupDownloadUrl = useCallback(() => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  }, [downloadUrl]);

  const reset = useCallback(() => {
    cleanupDownloadUrl();
    setState("idle");
    setProgress(0);
    setDropzoneError(null);
    setProcessError(null);
    setFileName("");
    setPendingFile(null);
    setResult(null);
    setDownloadUrl(null);
  }, [cleanupDownloadUrl]);

  const handleFiles = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (!file) return;
      cleanupDownloadUrl();
      setDropzoneError(null);
      setProcessError(null);
      setResult(null);
      setDownloadUrl(null);
      setFileName(file.name);
      setPendingFile(file);
      setState("choosing");
    },
    [cleanupDownloadUrl],
  );

  const startCompression = useCallback(
    async (level: CompressionLevel) => {
      if (!pendingFile) return;
      setState("processing");
      setProgress(0);
      setProcessError(null);

      try {
        const compressionResult = await compressPdf(pendingFile, setProgress, {
          level,
        });
        const url = URL.createObjectURL(compressionResult.blob);
        setResult(compressionResult);
        setDownloadUrl(url);
        setState("result");
      } catch (error) {
        setProcessError(getCompressionErrorMessage(error));
        setState("idle");
        setProgress(0);
        setPendingFile(null);
      }
    },
    [pendingFile],
  );

  const cancelChoosing = useCallback(() => {
    setPendingFile(null);
    setFileName("");
    setState("idle");
  }, []);

  // Focus the first option and support Escape while the dialog is open.
  useEffect(() => {
    if (state !== "choosing") return;
    firstOptionRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancelChoosing();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [state, cancelChoosing]);

  if (state === "result" && result && downloadUrl) {
    const reduction = formatReductionPercent(
      result.originalSize,
      result.compressedSize,
    );
    const savedBytes = result.originalSize - result.compressedSize;
    const isSmaller = savedBytes > 0;

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-primary-900">
              Compression complete
            </p>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-primary-700 shadow-soft">
              {LEVEL_LABELS[result.level]} preset
            </span>
          </div>
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
          {!isSmaller && (
            <p className="mt-3 text-xs text-neutral-500">
              This PDF was already well optimized, so we kept the original
              quality instead of making it larger.
            </p>
          )}
          {isSmaller && result.method === "rasterize" && (
            <p className="mt-3 text-xs text-neutral-600">
              To reach this size, pages were re-rendered as images. Text in the
              compressed file can no longer be selected, searched, or copied,
              and links or form fields are removed. Keep your original if you
              need those.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={downloadUrl}
            download={`compressed-${fileName}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-700 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <Download className="h-4 w-4" strokeWidth={1.75} />
            Download compressed PDF
          </a>
          <Button variant="secondary" size="lg" className="gap-2" onClick={reset}>
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            Compress another file
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FileDropzone
        accept={PDF_ACCEPT}
        maxSizeBytes={MAX_PDF_SIZE_BYTES}
        disabled={state === "processing" || state === "choosing"}
        error={dropzoneError ?? processError}
        hint="PDF only · Max 50 MB"
        onValidationError={setDropzoneError}
        onFilesAccepted={handleFiles}
      />

      {state === "processing" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Compressing…</span>
            <span className="font-medium text-neutral-800">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
          <p className="text-xs text-neutral-500">
            Processing locally in your browser — your file is never uploaded.
          </p>
        </div>
      )}

      {state === "choosing" && pendingFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-hidden={false}
        >
          <button
            type="button"
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
            onClick={cancelChoosing}
            aria-label="Cancel and close"
            tabIndex={-1}
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="compress-level-title"
            aria-describedby="compress-level-desc"
            className="relative max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft-xl"
          >
            <button
              type="button"
              onClick={cancelChoosing}
              aria-label="Cancel"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>

            <h2
              id="compress-level-title"
              className="text-lg font-semibold text-neutral-900"
            >
              Choose a compression level
            </h2>
            <p id="compress-level-desc" className="mt-1 text-sm text-neutral-600">
              Compressing{" "}
              <span className="font-medium text-neutral-800">
                {pendingFile.name}
              </span>{" "}
              ({formatBytes(pendingFile.size)}). Higher compression means a
              smaller file; we keep text as sharp as possible at every level.
            </p>

            <div className="mt-5 space-y-3">
              {LEVEL_OPTIONS.map((option, index) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.level}
                    ref={index === 0 ? firstOptionRef : undefined}
                    type="button"
                    onClick={() => startCompression(option.level)}
                    className="group flex w-full items-center gap-4 rounded-xl border border-neutral-200 p-4 text-left transition-colors hover:border-primary-400 hover:bg-primary-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 group-hover:bg-white">
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-neutral-900">
                          {option.title}
                        </span>
                        {option.recommended && (
                          <span className="rounded-full bg-primary-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                            Recommended
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-sm font-medium text-primary-700">
                        {option.savings}
                      </span>
                      <span className="mt-0.5 block text-xs text-neutral-500">
                        {option.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-center text-xs text-neutral-400">
              Savings are approximate and depend on your file&rsquo;s contents.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
