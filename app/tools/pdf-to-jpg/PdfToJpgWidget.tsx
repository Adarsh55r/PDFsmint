"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Images, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { triggerDownload, zipBlobs, type NamedBlob } from "@/lib/download";
import { pdfToImages, type PdfImageFormat } from "@/lib/pdf-utils/pdf-to-jpg";
import { toFriendlyMessage } from "@/lib/tool-error";

const MAX_PDF_SIZE_BYTES = 100 * 1024 * 1024;
const PDF_ACCEPT: Record<string, string[]> = { "application/pdf": [".pdf"] };

type WidgetState = "idle" | "processing" | "result";
type Preview = NamedBlob & { url: string };

export function PdfToJpgWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<PdfImageFormat>("jpeg");
  const [state, setState] = useState<WidgetState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleFiles = useCallback((files: File[]) => {
    setFile(files[0] ?? null);
    setError(null);
    setState("idle");
    setPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) {
      setError("Please add a PDF first.");
      return;
    }
    setState("processing");
    setProgress(0);
    setError(null);

    try {
      const images = await pdfToImages(file, { format }, setProgress);
      setPreviews(
        images.map((img) => ({ ...img, url: URL.createObjectURL(img.blob) })),
      );
      setState("result");
    } catch (err) {
      setError(toFriendlyMessage(err, "Failed to convert this PDF. Please try again."));
      setState("idle");
      setProgress(0);
    }
  }, [file, format]);

  const downloadAll = useCallback(async () => {
    if (previews.length === 1) {
      triggerDownload(previews[0]!.blob, previews[0]!.name);
      return;
    }
    const zip = await zipBlobs(previews);
    const base = file?.name.replace(/\.pdf$/i, "") ?? "pdf-images";
    triggerDownload(zip, `${base}-images.zip`);
  }, [previews, file]);

  const reset = useCallback(() => {
    setPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
    setFile(null);
    setState("idle");
    setProgress(0);
    setError(null);
  }, []);

  if (state === "result") {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-5">
          <p className="mb-1 text-sm font-medium text-primary-900">
            {previews.length} image{previews.length > 1 ? "s" : ""} created
          </p>
          <p className="text-sm text-neutral-600">
            {format === "png" ? "PNG" : "JPG"} format
            {previews.length > 1 ? " · download all as a ZIP" : ""}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => triggerDownload(p.blob, p.name)}
              className="group overflow-hidden rounded-lg border border-neutral-200 bg-white text-left transition-shadow hover:shadow-soft"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={p.name}
                className="h-32 w-full object-contain bg-neutral-50"
              />
              <span className="flex items-center justify-between gap-1 px-2 py-1.5 text-xs text-neutral-600">
                <span className="truncate">{p.name}</span>
                <Download className="h-3.5 w-3.5 shrink-0 text-primary-600" strokeWidth={2} />
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="gap-2" onClick={downloadAll}>
            <Download className="h-4 w-4" strokeWidth={1.75} />
            {previews.length > 1 ? "Download all (ZIP)" : "Download image"}
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
        <fieldset className="space-y-3" disabled={state === "processing"}>
          <legend className="text-sm font-medium text-neutral-700">
            Output format
          </legend>
          <div className="flex flex-wrap gap-3">
            {(
              [
                { value: "jpeg", label: "JPG (smaller files)" },
                { value: "png", label: "PNG (lossless)" },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  format === opt.value
                    ? "border-primary-500 bg-primary-50 text-primary-800"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                }`}
              >
                <input
                  type="radio"
                  name="img-format"
                  value={opt.value}
                  checked={format === opt.value}
                  onChange={() => setFormat(opt.value)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {state === "processing" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Rendering pages…</span>
            <span className="font-medium text-neutral-800">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      )}

      {file && state !== "processing" && (
        <Button size="lg" className="gap-2" onClick={handleConvert}>
          <Images className="h-4 w-4" strokeWidth={1.75} />
          Convert to images
        </Button>
      )}
    </div>
  );
}
