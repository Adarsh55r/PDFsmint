import { Shield, Smartphone, Sparkles, UserRoundX } from "lucide-react";

import { siteConfig } from "@/lib/seo-config";

const valueProps = [
  {
    icon: Sparkles,
    title: "100% Free",
    description:
      "Every tool is free to use — no trials, no paywalls, and no hidden limits on daily usage.",
  },
  {
    icon: UserRoundX,
    title: "No Signup Required",
    description:
      "Open a tool and start working immediately. No account, email, or credit card needed.",
  },
  {
    icon: Shield,
    title: "Files Never Uploaded",
    description:
      "Processing runs locally in your browser. Your documents stay on your device — privacy first.",
  },
  {
    icon: Smartphone,
    title: "Works on Any Device",
    description:
      "Use on desktop, tablet, or phone. Any modern browser with JavaScript enabled will work.",
  },
];

export function HomeValueProps() {
  return (
    <section
      aria-labelledby="why-choose-heading"
      className="border-y border-neutral-200/80 bg-white py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2
            id="why-choose-heading"
            className="text-2xl font-semibold tracking-tight md:text-3xl"
          >
            Why choose {siteConfig.name}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            Built for people who need fast, reliable file tools without handing
            over their documents to a server.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-6"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary-700 shadow-soft">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mb-2 text-base font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
