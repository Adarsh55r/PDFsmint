"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, FileText, ImageIcon } from "lucide-react";

import { toolCategories } from "@/lib/navigation";
import { getToolTheme } from "@/lib/tool-icons";

const categoryIcons: Record<string, React.ReactNode> = {
  "PDF Tools": <FileText className="h-4 w-4 text-primary-700" strokeWidth={1.75} aria-hidden />,
  "Image Tools": <ImageIcon className="h-4 w-4 text-primary-700" strokeWidth={1.75} aria-hidden />,
};

export function ToolsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
      >
        All Tools
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          strokeWidth={1.75}
          aria-hidden
        />
      </button>

      <div
        id={menuId}
        className={`absolute left-1/2 top-full z-50 w-[min(100vw-2rem,32rem)] -translate-x-1/2 pt-3 transition-all duration-200 ${
          isOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-soft-lg">
          <div className="grid gap-0 sm:grid-cols-2">
            {toolCategories.map((category) => (
              <div
                key={category.label}
                className="border-neutral-100 p-4 sm:border-r sm:last:border-r-0"
              >
                <div className="mb-3 flex items-center gap-2">
                  {categoryIcons[category.label]}
                  <Link
                    href={category.href}
                    onClick={() => setIsOpen(false)}
                    tabIndex={isOpen ? 0 : -1}
                    className="text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-primary-800"
                  >
                    {category.label}
                  </Link>
                </div>
                <ul className="space-y-1">
                  {category.links.map((tool) => {
                    const { icon: Icon, iconBg, iconText } = getToolTheme(
                      tool.href,
                    );

                    return (
                      <li key={`${category.label}-${tool.href}`}>
                        <Link
                          href={tool.href}
                          onClick={() => setIsOpen(false)}
                          tabIndex={isOpen ? 0 : -1}
                          className="group/link flex items-start gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-neutral-50 focus-visible:bg-neutral-50"
                        >
                          <span
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconText}`}
                          >
                            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-neutral-800 group-hover/link:text-primary-800">
                              {tool.label}
                            </span>
                            {tool.description && (
                              <span className="mt-0.5 block line-clamp-1 text-xs text-neutral-500">
                                {tool.description}
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
