"use client";

import { useCallback, useRef, useState } from "react";

export type FileDropzoneProps = {
  accept?: Record<string, string[]>;
  multiple?: boolean;
  disabled?: boolean;
  maxSizeBytes?: number;
  /** Max number of files allowed in the queue (multiple mode only). */
  maxFiles?: number;
  /** Max combined size of all queued files, in bytes (multiple mode only). */
  maxTotalBytes?: number;
  /** How many files are already queued — used to enforce maxFiles across drops. */
  currentFileCount?: number;
  /** Combined size of already-queued files — used to enforce maxTotalBytes. */
  currentTotalBytes?: number;
  error?: string | null;
  hint?: string;
  onFilesAccepted: (files: File[]) => void;
  /** Receives a summary message when files are skipped, or null to clear. */
  onValidationError?: (message: string | null) => void;
};

type Rejection = { short: string; full: string };

function formatMb(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(0);
}

/** Validate a single file's type and size. Returns null when valid. */
function validateFile(
  file: File,
  accept: FileDropzoneProps["accept"],
  maxSizeBytes?: number,
): Rejection | null {
  if (maxSizeBytes && file.size > maxSizeBytes) {
    return {
      short: "too large",
      full: `File is too large. Maximum size is ${formatMb(maxSizeBytes)} MB.`,
    };
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  const allowedExtensions = accept
    ? Object.values(accept)
        .flat()
        .map((ext) => ext.replace(".", "").toLowerCase())
    : null;

  if (allowedExtensions && extension && !allowedExtensions.includes(extension)) {
    return {
      short: "wrong format",
      full: `Invalid file type. Accepted: ${allowedExtensions.map((e) => `.${e}`).join(", ")}`,
    };
  }

  if (accept) {
    const allowedMimes = Object.keys(accept);
    const mimeMatches =
      allowedMimes.includes(file.type) ||
      file.type === "" ||
      file.type === "application/octet-stream";

    if (!mimeMatches && extension) {
      const extAllowed = allowedExtensions?.includes(extension);
      if (!extAllowed) {
        return {
          short: "wrong format",
          full: "Invalid file type. Please upload a supported file.",
        };
      }
    }
  }

  return null;
}

/** Build a friendly, per-file summary of what was added vs. skipped. */
function buildSummary(
  acceptedCount: number,
  totalCount: number,
  skipped: Array<{ name: string; short: string; full: string }>,
  multiple: boolean,
): string {
  // Single-file dropzones: just surface the one clear reason.
  if (!multiple) {
    return skipped[0] ? capitalize(skipped[0].full) : "This file could not be added.";
  }

  const list = skipped.map((s) => `${s.name} (${s.short})`).join(", ");

  if (acceptedCount === 0) {
    return `None of the ${totalCount} file${totalCount === 1 ? "" : "s"} could be added — ${list}.`;
  }

  return `${acceptedCount} of ${totalCount} files added — ${skipped.length} skipped: ${list}.`;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

let dropzoneIdCounter = 0;

export function FileDropzone({
  accept,
  multiple = false,
  disabled = false,
  maxSizeBytes,
  maxFiles,
  maxTotalBytes,
  currentFileCount = 0,
  currentTotalBytes = 0,
  error = null,
  hint,
  onFilesAccepted,
  onValidationError,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const idRef = useRef<string>("");
  if (!idRef.current) {
    dropzoneIdCounter += 1;
    idRef.current = `dropzone-${dropzoneIdCounter}`;
  }
  const hintId = `${idRef.current}-hint`;
  const errorId = `${idRef.current}-error`;

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;

      const incoming = Array.from(fileList);
      const candidates = multiple ? incoming : incoming.slice(0, 1);

      const accepted: File[] = [];
      const skipped: Array<{ name: string; short: string; full: string }> = [];

      let runningCount = currentFileCount;
      let runningTotal = currentTotalBytes;

      for (const file of candidates) {
        // 1) Per-file type + size validation (applies to every file, not just the first).
        const rejection = validateFile(file, accept, maxSizeBytes);
        if (rejection) {
          skipped.push({
            name: file.name,
            short: rejection.short,
            full: rejection.full,
          });
          continue;
        }

        // 2) Queue-wide count cap (multiple mode).
        if (multiple && maxFiles !== undefined && runningCount >= maxFiles) {
          skipped.push({
            name: file.name,
            short: `over ${maxFiles}-file limit`,
            full: `${file.name} exceeds the ${maxFiles}-file limit.`,
          });
          continue;
        }

        // 3) Queue-wide total-size cap (multiple mode).
        if (
          multiple &&
          maxTotalBytes !== undefined &&
          runningTotal + file.size > maxTotalBytes
        ) {
          skipped.push({
            name: file.name,
            short: `over ${formatMb(maxTotalBytes)} MB total`,
            full: `${file.name} would exceed the ${formatMb(maxTotalBytes)} MB total size limit.`,
          });
          continue;
        }

        accepted.push(file);
        runningCount += 1;
        runningTotal += file.size;
      }

      if (accepted.length > 0) {
        onFilesAccepted(accepted);
      }

      // Emit the summary last so it isn't clobbered by onFilesAccepted state updates.
      if (skipped.length === 0) {
        onValidationError?.(null);
      } else {
        onValidationError?.(
          buildSummary(accepted.length, candidates.length, skipped, multiple),
        );
      }
    },
    [
      accept,
      maxSizeBytes,
      maxFiles,
      maxTotalBytes,
      currentFileCount,
      currentTotalBytes,
      multiple,
      onFilesAccepted,
      onValidationError,
    ],
  );

  const acceptString = accept
    ? Object.entries(accept)
        .flatMap(([mime, exts]) => [mime, ...exts])
        .join(",")
    : undefined;

  const hasError = Boolean(error);
  const describedBy =
    [hint ? hintId : null, hasError ? errorId : null].filter(Boolean).join(" ") ||
    undefined;
  const instructions = `${multiple ? "Drop files here or activate to browse" : "Drop a file here or activate to browse"}.${hint ? ` ${hint}.` : ""}`;

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={instructions}
        aria-disabled={disabled}
        aria-describedby={describedBy}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 transition-colors ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : hasError
              ? "border-red-300 bg-red-50/50"
              : isDragging
                ? "border-primary-500 bg-primary-50"
                : "border-neutral-300 bg-white hover:border-primary-400 hover:bg-neutral-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptString}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <p className="text-sm font-medium text-neutral-700">
          Drop your file here or click to browse
        </p>
        <p id={hintId} className="mt-1 text-xs text-neutral-500">
          {hint ?? (multiple ? "Select one or more files" : "Select a file")}
        </p>
      </div>
      {error && (
        <p id={errorId} className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
