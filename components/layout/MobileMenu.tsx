"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  FileText,
  ImageIcon,
  Menu,
  X,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { HeaderLogo } from "@/components/layout/DesktopNav";
import { mainNavLinks, toolCategories } from "@/lib/navigation";

const categoryIcons: Record<string, React.ReactNode> = {
  "PDF Tools": <FileText className="h-4 w-4 text-primary-600" strokeWidth={1.75} />,
  "Image Tools": <ImageIcon className="h-4 w-4 text-primary-600" strokeWidth={1.75} />,
};

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "PDF Tools",
  );
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Move focus into the drawer on open, and restore it to the trigger on close.
  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => closeButtonRef.current?.focus(), 50);
      return () => window.clearTimeout(timer);
    }
    openButtonRef.current?.focus();
  }, [isOpen]);

  // Escape to close + Tab focus trap within the open drawer.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        ref={openButtonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-700 transition-colors hover:bg-neutral-100"
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </button>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-neutral-900/20 backdrop-blur-[2px]"
          onClick={close}
          aria-label="Close menu overlay"
          tabIndex={-1}
        />

        <aside
          ref={drawerRef}
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-neutral-200 bg-white shadow-soft-xl transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Container className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-100">
            <HeaderLogo />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-700 transition-colors hover:bg-neutral-100"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </button>
          </Container>

          <nav
            className="flex-1 overflow-y-auto px-4 py-4 sm:px-6"
            aria-label="Mobile navigation"
          >
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
                >
                  Home
                </Link>
              </li>
            </ul>

            <div className="mt-2 border-t border-neutral-100 pt-4">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                All Tools
              </p>

              {toolCategories.map((category) => {
                const isExpanded = expandedCategory === category.label;

                return (
                  <div key={category.label} className="mb-2">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedCategory(isExpanded ? null : category.label)
                      }
                      className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
                      aria-expanded={isExpanded}
                    >
                      <span className="flex items-center gap-2">
                        {categoryIcons[category.label]}
                        {category.label}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-neutral-400 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        strokeWidth={1.75}
                      />
                    </button>

                    {isExpanded && (
                      <ul className="mb-2 ml-2 space-y-1 border-l border-neutral-100 pl-3">
                        {category.links.map((tool) => (
                          <li key={`${category.label}-${tool.href}`}>
                            <Link
                              href={tool.href}
                              onClick={() => setIsOpen(false)}
                              className="block rounded-lg px-3 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                            >
                              {tool.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            <ul className="mt-6 space-y-1 border-t border-neutral-100 pt-4">
              {mainNavLinks
                .filter((link) => link.href !== "/")
                .map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-lg px-3 py-3 text-base font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}
