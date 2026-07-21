import Link from "next/link";

import { BrandLogo } from "@/components/layout/Logo";
import { ToolsMenu } from "@/components/layout/ToolsMenu";
import { mainNavLinks } from "@/lib/navigation";

export function DesktopNav() {
  return (
    <nav
      className="hidden items-center gap-1 lg:flex"
      aria-label="Main navigation"
    >
      <Link
        href="/"
        className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
      >
        Home
      </Link>

      <ToolsMenu />

      {mainNavLinks
        .filter((link) => link.href !== "/")
        .map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            {link.label}
          </Link>
        ))}
    </nav>
  );
}

export function HeaderLogo() {
  return (
    <BrandLogo
      idSuffix="header"
      markClassName="h-8 w-8 transition-transform group-hover:scale-[1.03]"
      textClassName="text-lg"
    />
  );
}
