export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatReductionPercent(original: number, compressed: number): string {
  if (original <= 0) return "0";
  const reduction = ((original - compressed) / original) * 100;
  return reduction > 0 ? reduction.toFixed(1) : "0";
}
