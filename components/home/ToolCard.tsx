import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { getToolTheme } from "@/lib/tool-icons";
import type { NavLink } from "@/lib/navigation";

type ToolCardProps = {
  tool: NavLink;
};

export function ToolCard({ tool }: ToolCardProps) {
  const { icon: Icon, iconBg, iconText, iconBgHover, accentRing } =
    getToolTheme(tool.href);

  return (
    <Link href={tool.href} className="group block h-full">
      <Card
        className={`surface-card relative flex h-full flex-col overflow-hidden transition-all duration-300 ease-out will-change-transform ${accentRing} group-hover:-translate-y-1.5 group-hover:scale-[1.015] group-hover:shadow-soft-xl`}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${iconBg} ${iconText} ${iconBgHover} group-hover:scale-110`}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-neutral-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-600"
            strokeWidth={1.75}
            aria-hidden
          />
        </div>
        <h3 className="mb-2 text-base font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-primary-800">
          {tool.label}
        </h3>
        <p className="text-sm leading-relaxed text-muted">{tool.description}</p>
      </Card>
    </Link>
  );
}
