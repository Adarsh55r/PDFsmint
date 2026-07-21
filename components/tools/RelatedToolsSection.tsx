import Link from "next/link";

import { Card } from "@/components/ui/Card";
import type { RelatedToolLink } from "@/components/tools/ToolPageTemplate";

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
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className="surface-card h-full transition-shadow hover:shadow-soft-md">
              <h3 className="mb-1 text-base font-semibold text-neutral-900">
                {tool.label}
              </h3>
              <p className="text-sm text-muted">{tool.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
