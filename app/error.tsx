"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced in the browser console for debugging; no data leaves the device.
    console.error(error);
  }, [error]);

  return (
    <Container size="narrow" className="py-20 lg:py-28">
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle className="h-7 w-7" strokeWidth={1.75} aria-hidden />
        </span>
        <h1 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">
          Something went wrong
        </h1>
        <p className="mb-8 text-base text-muted">
          An unexpected error occurred while loading this page. Your files are
          safe — nothing is ever uploaded. Try again, or head back to the
          homepage.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="gap-2" onClick={reset}>
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Try again
          </Button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-neutral-100 px-6 py-3 text-base font-medium text-neutral-800 transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
          >
            Back to home
          </Link>
        </div>
      </div>
    </Container>
  );
}
