"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Calendar,
  Download,
  PenLine,
  RefreshCw,
  Trash2,
  Type,
  Upload,
} from "lucide-react";

import { SIGNATURE_FONTS, signatureFontsClassName } from "./signature-fonts";
import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { triggerDownload } from "@/lib/download";
import { formatBytes } from "@/lib/format-bytes";
import { toFriendlyMessage } from "@/lib/tool-error";
import {
  applySignaturesToPdf,
  formatSignatureDate,
  imageFileToPngDataUrl,
  loadSignPagePreviews,
  renderTextToPngDataUrl,
  type SignaturePlacement,
  type SignPagePreview,
  type SignPdfResult,
} from "@/lib/pdf-utils/sign-pdf";

const MAX_PDF_SIZE_BYTES = 50 * 1024 * 1024;
const PDF_ACCEPT: Record<string, string[]> = {
  "application/pdf": [".pdf"],
};
const IMAGE_ACCEPT: Record<string, string[]> = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
};

type WidgetState =
  | "idle"
  | "loading"
  | "editing"
  | "processing"
  | "result";

type CreatorTab = "draw" | "type" | "upload";

type DragMode = "move" | "resize";

type ActiveDrag = {
  placementId: string;
  mode: DragMode;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  origW: number;
  origH: number;
};

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function defaultPlacementSize(
  imgW: number,
  imgH: number,
  page: SignPagePreview,
): { width: number; height: number } {
  const maxW = page.canvasWidth * 0.35;
  const scale = Math.min(1, maxW / Math.max(imgW, 1));
  return {
    width: Math.max(48, imgW * scale),
    height: Math.max(24, imgH * scale),
  };
}

function DrawPad({
  onReady,
}: {
  onReady: (getDataUrl: () => string | null, clear: () => void) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<{ clear: () => void; toDataURL: (type?: string) => string; isEmpty: () => boolean } | null>(null);
  const [color, setColor] = useState("#111827");
  const [thickness, setThickness] = useState(2.2);

  useEffect(() => {
    let cancelled = false;
    let pad: { clear: () => void; toDataURL: (type?: string) => string; isEmpty: () => boolean; penColor: string; minWidth: number; maxWidth: number; off?: () => void } | null = null;

    async function init() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { default: SignaturePad } = await import("signature_pad");
      if (cancelled || !canvasRef.current) return;

      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * ratio);
      canvas.height = Math.floor(rect.height * ratio);
      const ctx = canvas.getContext("2d");
      ctx?.scale(ratio, ratio);

      pad = new SignaturePad(canvas, {
        penColor: color,
        minWidth: thickness * 0.5,
        maxWidth: thickness,
        backgroundColor: "rgba(0,0,0,0)",
      });
      padRef.current = pad;

      onReady(
        () => {
          if (!padRef.current || padRef.current.isEmpty()) return null;
          return padRef.current.toDataURL("image/png");
        },
        () => padRef.current?.clear(),
      );
    }

    void init();

    return () => {
      cancelled = true;
      padRef.current = null;
    };
    // Re-init only on mount; color/thickness updated below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const pad = padRef.current as
      | { penColor: string; minWidth: number; maxWidth: number }
      | null;
    if (!pad) return;
    pad.penColor = color;
    pad.minWidth = thickness * 0.5;
    pad.maxWidth = thickness;
  }, [color, thickness]);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
        <canvas
          ref={canvasRef}
          className="h-40 w-full touch-none sm:h-48"
          aria-label="Draw your signature"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-neutral-600">
          Color
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-10 cursor-pointer rounded border border-neutral-200 bg-white"
          />
        </label>
        <label className="flex flex-1 items-center gap-2 text-xs text-neutral-600 sm:max-w-[12rem]">
          Thickness
          <input
            type="range"
            min={1}
            max={5}
            step={0.2}
            value={thickness}
            onChange={(e) => setThickness(Number(e.target.value))}
            className="w-full"
          />
        </label>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => padRef.current?.clear()}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

export function SignPdfWidget() {
  const fontsClass = signatureFontsClassName();
  const drawGetRef = useRef<(() => string | null) | null>(null);
  const drawClearRef = useRef<(() => void) | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<SignPagePreview[]>([]);
  const [placements, setPlacements] = useState<SignaturePlacement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeAsset, setActiveAsset] = useState<{
    dataUrl: string;
    width: number;
    height: number;
  } | null>(null);

  const [tab, setTab] = useState<CreatorTab>("draw");
  const [typedName, setTypedName] = useState("");
  const [fontId, setFontId] = useState(SIGNATURE_FONTS[0]!.id);
  const [typeColor, setTypeColor] = useState("#111827");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [state, setState] = useState<WidgetState>("idle");
  const [progress, setProgress] = useState(0);
  const [loadLabel, setLoadLabel] = useState("Loading pages…");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SignPdfResult | null>(null);

  const dragRef = useRef<ActiveDrag | null>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const formId = useId();

  const reset = useCallback(() => {
    setFile(null);
    setPages([]);
    setPlacements([]);
    setSelectedId(null);
    setActiveAsset(null);
    setState("idle");
    setProgress(0);
    setError(null);
    setResult(null);
    setTypedName("");
    setUploadError(null);
    drawClearRef.current?.();
  }, []);

  const handleFiles = useCallback(async (files: File[]) => {
    const next = files[0] ?? null;
    if (!next) return;

    setFile(next);
    setError(null);
    setResult(null);
    setPlacements([]);
    setSelectedId(null);
    setActiveAsset(null);
    setPages([]);
    setState("loading");
    setProgress(0);
    setLoadLabel("Rendering pages…");

    try {
      const previews = await loadSignPagePreviews(
        next,
        setProgress,
        (_page, done, total) => {
          setLoadLabel(`Rendering page ${done} of ${total}…`);
          setPages((prev) => {
            const copy = [...prev];
            // Stream pages in order; replace if re-rendered.
            const idx = copy.findIndex((p) => p.pageIndex === _page.pageIndex);
            if (idx >= 0) copy[idx] = _page;
            else copy.push(_page);
            copy.sort((a, b) => a.pageIndex - b.pageIndex);
            return copy;
          });
        },
      );
      setPages(previews);
      setState("editing");
      setProgress(0);
    } catch (err) {
      setError(
        toFriendlyMessage(
          err,
          "Something went wrong while opening your PDF. Please try again.",
        ),
      );
      setFile(null);
      setPages([]);
      setState("idle");
    }
  }, []);

  const useDrawnSignature = useCallback(() => {
    const dataUrl = drawGetRef.current?.();
    if (!dataUrl) {
      setError("Draw your signature first, then click Use signature.");
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      setActiveAsset({
        dataUrl,
        width: img.naturalWidth || 300,
        height: img.naturalHeight || 100,
      });
      setError(null);
    };
    img.onerror = () => setError("Could not read the drawn signature.");
    img.src = dataUrl;
  }, []);

  const useTypedSignature = useCallback(async () => {
    const font = SIGNATURE_FONTS.find((f) => f.id === fontId) ?? SIGNATURE_FONTS[0]!;
    try {
      const rendered = await renderTextToPngDataUrl({
        text: typedName,
        fontFamily: font.family,
        color: typeColor,
      });
      setActiveAsset(rendered);
      setError(null);
    } catch (err) {
      setError(toFriendlyMessage(err, "Could not create a typed signature."));
    }
  }, [fontId, typedName, typeColor]);

  const handleSignatureImage = useCallback(async (files: File[]) => {
    const image = files[0];
    if (!image) return;
    setUploadError(null);
    try {
      const rendered = await imageFileToPngDataUrl(image);
      setActiveAsset(rendered);
      setError(null);
    } catch (err) {
      setUploadError(
        toFriendlyMessage(err, "Could not read that image. Try a PNG or JPG."),
      );
    }
  }, []);

  const placeOnPage = useCallback(
    (pageIndex: number, at?: { x: number; y: number }) => {
      if (!activeAsset) {
        setError("Create a signature first (draw, type, or upload).");
        return;
      }
      const page = pages.find((p) => p.pageIndex === pageIndex);
      if (!page) return;

      const size = defaultPlacementSize(
        activeAsset.width,
        activeAsset.height,
        page,
      );
      const x = at
        ? Math.max(0, Math.min(at.x - size.width / 2, page.canvasWidth - size.width))
        : (page.canvasWidth - size.width) / 2;
      const y = at
        ? Math.max(0, Math.min(at.y - size.height / 2, page.canvasHeight - size.height))
        : page.canvasHeight * 0.7;

      const placement: SignaturePlacement = {
        id: newId(),
        pageIndex,
        x,
        y,
        width: size.width,
        height: size.height,
        imageDataUrl: activeAsset.dataUrl,
        kind: "signature",
      };
      setPlacements((prev) => [...prev, placement]);
      setSelectedId(placement.id);
      setError(null);
    },
    [activeAsset, pages],
  );

  const placeDateNearSelected = useCallback(async () => {
    const page =
      pages.find((p) => p.pageIndex === (placements.find((pl) => pl.id === selectedId)?.pageIndex ?? 0)) ??
      pages[0];
    if (!page) return;

    try {
      const dateText = formatSignatureDate();
      const font = SIGNATURE_FONTS[0]!;
      const rendered = await renderTextToPngDataUrl({
        text: dateText,
        fontFamily: font.family,
        fontSize: 36,
        color: "#111827",
      });

      const selected = placements.find((p) => p.id === selectedId);
      const width = Math.min(rendered.width * 0.55, page.canvasWidth * 0.28);
      const height = (rendered.height / rendered.width) * width;
      let x = (page.canvasWidth - width) / 2;
      let y = page.canvasHeight * 0.78;
      if (selected && selected.pageIndex === page.pageIndex) {
        x = Math.min(selected.x + selected.width + 8, page.canvasWidth - width);
        y = selected.y + selected.height - height;
      }

      const placement: SignaturePlacement = {
        id: newId(),
        pageIndex: page.pageIndex,
        x: Math.max(0, x),
        y: Math.max(0, y),
        width,
        height,
        imageDataUrl: rendered.dataUrl,
        kind: "date",
      };
      setPlacements((prev) => [...prev, placement]);
      setSelectedId(placement.id);
      setError(null);
    } catch (err) {
      setError(toFriendlyMessage(err, "Could not create a date stamp."));
    }
  }, [pages, placements, selectedId]);

  const removeSelected = useCallback(() => {
    if (!selectedId) return;
    setPlacements((prev) => prev.filter((p) => p.id !== selectedId));
    setSelectedId(null);
  }, [selectedId]);

  const onPointerDownPlacement = useCallback(
    (e: ReactPointerEvent, placementId: string, mode: DragMode) => {
      e.stopPropagation();
      e.preventDefault();
      const placement = placements.find((p) => p.id === placementId);
      if (!placement) return;
      setSelectedId(placementId);
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      dragRef.current = {
        placementId,
        mode,
        startX: e.clientX,
        startY: e.clientY,
        origX: placement.x,
        origY: placement.y,
        origW: placement.width,
        origH: placement.height,
      };
    },
    [placements],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const placement = placements.find((p) => p.id === drag.placementId);
      const page = pages.find((p) => p.pageIndex === placement?.pageIndex);
      if (!placement || !page) return;

      const pageEl = pageRefs.current.get(page.pageIndex);
      if (!pageEl) return;
      const rect = pageEl.getBoundingClientRect();
      const scaleX = page.canvasWidth / rect.width;
      const scaleY = page.canvasHeight / rect.height;
      const dx = (e.clientX - drag.startX) * scaleX;
      const dy = (e.clientY - drag.startY) * scaleY;

      setPlacements((prev) =>
        prev.map((p) => {
          if (p.id !== drag.placementId) return p;
          if (drag.mode === "move") {
            return {
              ...p,
              x: Math.max(0, Math.min(drag.origX + dx, page.canvasWidth - p.width)),
              y: Math.max(0, Math.min(drag.origY + dy, page.canvasHeight - p.height)),
            };
          }
          const aspect = drag.origH / Math.max(drag.origW, 1);
          const newW = Math.max(40, Math.min(drag.origW + dx, page.canvasWidth - drag.origX));
          const newH = Math.max(20, newW * aspect);
          return {
            ...p,
            width: newW,
            height: Math.min(newH, page.canvasHeight - drag.origY),
          };
        }),
      );
    },
    [pages, placements],
  );

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const handleDownload = useCallback(async () => {
    if (!file || placements.length === 0) {
      setError("Place at least one signature or date on a page first.");
      return;
    }
    setState("processing");
    setProgress(0);
    setError(null);
    try {
      const signed = await applySignaturesToPdf(
        file,
        placements,
        pages,
        setProgress,
      );
      setResult(signed);
      setState("result");
    } catch (err) {
      setError(
        toFriendlyMessage(
          err,
          "Something went wrong while signing your PDF. Please try again.",
        ),
      );
      setState("editing");
      setProgress(0);
    }
  }, [file, pages, placements]);

  if (state === "result" && result) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-5">
          <p className="mb-1 text-sm font-medium text-primary-900">
            Signed PDF ready
          </p>
          <p className="text-sm text-neutral-700">
            {result.placementCount} stamp
            {result.placementCount === 1 ? "" : "s"} applied ·{" "}
            {formatBytes(result.blob.size)}
          </p>
          <p className="mt-1 text-xs text-neutral-500">{result.fileName}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => triggerDownload(result.blob, result.fileName)}
          >
            <Download className="h-4 w-4" strokeWidth={1.75} />
            Download signed PDF
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="gap-2"
            onClick={reset}
          >
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            Sign another PDF
          </Button>
        </div>
      </div>
    );
  }

  const disabled = state === "loading" || state === "processing";
  const selectedFont =
    SIGNATURE_FONTS.find((f) => f.id === fontId) ?? SIGNATURE_FONTS[0]!;

  return (
    <div className={`space-y-5 ${fontsClass}`}>
      {state === "idle" || !file ? (
        <FileDropzone
          accept={PDF_ACCEPT}
          maxSizeBytes={MAX_PDF_SIZE_BYTES}
          disabled={disabled}
          error={error}
          hint="PDF only · Max 50 MB · Up to 150 pages"
          onValidationError={setError}
          onFilesAccepted={handleFiles}
        />
      ) : null}

      {(state === "loading" || (file && pages.length > 0)) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="break-anywhere text-sm text-neutral-600">
            Selected:{" "}
            <span className="font-medium text-neutral-800">{file?.name}</span>
            {file ? ` (${formatBytes(file.size)})` : null}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={reset}
          >
            Choose another file
          </Button>
        </div>
      )}

      {state === "loading" && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-700">
            {loadLabel} {Math.round(progress)}%
          </p>
          <ProgressBar value={progress} />
        </div>
      )}

      {error && state !== "idle" && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      {state === "editing" || state === "processing" ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          {/* Signature creator */}
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                Create signature
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500">
                Draw, type, or upload — then place it on any page.
              </p>
            </div>

            <div
              className="flex rounded-lg border border-neutral-200 p-1"
              role="tablist"
              aria-label="Signature method"
            >
              {(
                [
                  { id: "draw", label: "Draw", icon: PenLine },
                  { id: "type", label: "Type", icon: Type },
                  { id: "upload", label: "Upload", icon: Upload },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  disabled={disabled}
                  onClick={() => setTab(id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium transition-colors ${
                    tab === id
                      ? "bg-primary-50 text-primary-800"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {label}
                </button>
              ))}
            </div>

            {tab === "draw" && (
              <div className="space-y-3">
                <DrawPad
                  onReady={(get, clear) => {
                    drawGetRef.current = get;
                    drawClearRef.current = clear;
                  }}
                />
                <Button
                  type="button"
                  className="w-full"
                  disabled={disabled}
                  onClick={useDrawnSignature}
                >
                  Use signature
                </Button>
              </div>
            )}

            {tab === "type" && (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-neutral-700" htmlFor={`${formId}-name`}>
                  Your name
                </label>
                <input
                  id={`${formId}-name`}
                  type="text"
                  value={typedName}
                  disabled={disabled}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
                <fieldset className="space-y-2" disabled={disabled}>
                  <legend className="text-xs font-medium text-neutral-700">
                    Font
                  </legend>
                  <div className="grid gap-2">
                    {SIGNATURE_FONTS.map((font) => (
                      <label
                        key={font.id}
                        className={`flex cursor-pointer items-center rounded-lg border px-3 py-2 ${
                          fontId === font.id
                            ? "border-primary-500 bg-primary-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="sig-font"
                          className="sr-only"
                          checked={fontId === font.id}
                          onChange={() => setFontId(font.id)}
                        />
                        <span className={`text-lg text-neutral-900 ${font.className}`}>
                          {typedName.trim() || font.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="flex items-center gap-2 text-xs text-neutral-600">
                  Color
                  <input
                    type="color"
                    value={typeColor}
                    disabled={disabled}
                    onChange={(e) => setTypeColor(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border border-neutral-200"
                  />
                </label>
                {typedName.trim() ? (
                  <p
                    className={`rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-3 text-2xl ${selectedFont.className}`}
                    style={{ color: typeColor }}
                  >
                    {typedName}
                  </p>
                ) : null}
                <Button
                  type="button"
                  className="w-full"
                  disabled={disabled || !typedName.trim()}
                  onClick={useTypedSignature}
                >
                  Use signature
                </Button>
              </div>
            )}

            {tab === "upload" && (
              <div className="space-y-3">
                <FileDropzone
                  accept={IMAGE_ACCEPT}
                  maxSizeBytes={5 * 1024 * 1024}
                  disabled={disabled}
                  error={uploadError}
                  hint="PNG, JPG, or WebP · Max 5 MB"
                  onValidationError={setUploadError}
                  onFilesAccepted={handleSignatureImage}
                />
              </div>
            )}

            {activeAsset && (
              <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-3">
                <p className="mb-2 text-xs font-medium text-primary-900">
                  Ready to place
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeAsset.dataUrl}
                  alt="Signature preview"
                  className="mx-auto max-h-16 object-contain"
                />
                <p className="mt-2 text-xs text-neutral-500">
                  Click a page (or use the button below) to place. Drag to move;
                  use the corner handle to resize.
                </p>
                <Button
                  type="button"
                  size="sm"
                  className="mt-3 w-full"
                  disabled={disabled || pages.length === 0}
                  onClick={() => placeOnPage(pages[0]?.pageIndex ?? 0)}
                >
                  Place on page 1
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-2 border-t border-neutral-100 pt-4">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="gap-2"
                disabled={disabled || pages.length === 0}
                onClick={placeDateNearSelected}
              >
                <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
                Add today&apos;s date
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-2 text-red-700 hover:bg-red-50"
                disabled={disabled || !selectedId}
                onClick={removeSelected}
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                Remove selected
              </Button>
            </div>

            {state === "processing" ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-neutral-700">
                  Applying signatures… {Math.round(progress)}%
                </p>
                <ProgressBar value={progress} />
              </div>
            ) : (
              <Button
                type="button"
                size="lg"
                className="w-full gap-2"
                disabled={placements.length === 0}
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" strokeWidth={1.75} />
                Download signed PDF
              </Button>
            )}
          </aside>

          {/* Page previews */}
          <div
            className="max-h-[70vh] space-y-6 overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-50/60 p-3 sm:p-4"
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {pages.map((page) => {
              const pagePlacements = placements.filter(
                (p) => p.pageIndex === page.pageIndex,
              );
              return (
                <div key={page.pageIndex} className="space-y-2">
                  <p className="text-xs font-medium text-neutral-500">
                    Page {page.pageIndex + 1}
                  </p>
                  <div
                    ref={(el) => {
                      if (el) pageRefs.current.set(page.pageIndex, el);
                      else pageRefs.current.delete(page.pageIndex);
                    }}
                    className="relative mx-auto w-full max-w-3xl cursor-crosshair overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-soft"
                    style={{ aspectRatio: `${page.canvasWidth} / ${page.canvasHeight}` }}
                    onClick={(e) => {
                      if (!activeAsset || dragRef.current) return;
                      const el = e.currentTarget;
                      const rect = el.getBoundingClientRect();
                      const x =
                        ((e.clientX - rect.left) / rect.width) * page.canvasWidth;
                      const y =
                        ((e.clientY - rect.top) / rect.height) * page.canvasHeight;
                      placeOnPage(page.pageIndex, { x, y });
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={page.dataUrl}
                      alt={`Page ${page.pageIndex + 1}`}
                      className="pointer-events-none block h-full w-full select-none"
                      draggable={false}
                    />
                    {pagePlacements.map((placement) => {
                      const selected = placement.id === selectedId;
                      return (
                        <div
                          key={placement.id}
                          role="button"
                          tabIndex={0}
                          aria-label={`${placement.kind} on page ${page.pageIndex + 1}`}
                          className={`absolute touch-none ${
                            selected
                              ? "ring-2 ring-primary-500"
                              : "ring-1 ring-primary-300/80"
                          }`}
                          style={{
                            left: `${(placement.x / page.canvasWidth) * 100}%`,
                            top: `${(placement.y / page.canvasHeight) * 100}%`,
                            width: `${(placement.width / page.canvasWidth) * 100}%`,
                            height: `${(placement.height / page.canvasHeight) * 100}%`,
                          }}
                          onPointerDown={(e) =>
                            onPointerDownPlacement(e, placement.id, "move")
                          }
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedId(placement.id);
                            }
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={placement.imageDataUrl}
                            alt=""
                            className="pointer-events-none h-full w-full object-contain"
                            draggable={false}
                          />
                          {selected && (
                            <span
                              className="absolute -bottom-1.5 -right-1.5 h-4 w-4 cursor-se-resize rounded-full border-2 border-white bg-primary-600 shadow"
                              onPointerDown={(e) =>
                                onPointerDownPlacement(e, placement.id, "resize")
                              }
                              aria-hidden
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {activeAsset && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={disabled}
                      onClick={() => placeOnPage(page.pageIndex)}
                    >
                      Place signature here
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
