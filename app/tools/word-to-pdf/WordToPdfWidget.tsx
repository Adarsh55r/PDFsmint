"use client";

import { useCallback, useState } from "react";
import { Download, FileText, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { triggerDownload } from "@/lib/download";
import { formatBytes } from "@/lib/format-bytes";
import { wordToPdf, type WordToPdfResult } from "@/lib/pdf-utils/word-to-pdf";
import { toFriendlyMessage } from "@/lib/tool-error";

const MAX_DOCX_SIZE_BYTES = 25 * 1024 * 1024;
const DOCX_ACCEPT: Record<string, string[]> = {
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
};

type WidgetState = "idle" | "processing" | "result";

export function WordToPdfWidget() {
  const [state, setState] = useState<WidgetState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WordToPdfResult | null>(null);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setState("processing");
    setProgress(0);
    setError(null);

    try {
      const res = await wordToPdf(file, setProgress);
      setResult(res);
      setState("result");
    } catch (err) {
      setError(toFriendlyMessage(err, "Failed to convert this document. Please try again."));
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
            PDF created
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
            Download PDF
          </Button>
          <Button variant="secondary" size="lg" className="gap-2" onClick={reset}>
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            Convert another document
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-medium">About fidelity</p>
        <p className="mt-1 text-amber-700">
          Common formatting — headings, lists, tables, bold/italic, and images —
          is reproduced well. This isn&rsquo;t a pixel-perfect Word renderer, so
          intricate layouts may shift slightly. Only .docx files are supported.
        </p>
      </div>

      <FileDropzone
        accept={DOCX_ACCEPT}
        maxSizeBytes={MAX_DOCX_SIZE_BYTES}
        disabled={state === "processing"}
        error={error}
        hint=".docx only · Max 25 MB"
        onValidationError={setError}
        onFilesAccepted={handleFiles}
      />

      {state === "processing" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Rendering to PDF…</span>
            <span className="font-medium text-neutral-800">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
          <p className="flex items-center gap-1.5 text-xs text-neutral-500">
            <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
            Processing locally — your document never leaves your browser.
          </p>
        </div>
      )}
    </div>
  );
}
