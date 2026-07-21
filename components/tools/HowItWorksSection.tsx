import type { HowItWorksStep } from "@/components/tools/ToolPageTemplate";

type HowItWorksSectionProps = {
  steps: HowItWorksStep[];
};

export function HowItWorksSection({ steps }: HowItWorksSectionProps) {
  return (
    <section aria-labelledby="how-it-works-heading" className="mb-16">
      <h2 id="how-it-works-heading" className="mb-8 text-2xl font-semibold">
        How it works
      </h2>
      <ol className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              className="relative rounded-xl border border-neutral-200 bg-white p-6 shadow-soft"
            >
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
                Step {index + 1}
              </p>
              <h3 className="mb-2 text-lg font-semibold text-neutral-900">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600">
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
