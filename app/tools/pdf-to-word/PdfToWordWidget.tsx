"use client";

import { useCallback, useState } from "react";
import { Download, FileText, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { triggerDownload } from "@/lib/download";
import { formatBytes } from "@/lib/format-bytes";
import { pdfToWord, type PdfToWordResult } from "@/lib/pdf-utils/pdf-to-word";
import { toFriendlyMessage } from "@/lib/tool-error";

const MAX_PDF_SIZE_BYTES = 50 * 1024 * 1024;
const PDF_ACCEPT: Record<string, string[]> = { "application/pdf": [".pdf"] };

type WidgetState = "idle" | "processing" | "result";

export function PdfToWordWidget() {
  const [state, setState] = useState<WidgetState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PdfToWordResult | null>(null);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setState("processing");
    setProgress(0);
    setError(null);

    try {
      const res = await pdfToWord(file, setProgress);
      setResult(res);
      setState("result");
    } catch (err) {
      setError(toFriendlyMessage(err, "Failed to convert this PDF. Please try again."));
      setState("idle");
      setProgress(0);
    }
  }, []);

  const reset = useCallback(() => {
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
            Word document ready
          </p>
          <p className="text-sm text-neutral-600">
            {result.pageCount} page{result.pageCount > 1 ? "s" : ""} ·{" "}
            {result.characters.toLocaleString()} characters ·{" "}
            {formatBytes(result.blob.size)}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => triggerDownload(result.blob, result.fileName)}
          >
            <Download className="h-4 w-4" strokeWidth={1.75} />
            Download .docx
          </Button>
          <Button variant="secondary" size="lg" className="gap-2" onClick={reset}>
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            Convert another PDF
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-medium">Text-based conversion</p>
        <p className="mt-1 text-amber-700">
          This tool extracts the selectable text and paragraph flow into an
          editable Word file. It doesn&rsquo;t recreate exact page layout,
          columns, or images, and can&rsquo;t read scanned PDFs (no OCR).
        </p>
      </div>

      <FileDropzone
        accept={PDF_ACCEPT}
        maxSizeBytes={MAX_PDF_SIZE_BYTES}
        disabled={state === "processing"}
        error={error}
        hint="PDF only · Max 50 MB"
        onValidationError={setError}
        onFilesAccepted={handleFiles}
      />

      {state === "processing" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Extracting text…</span>
            <span className="font-medium text-neutral-800">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
          <p className="flex items-center gap-1.5 text-xs text-neutral-500">
            <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
            Processing locally — your file never leaves your browser.
          </p>
        </div>
      )}
    </div>
  );
}
