"use client";

import { useCallback, useState } from "react";
import { Download, LayoutGrid, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { triggerDownload } from "@/lib/download";
import { formatBytes } from "@/lib/format-bytes";
import {
  defaultOrientationFor,
  generateNUpLayout,
  NUP_GRIDS,
  type NUpLayoutResult,
  type NUpOrientation,
  type NUpPageSize,
  type NUpPagesPerSheet,
} from "@/lib/pdf-utils/pdf-layout";
import { toFriendlyMessage } from "@/lib/tool-error";

const MAX_PDF_SIZE_BYTES = 50 * 1024 * 1024;
const PDF_ACCEPT: Record<string, string[]> = { "application/pdf": [".pdf"] };

type WidgetState = "idle" | "ready" | "processing" | "result";

const PAGES_PER_SHEET_OPTIONS: NUpPagesPerSheet[] = [2, 4, 6, 9];

function LayoutPreview({
  pagesPerSheet,
  orientation,
}: {
  pagesPerSheet: NUpPagesPerSheet;
  orientation: NUpOrientation;
}) {
  const { rows, cols, label } = NUP_GRIDS[pagesPerSheet];
  const isLandscape = orientation === "landscape";

  return (
    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-neutral-50/80 p-4">
      <div
        className={`grid shrink-0 gap-1 rounded-md border border-neutral-300 bg-white p-1.5 shadow-soft ${
          isLandscape ? "h-16 w-24" : "h-24 w-16"
        }`}
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
        aria-hidden
      >
        {Array.from({ length: pagesPerSheet }).map((_, i) => (
          <div
            key={i}
            className="rounded-[2px] border border-primary-200 bg-primary-50"
          />
        ))}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-neutral-900">
          {pagesPerSheet}-up layout ({label})
        </p>
        <p className="mt-0.5 text-xs text-neutral-500">
          {isLandscape ? "Landscape" : "Portrait"} sheet · pages fill left to
          right, top to bottom
        </p>
      </div>
    </div>
  );
}

export function PdfLayoutWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [pagesPerSheet, setPagesPerSheet] = useState<NUpPagesPerSheet>(2);
  const [orientation, setOrientation] = useState<NUpOrientation>("landscape");
  const [pageSize, setPageSize] = useState<NUpPageSize>("a4");
  const [showBorders, setShowBorders] = useState(true);
  const [orientationTouched, setOrientationTouched] = useState(false);

  const [state, setState] = useState<WidgetState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NUpLayoutResult | null>(null);

  const handleFiles = useCallback((files: File[]) => {
    const next = files[0] ?? null;
    setFile(next);
    setError(null);
    setResult(null);
    setState(next ? "ready" : "idle");
  }, []);

  const handlePagesPerSheetChange = useCallback(
    (value: NUpPagesPerSheet) => {
      setPagesPerSheet(value);
      if (!orientationTouched) {
        setOrientation(defaultOrientationFor(value));
      }
    },
    [orientationTouched],
  );

  const handleGenerate = useCallback(async () => {
    if (!file) {
      setError("Please add a PDF first.");
      return;
    }

    setState("processing");
    setProgress(0);
    setError(null);

    try {
      const layoutResult = await generateNUpLayout(
        file,
        { pagesPerSheet, orientation, pageSize, showBorders },
        setProgress,
      );
      setResult(layoutResult);
      setState("result");
    } catch (err) {
      setError(
        toFriendlyMessage(
          err,
          "Something went wrong while creating the layout. Please try again.",
        ),
      );
      setState("ready");
      setProgress(0);
    }
  }, [file, pagesPerSheet, orientation, pageSize, showBorders]);

  const reset = useCallback(() => {
    setFile(null);
    setState("idle");
    setProgress(0);
    setError(null);
    setResult(null);
    setPagesPerSheet(2);
    setOrientation("landscape");
    setPageSize("a4");
    setShowBorders(true);
    setOrientationTouched(false);
  }, []);

  if (state === "result" && result) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-5">
          <p className="mb-1 text-sm font-medium text-primary-900">
            Layout ready
          </p>
          <p className="text-sm text-neutral-700">
            {result.sourcePageCount} pages → {result.outputSheetCount} sheet
            {result.outputSheetCount === 1 ? "" : "s"} ({result.pagesPerSheet}
            -up)
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {formatBytes(result.blob.size)} · {result.fileName}
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
          <Button
            variant="secondary"
            size="lg"
            className="gap-2"
            onClick={reset}
          >
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            Create another layout
          </Button>
        </div>
      </div>
    );
  }

  const disabled = state === "processing";

  return (
    <div className="space-y-5">
      <FileDropzone
        accept={PDF_ACCEPT}
        maxSizeBytes={MAX_PDF_SIZE_BYTES}
        disabled={disabled}
        error={error}
        hint="PDF only · Max 50 MB · Up to 150 pages"
        onValidationError={setError}
        onFilesAccepted={handleFiles}
      />

      {file && (
        <>
          <p className="break-anywhere text-sm text-neutral-600">
            Selected:{" "}
            <span className="font-medium text-neutral-800">{file.name}</span>{" "}
            ({formatBytes(file.size)})
          </p>

          <fieldset className="space-y-3" disabled={disabled}>
            <legend className="text-sm font-medium text-neutral-700">
              Pages per sheet
            </legend>
            <div className="flex flex-wrap gap-2">
              {PAGES_PER_SHEET_OPTIONS.map((value) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    pagesPerSheet === value
                      ? "border-primary-500 bg-primary-50 text-primary-800"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="pages-per-sheet"
                    value={value}
                    checked={pagesPerSheet === value}
                    onChange={() => handlePagesPerSheetChange(value)}
                    className="sr-only"
                  />
                  {value}-up
                </label>
              ))}
            </div>
          </fieldset>

          <LayoutPreview
            pagesPerSheet={pagesPerSheet}
            orientation={orientation}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <fieldset className="space-y-3" disabled={disabled}>
              <legend className="text-sm font-medium text-neutral-700">
                Orientation
              </legend>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { value: "portrait", label: "Portrait" },
                    { value: "landscape", label: "Landscape" },
                  ] as const
                ).map((opt) => (
                  <label
                    key={opt.value}
                    className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      orientation === opt.value
                        ? "border-primary-500 bg-primary-50 text-primary-800"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="orientation"
                      value={opt.value}
                      checked={orientation === opt.value}
                      onChange={() => {
                        setOrientationTouched(true);
                        setOrientation(opt.value);
                      }}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-3" disabled={disabled}>
              <legend className="text-sm font-medium text-neutral-700">
                Sheet size
              </legend>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { value: "a4", label: "A4" },
                    { value: "letter", label: "Letter" },
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
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3">
            <input
              type="checkbox"
              checked={showBorders}
              disabled={disabled}
              onChange={(e) => setShowBorders(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-500"
            />
            <span>
              <span className="block text-sm font-medium text-neutral-800">
                Show borders between pages
              </span>
              <span className="mt-0.5 block text-xs text-neutral-500">
                Adds a thin outline around each page slot for clearer separation
                when printing.
              </span>
            </span>
          </label>

          {state === "processing" ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-700">
                Generating layout… {Math.round(progress)}%
              </p>
              <ProgressBar value={progress} />
            </div>
          ) : (
            <Button
              size="lg"
              className="w-full gap-2 sm:w-auto"
              onClick={handleGenerate}
            >
              <LayoutGrid className="h-4 w-4" strokeWidth={1.75} />
              Generate layout
            </Button>
          )}
        </>
      )}
    </div>
  );
}
