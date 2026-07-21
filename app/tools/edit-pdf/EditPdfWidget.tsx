"use client";

import { useCallback, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  RefreshCw,
  RotateCw,
  Save,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { triggerDownload } from "@/lib/download";
import { formatBytes } from "@/lib/format-bytes";
import {
  loadPdfThumbnails,
  saveEditedPdf,
  type EditedPage,
} from "@/lib/pdf-utils/edit-pdf";
import { toFriendlyMessage } from "@/lib/tool-error";

const MAX_PDF_SIZE_BYTES = 80 * 1024 * 1024;
const PDF_ACCEPT: Record<string, string[]> = { "application/pdf": [".pdf"] };

type PageState = {
  id: string;
  originalIndex: number;
  rotation: number;
  thumbnail: string;
};

type WidgetState = "idle" | "loading" | "editing" | "processing" | "result";

export function EditPdfWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageState[]>([]);
  const [state, setState] = useState<WidgetState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFiles = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setError(null);
    setState("loading");
    setProgress(0);

    try {
      const { thumbnails } = await loadPdfThumbnails(f, setProgress);
      setPages(
        thumbnails.map((t) => ({
          id: `page-${t.originalIndex}`,
          originalIndex: t.originalIndex,
          rotation: 0,
          thumbnail: t.thumbnail,
        })),
      );
      setState("editing");
    } catch (err) {
      setError(toFriendlyMessage(err, "Failed to open this PDF. Please try again."));
      setState("idle");
    }
  }, []);

  const rotate = useCallback((id: string) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p,
      ),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const move = useCallback((index: number, direction: -1 | 1) => {
    setPages((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (!file) return;
    if (pages.length === 0) {
      setError("Keep at least one page before saving.");
      return;
    }
    setState("processing");
    setProgress(0);
    setError(null);

    try {
      const ops: EditedPage[] = pages.map((p) => ({
        originalIndex: p.originalIndex,
        rotation: p.rotation,
      }));
      const blob = await saveEditedPdf(file, ops, setProgress);
      setResultBlob(blob);
      setState("result");
    } catch (err) {
      setError(toFriendlyMessage(err, "Failed to save this PDF. Please try again."));
      setState("editing");
      setProgress(0);
    }
  }, [file, pages]);

  const reset = useCallback(() => {
    setFile(null);
    setPages([]);
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
            Your edited PDF is ready
          </p>
          <p className="text-sm text-neutral-600">
            {pages.length} page{pages.length > 1 ? "s" : ""} · {formatBytes(resultBlob.size)}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="gap-2"
            onClick={() =>
              triggerDownload(resultBlob, `edited-${file?.name ?? "document.pdf"}`)
            }
          >
            <Download className="h-4 w-4" strokeWidth={1.75} />
            Download PDF
          </Button>
          <Button variant="secondary" size="lg" className="gap-2" onClick={reset}>
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            Edit another PDF
          </Button>
        </div>
      </div>
    );
  }

  if (state === "editing" || state === "processing") {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-neutral-600">
            {pages.length} page{pages.length !== 1 ? "s" : ""} · rotate, reorder,
            or remove pages, then save.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {pages.map((page, index) => (
            <li
              key={page.id}
              className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white"
            >
              <div className="flex h-40 items-center justify-center overflow-hidden bg-neutral-50 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={page.thumbnail}
                  alt={`Page ${index + 1}`}
                  className="max-h-full max-w-full object-contain shadow-sm transition-transform"
                  style={{ transform: `rotate(${page.rotation}deg)` }}
                />
              </div>

              <div className="flex items-center justify-between border-t border-neutral-100 px-2 py-1.5">
                <span className="text-xs font-medium text-neutral-500">
                  {index + 1}
                </span>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0 || state === "processing"}
                    aria-label="Move left"
                    className="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 disabled:opacity-30"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === pages.length - 1 || state === "processing"}
                    aria-label="Move right"
                    className="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 disabled:opacity-30"
                  >
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => rotate(page.id)}
                    disabled={state === "processing"}
                    aria-label="Rotate 90 degrees"
                    className="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 disabled:opacity-30"
                  >
                    <RotateCw className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(page.id)}
                    disabled={state === "processing"}
                    aria-label="Delete page"
                    className="rounded p-1 text-neutral-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {state === "processing" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Saving…</span>
              <span className="font-medium text-neutral-800">{progress}%</span>
            </div>
            <ProgressBar value={progress} />
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="gap-2"
            onClick={handleSave}
            disabled={state === "processing" || pages.length === 0}
          >
            <Save className="h-4 w-4" strokeWidth={1.75} />
            Save PDF
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="gap-2"
            onClick={reset}
            disabled={state === "processing"}
          >
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            Start over
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
        disabled={state === "loading"}
        error={error}
        hint="PDF only · Max 80 MB"
        onValidationError={setError}
        onFilesAccepted={handleFiles}
      />

      {state === "loading" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Loading pages…</span>
            <span className="font-medium text-neutral-800">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      )}
    </div>
  );
}
