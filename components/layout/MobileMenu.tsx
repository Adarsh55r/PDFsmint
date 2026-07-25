"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  FileText,
  ImageIcon,
  Menu,
  X,
} from "lucide-react";

import { HeaderLogo } from "@/components/layout/DesktopNav";
import { mainNavLinks, toolCategories } from "@/lib/navigation";
import { getToolTheme } from "@/lib/tool-icons";

const categoryIcons: Record<string, React.ReactNode> = {
  "PDF Tools": (
    <FileText className="h-4 w-4 text-primary-700" strokeWidth={1.75} aria-hidden />
  ),
  "Image Tools": (
    <ImageIcon className="h-4 w-4 text-primary-700" strokeWidth={1.75} aria-hidden />
  ),
};

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "PDF Tools",
  );
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => closeButtonRef.current?.focus(), 50);
      return () => window.clearTimeout(timer);
    }
    openButtonRef.current?.focus();
  }, [isOpen]);

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

  // Portal the drawer to <body> so it is never clipped by header overflow or
  // blocked by a hidden full-screen layer sitting above the menu button.
  const drawer =
    mounted && isOpen
      ? createPortal(
          <div className="fixed inset-0 z-[100] lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
              onClick={close}
              aria-label="Close menu overlay"
            />

            <aside
              ref={drawerRef}
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="absolute right-0 top-0 flex h-full w-[min(100vw,20rem)] max-w-full flex-col border-l border-neutral-200 bg-white shadow-soft-xl"
              style={{
                paddingTop: "env(safe-area-inset-top, 0px)",
                paddingBottom: "env(safe-area-inset-bottom, 0px)",
              }}
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-100 px-4 sm:px-6">
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
              </div>

              <nav
                className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6"
                aria-label="Mobile navigation links"
              >
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/"
                      onClick={close}
                      className="block rounded-lg px-3 py-3 text-base font-medium text-neutral-800 transition-colors hover:bg-neutral-50 active:bg-neutral-100"
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
                            setExpandedCategory(
                              isExpanded ? null : category.label,
                            )
                          }
                          className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50 active:bg-neutral-100"
                          aria-expanded={isExpanded}
                        >
                          <span className="flex items-center gap-2">
                            {categoryIcons[category.label]}
                            {category.label}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            strokeWidth={1.75}
                            aria-hidden
                          />
                        </button>

                        {isExpanded && (
                          <ul className="mb-2 ml-2 space-y-1 border-l border-neutral-100 pl-3">
                            {category.links.map((tool) => {
                              const { icon: Icon, iconBg, iconText } =
                                getToolTheme(tool.href);

                              return (
                                <li key={`${category.label}-${tool.href}`}>
                                  <Link
                                    href={tool.href}
                                    onClick={close}
                                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900 active:bg-neutral-100"
                                  >
                                    <span
                                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconText}`}
                                    >
                                      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                                    </span>
                                    {tool.label}
                                  </Link>
                                </li>
                              );
                            })}
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
                          onClick={close}
                          className="block rounded-lg px-3 py-3 text-base font-medium text-neutral-800 transition-colors hover:bg-neutral-50 active:bg-neutral-100"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </nav>
            </aside>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="relative z-[60] shrink-0 lg:hidden">
      <button
        ref={openButtonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-lg text-neutral-700 transition-colors hover:bg-neutral-100 active:bg-neutral-200"
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </button>
      {drawer}
    </div>
  );
}
