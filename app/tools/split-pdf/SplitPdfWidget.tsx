"use client";

import { useCallback, useState } from "react";
import { Download, RefreshCw, Scissors } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { triggerDownload, zipBlobs, type NamedBlob } from "@/lib/download";
import { formatBytes } from "@/lib/format-bytes";
import { splitPdf, type SplitMode } from "@/lib/pdf-utils/split-pdf";
import { toFriendlyMessage } from "@/lib/tool-error";

const MAX_PDF_SIZE_BYTES = 100 * 1024 * 1024;
const PDF_ACCEPT: Record<string, string[]> = { "application/pdf": [".pdf"] };

type WidgetState = "idle" | "processing" | "result";

export function SplitPdfWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<SplitMode>("each");
  const [ranges, setRanges] = useState("");
  const [state, setState] = useState<WidgetState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<NamedBlob[]>([]);

  const handleFiles = useCallback((files: File[]) => {
    setFile(files[0] ?? null);
    setError(null);
    setState("idle");
    setResults([]);
  }, []);

  const handleSplit = useCallback(async () => {
    if (!file) {
      setError("Please add a PDF file first.");
      return;
    }
    setState("processing");
    setProgress(0);
    setError(null);

    try {
      const { files: outputs } = await splitPdf(
        file,
        { mode, ranges },
        setProgress,
      );
      setResults(outputs);
      setState("result");
    } catch (err) {
      setError(toFriendlyMessage(err, "Failed to split this PDF. Please try again."));
      setState("idle");
      setProgress(0);
    }
  }, [file, mode, ranges]);

  const downloadAll = useCallback(async () => {
    if (results.length === 1) {
      triggerDownload(results[0]!.blob, results[0]!.name);
      return;
    }
    const zip = await zipBlobs(results);
    const base = file?.name.replace(/\.pdf$/i, "") ?? "split";
    triggerDownload(zip, `${base}-split.zip`);
  }, [results, file]);

  const reset = useCallback(() => {
    setFile(null);
    setMode("each");
    setRanges("");
    setState("idle");
    setProgress(0);
    setError(null);
    setResults([]);
  }, []);

  if (state === "result") {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-5">
          <p className="mb-1 text-sm font-medium text-primary-900">
            Split complete
          </p>
          <p className="text-sm text-neutral-600">
            {results.length} file{results.length > 1 ? "s" : ""} created
            {results.length > 1 ? " · downloaded as a ZIP" : ""}
          </p>
        </div>

        <ul className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-neutral-200 p-2">
          {results.map((r) => (
            <li
              key={r.name}
              className="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm hover:bg-neutral-50"
            >
              <span className="truncate text-neutral-700">{r.name}</span>
              <button
                type="button"
                onClick={() => triggerDownload(r.blob, r.name)}
                className="shrink-0 text-xs font-medium text-primary-700 hover:text-primary-800"
              >
                Download
              </button>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="gap-2" onClick={downloadAll}>
            <Download className="h-4 w-4" strokeWidth={1.75} />
            {results.length > 1 ? "Download all (ZIP)" : "Download file"}
          </Button>
          <Button variant="secondary" size="lg" className="gap-2" onClick={reset}>
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            Split another PDF
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept={PDF_ACCEPT}
        maxSizeBytes={MAX_PDF_SIZE_BYTES}
        disabled={state === "processing"}
        error={error}
        hint="PDF only · Max 100 MB"
        onValidationError={setError}
        onFilesAccepted={handleFiles}
      />

      {file && (
        <p className="text-sm text-neutral-600">
          Selected: <span className="font-medium">{file.name}</span> (
          {formatBytes(file.size)})
        </p>
      )}

      <fieldset className="space-y-3" disabled={state === "processing"}>
        <legend className="text-sm font-medium text-neutral-700">
          How should we split it?
        </legend>
        <div className="flex flex-wrap gap-3">
          {(
            [
              { value: "each", label: "Every page separately" },
              { value: "ranges", label: "Custom ranges" },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                mode === opt.value
                  ? "border-primary-500 bg-primary-50 text-primary-800"
                  : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
              }`}
            >
              <input
                type="radio"
                name="split-mode"
                value={opt.value}
                checked={mode === opt.value}
                onChange={() => setMode(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {mode === "ranges" && (
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-neutral-700">
            Page ranges
          </span>
          <input
            type="text"
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            placeholder="e.g. 1-3, 5, 8-10"
            disabled={state === "processing"}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          <span className="mt-1 block text-xs text-neutral-500">
            Each range becomes its own PDF. Separate with commas.
          </span>
        </label>
      )}

      {state === "processing" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Splitting…</span>
            <span className="font-medium text-neutral-800">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      )}

      {file && state !== "processing" && (
        <Button size="lg" className="gap-2" onClick={handleSplit}>
          <Scissors className="h-4 w-4" strokeWidth={1.75} />
          Split PDF
        </Button>
      )}
    </div>
  );
}
