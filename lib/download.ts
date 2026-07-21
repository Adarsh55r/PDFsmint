/** Trigger a browser download for a Blob without leaving the page. */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export type NamedBlob = {
  name: string;
  blob: Blob;
};

/** Bundle multiple named blobs into a single ZIP archive (client-side). */
export async function zipBlobs(files: NamedBlob[]): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.name, file.blob);
  }
  return zip.generateAsync({ type: "blob", compression: "DEFLATE" });
}

/** Replace a file's extension (e.g. "report.pdf" -> "report.docx"). */
export function replaceExtension(filename: string, newExtension: string): string {
  const base = filename.replace(/\.[^./\\]+$/, "");
  const ext = newExtension.startsWith(".") ? newExtension : `.${newExtension}`;
  return `${base}${ext}`;
}
