import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center"
      role="status"
      aria-live="polite"
    >
      <Loader2
        className="h-8 w-8 animate-spin text-primary-700"
        strokeWidth={1.75}
        aria-hidden
      />
      <p className="text-sm font-medium text-neutral-600">Loading…</p>
      <span className="sr-only">Loading page content, please wait.</span>
    </div>
  );
}
