import type { FaqItem } from "@/components/seo/JsonLd";

type ToolFaqSectionProps = {
  faqs: FaqItem[];
  className?: string;
  heading?: string;
};

export function ToolFaqSection({
  faqs,
  className = "mt-16",
  heading = "Frequently asked questions",
}: ToolFaqSectionProps) {
  return (
    <section aria-labelledby="faq-heading" className={className}>
      <h2 id="faq-heading" className="mb-6 text-2xl font-semibold">
        {heading}
      </h2>
      <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
        {faqs.map((faq) => (
          <details key={faq.question} className="group px-5 py-4">
            <summary className="cursor-pointer list-none text-base font-medium text-neutral-900 marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {faq.question}
                <span
                  className="shrink-0 text-primary-600 transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
