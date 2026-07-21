import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { getToolIcon } from "@/lib/tool-icons";
import type { NavLink } from "@/lib/navigation";

type ToolCardProps = {
  tool: NavLink;
};

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = getToolIcon(tool.href);

  return (
    <Link href={tool.href} className="group block h-full">
      <Card className="surface-card flex h-full flex-col transition-all duration-200 group-hover:border-primary-200 group-hover:shadow-soft-md">
        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary-100">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <h3 className="mb-1.5 text-base font-semibold text-neutral-900 group-hover:text-primary-800">
          {tool.label}
        </h3>
        <p className="text-sm leading-relaxed text-muted">{tool.description}</p>
      </Card>
    </Link>
  );
}
