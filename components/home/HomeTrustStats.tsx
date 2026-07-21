import { popularTools } from "@/lib/navigation";
import { siteConfig } from "@/lib/seo-config";

// Honest, verifiable trust signals — no fabricated usage numbers or ratings.
// Every value here is a fact about how the product works.
const signals = [
  { value: "100%", label: "Free — no limits or paywalls" },
  { value: "0", label: "Files uploaded to our servers" },
  { value: "0", label: "Accounts or sign-ups required" },
  { value: `${popularTools.length}`, label: "Tools, all in your browser" },
];

export function HomeTrustStats() {
  return (
    <section aria-labelledby="trust-stats-heading" className="py-14 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-neutral-50 to-white px-6 py-10 md:px-10">
          <div className="mb-8 text-center">
            <h2
              id="trust-stats-heading"
              className="text-xl font-semibold text-neutral-900 md:text-2xl"
            >
              Free, private, and built to stay that way
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-600">
              Every tool runs entirely in your browser. We can&rsquo;t see,
              store, or share your files — because they never leave your device.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {signals.map((signal) => (
              <div key={signal.label} className="text-center">
                <dt className="sr-only">{signal.label}</dt>
                <dd className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
                  {signal.value}
                </dd>
                <dd className="mt-1 text-sm text-neutral-600">{signal.label}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-center text-xs text-neutral-500">
            {siteConfig.name} — private, in-browser file tools
          </p>
        </div>
      </div>
    </section>
  );
}
