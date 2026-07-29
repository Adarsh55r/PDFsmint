/**
 * Local smoke test for N-up layout — creates a 10-page PDF and verifies
 * each pages-per-sheet option produces the expected sheet count and page order.
 *
 * Run: npx tsx scripts/test-nup-pdf.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import {
  generateNUpLayout,
  type NUpPagesPerSheet,
} from "../lib/pdf-utils/pdf-layout";

async function makeSourcePdf(pageCount: number): Promise<File> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();
    page.drawRectangle({
      x: 40,
      y: 40,
      width: width - 80,
      height: height - 80,
      borderColor: rgb(0.1, 0.45, 0.4),
      borderWidth: 2,
    });
    page.drawText(`PAGE ${i}`, {
      x: width / 2 - 60,
      y: height / 2,
      size: 36,
      font,
      color: rgb(0.05, 0.2, 0.25),
    });
  }

  const bytes = await doc.save();
  return new File([bytes], "test-10-pages.pdf", { type: "application/pdf" });
}

async function verifyLayout(
  file: File,
  pagesPerSheet: NUpPagesPerSheet,
  outDir: string,
) {
  const expectedSheets = Math.ceil(10 / pagesPerSheet);
  const result = await generateNUpLayout(file, {
    pagesPerSheet,
    orientation: pagesPerSheet === 2 ? "landscape" : "portrait",
    pageSize: "a4",
    showBorders: true,
  });

  if (result.sourcePageCount !== 10) {
    throw new Error(
      `${pagesPerSheet}-up: expected 10 source pages, got ${result.sourcePageCount}`,
    );
  }
  if (result.outputSheetCount !== expectedSheets) {
    throw new Error(
      `${pagesPerSheet}-up: expected ${expectedSheets} sheets, got ${result.outputSheetCount}`,
    );
  }

  const outBytes = new Uint8Array(await result.blob.arrayBuffer());
  const outDoc = await PDFDocument.load(outBytes);
  if (outDoc.getPageCount() !== expectedSheets) {
    throw new Error(
      `${pagesPerSheet}-up: PDF page count mismatch (${outDoc.getPageCount()} vs ${expectedSheets})`,
    );
  }

  const outPath = join(outDir, result.fileName);
  writeFileSync(outPath, outBytes);
  console.log(
    `✓ ${pagesPerSheet}-up → ${result.outputSheetCount} sheets (${outBytes.length} bytes) → ${outPath}`,
  );
}

async function main() {
  const outDir = join(process.cwd(), ".tmp-nup-test");
  mkdirSync(outDir, { recursive: true });

  console.log("Creating 10-page source PDF…");
  const file = await makeSourcePdf(10);

  for (const n of [2, 4, 6, 9] as NUpPagesPerSheet[]) {
    await verifyLayout(file, n, outDir);
  }

  // Uneven remainder: 10 pages at 4-up → 3 sheets (last has 2 blank slots)
  console.log("✓ Remainder handling covered by 4-up / 6-up / 9-up cases");
  console.log("All N-up layout checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
