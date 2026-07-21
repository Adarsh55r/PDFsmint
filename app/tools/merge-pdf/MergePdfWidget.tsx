"use client";

import { useCallback, useState } from "react";
import { ArrowDown, ArrowUp, Download, FileText, Plus, RefreshCw, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { triggerDownload } from "@/lib/download";
import { formatBytes } from "@/lib/format-bytes";
import { mergePdf } from "@/lib/pdf-utils/merge-pdf";
import { toFriendlyMessage } from "@/lib/tool-error";

const MAX_PDF_SIZE_BYTES = 100 * 1024 * 1024;
const MAX_MERGE_FILES = 30;
const MAX_MERGE_TOTAL_BYTES = 150 * 1024 * 1024;
const PDF_ACCEPT: Record<string, string[]> = { "application/pdf": [".pdf"] };

type QueuedFile = { id: string; file: File };
type WidgetState = "idle" | "processing" | "result";

export function MergePdfWidget() {
  const [items, setItems] = useState<QueuedFile[]>([]);
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

  const handleMerge = useCallback(async () => {
    if (items.length < 2) {
      setError("Add at least two PDF files to merge.");
      return;
    }
    setState("processing");
    setProgress(0);
    setError(null);

    try {
      const blob = await mergePdf(
        items.map((item) => item.file),
        setProgress,
      );
      setResultBlob(blob);
      setState("result");
    } catch (err) {
      setError(toFriendlyMessage(err, "Failed to merge PDFs. Please try again."));
      setState("idle");
      setProgress(0);
    }
  }, [items]);

  const reset = useCallback(() => {
    setItems([]);
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
            Your merged PDF is ready
          </p>
          <p className="text-sm text-neutral-600">
            {items.length} files combined · {formatBytes(resultBlob.size)}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => triggerDownload(resultBlob, "merged.pdf")}
          >
            <Download className="h-4 w-4" strokeWidth={1.75} />
            Download merged PDF
          </Button>
          <Button variant="secondary" size="lg" className="gap-2" onClick={reset}>
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            Merge more files
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FileDropzone
        accept={PDF_ACCEPT}
        multiple
        maxSizeBytes={MAX_PDF_SIZE_BYTES}
        maxFiles={MAX_MERGE_FILES}
        maxTotalBytes={MAX_MERGE_TOTAL_BYTES}
        currentFileCount={items.length}
        currentTotalBytes={totalBytes}
        disabled={state === "processing"}
        error={error}
        hint={`PDF only · up to ${MAX_MERGE_FILES} files, 150 MB total`}
        onValidationError={setError}
        onFilesAccepted={addFiles}
      />

      {items.length > 0 && (
        <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200">
          {items.map((item, index) => (
            <li key={item.id} className="flex items-center gap-3 px-4 py-3">
              <FileText className="h-5 w-5 shrink-0 text-primary-600" strokeWidth={1.75} />
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
                  disabled={index === 0 || state === "processing"}
                  aria-label={`Move ${item.file.name} up`}
                  className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1 || state === "processing"}
                  aria-label={`Move ${item.file.name} down`}
                  className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={state === "processing"}
                  aria-label={`Remove ${item.file.name}`}
                  className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {state === "processing" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Merging…</span>
            <span className="font-medium text-neutral-800">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
          <p className="text-xs text-neutral-500">
            Processing locally in your browser — your files are never uploaded.
          </p>
        </div>
      )}

      {items.length > 0 && state !== "processing" && (
        <div className="flex items-center gap-3">
          <Button size="lg" className="gap-2" onClick={handleMerge}>
            <Plus className="h-4 w-4" strokeWidth={1.75} />
            Merge {items.length} PDF{items.length > 1 ? "s" : ""}
          </Button>
        </div>
      )}
    </div>
  );
}
