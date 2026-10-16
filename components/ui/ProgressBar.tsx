type ProgressBarProps = {
  value: number;
  className?: string;
  label?: string;
};

export function ProgressBar({
  value,
  className = "",
  label = "Processing progress",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-neutral-200 ${className}`}
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-primary-600 transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
