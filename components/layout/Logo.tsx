import Link from "next/link";

type LogoMarkProps = {
  className?: string;
  /** Unique suffix for gradient ids so multiple marks can coexist on one page. */
  idSuffix?: string;
  title?: string;
};

/**
 * PDFsMint symbol — a document with a folded corner (PDF) fused with a mint
 * leaf and a flowing vein (freshness, speed, precision). Reads clearly at 24px.
 */
export function LogoMark({
  className = "h-8 w-8",
  idSuffix = "",
  title,
}: LogoMarkProps) {
  const bgId = `pm-bg-${idSuffix}`;
  const leafId = `pm-leaf-${idSuffix}`;

  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={bgId}
          x1="4"
          y1="3"
          x2="36"
          y2="37"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2dd4bf" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient
          id={leafId}
          x1="16"
          y1="13"
          x2="24"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0d9488" />
          <stop offset="1" stopColor="#115e59" />
        </linearGradient>
      </defs>

      <rect width="40" height="40" rx="11" fill={`url(#${bgId})`} />

      {/* Document with folded top-right corner */}
      <path
        d="M14 8 H22 L28.5 14.5 V29.5 A2.5 2.5 0 0 1 26 32 H14 A2.5 2.5 0 0 1 11.5 29.5 V10.5 A2.5 2.5 0 0 1 14 8 Z"
        fill="#ffffff"
      />
      <path
        d="M22 8 V12 A2.5 2.5 0 0 0 24.5 14.5 H28.5 Z"
        fill="#99f6e4"
      />

      {/* Mint leaf + flowing vein */}
      <g transform="rotate(18 20 20.5)">
        <path
          d="M20 13 C 23.5 16, 23.5 24, 20 28 C 16.5 24, 16.5 16, 20 13 Z"
          fill={`url(#${leafId})`}
        />
        <path
          d="M20 15.5 C 19.5 19, 19.6 24, 20.6 27"
          stroke="#ffffff"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  idSuffix?: string;
  /** Render as a link to the homepage. Defaults to true. */
  asLink?: boolean;
};

/** Full PDFsMint lockup: symbol + two-tone wordmark ("PDFs" + highlighted "Mint"). */
export function BrandLogo({
  className = "",
  markClassName = "h-8 w-8",
  textClassName = "text-lg",
  idSuffix = "brand",
  asLink = true,
}: BrandLogoProps) {
  const inner = (
    <>
      <LogoMark className={markClassName} idSuffix={idSuffix} />
      <span
        className={`font-heading font-bold tracking-tight ${textClassName}`}
      >
        <span className="text-neutral-900">PDFs</span>
        <span className="text-primary-700">Mint</span>
      </span>
    </>
  );

  if (!asLink) {
    return <span className={`inline-flex items-center gap-2 ${className}`}>{inner}</span>;
  }

  return (
    <Link
      href="/"
      aria-label="PDFsMint home"
      className={`group inline-flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${className}`}
    >
      {inner}
    </Link>
  );
}
