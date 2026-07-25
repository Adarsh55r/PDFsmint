import Link from "next/link";

import { Card } from "@/components/ui/Card";
import type { RelatedToolLink } from "@/components/tools/ToolPageTemplate";
import { getToolTheme } from "@/lib/tool-icons";

type RelatedToolsSectionProps = {
  tools: RelatedToolLink[];
};

export function RelatedToolsSection({ tools }: RelatedToolsSectionProps) {
  return (
    <section aria-labelledby="related-tools-heading" className="mt-16">
      <h2 id="related-tools-heading" className="mb-6 text-2xl font-semibold">
        Related tools
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => {
          const { icon: Icon, iconBg, iconText, accentRing } = getToolTheme(
            tool.href,
          );

          return (
            <Link key={tool.href} href={tool.href} className="group block h-full">
              <Card
                className={`surface-card flex h-full gap-3 transition-all duration-300 ease-out ${accentRing} group-hover:-translate-y-1 group-hover:shadow-soft-xl`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${iconBg} ${iconText}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="min-w-0">
                  <h3 className="mb-1 text-base font-semibold text-neutral-900 group-hover:text-primary-800">
                    {tool.label}
                  </h3>
                  <p className="text-sm text-muted">{tool.description}</p>
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
