import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { resolveAbsoluteUrl } from "@/lib/seo-config";
import { getToolTheme } from "@/lib/tool-icons";
import type { ToolFacts } from "@/lib/tools-catalog";

export type ToolGroup = {
  heading: string;
  description: string;
  tools: ToolFacts[];
};

export type Workflow = {
  title: string;
  steps: { href: string; label: string }[];
  note: string;
};

type ToolCategoryPageProps = {
  path: string;
  label: string;
  h1: string;
  intro: React.ReactNode;
  groups: ToolGroup[];
  workflows: Workflow[];
};

export function ToolCategoryPage({
  path,
  label,
  h1,
  intro,
  groups,
  workflows,
}: ToolCategoryPageProps) {
  const allTools = groups.flatMap((group) => group.tools);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: h1,
    url: resolveAbsoluteUrl(path),
    itemListElement: allTools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: resolveAbsoluteUrl(tool.href),
    })),
  };

  return (
    <Container size="wide" className="py-16 lg:py-20">
      <JsonLd data={itemListJsonLd} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label }]} />

      <header className="mb-12 max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          {h1}
        </h1>
        <div className="text-muted space-y-3 text-base leading-relaxed md:text-lg">
          {intro}
        </div>
      </header>

      {groups.map((group) => (
        <section key={group.heading} className="mb-14">
          <h2 className="mb-2 text-2xl font-semibold">{group.heading}</h2>
          <p className="text-muted mb-6 max-w-3xl">{group.description}</p>
          <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.tools.map((tool) => {
              const {
                icon: Icon,
                iconBg,
                iconText,
                accentRing,
              } = getToolTheme(tool.href);
              return (
                <li key={tool.href}>
                  <Link href={tool.href} className="group block h-full">
                    <Card
                      className={`surface-card flex h-full gap-3 transition-all duration-300 ease-out ${accentRing} group-hover:-translate-y-1 group-hover:shadow-soft-xl`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconText}`}
                      >
                        <Icon
                          className="h-5 w-5"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      </span>
                      <span className="min-w-0">
                        <h3 className="mb-1 text-base font-semibold text-neutral-900 group-hover:text-primary-800">
                          {tool.name}
                        </h3>
                        <p className="text-muted text-sm">{tool.summary}</p>
                      </span>
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section aria-labelledby="limits-heading" className="mb-14">
        <h2 id="limits-heading" className="mb-2 text-2xl font-semibold">
          Supported formats and limits
        </h2>
        <p className="text-muted mb-6 max-w-3xl">
          Limits exist because files are processed in your browser&rsquo;s
          memory rather than on a server. Phones have less memory than
          computers, so very large files are more reliable on desktop.
        </p>
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-700">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Tool
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Accepts
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Limits
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Output
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Good to know
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-600">
              {allTools.map((tool) => (
                <tr key={tool.href}>
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-neutral-900"
                  >
                    <Link
                      href={tool.href}
                      className="text-primary-700 hover:underline"
                    >
                      {tool.name}
                    </Link>
                  </th>
                  <td className="px-4 py-3">{tool.input}</td>
                  <td className="px-4 py-3">{tool.limits}</td>
                  <td className="px-4 py-3">{tool.output}</td>
                  <td className="px-4 py-3">{tool.caveat ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {workflows.length > 0 && (
        <section aria-labelledby="workflows-heading" className="mb-14">
          <h2 id="workflows-heading" className="mb-6 text-2xl font-semibold">
            Common workflows
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {workflows.map((workflow) => (
              <div
                key={workflow.title}
                className="rounded-xl border border-neutral-200 bg-white p-5"
              >
                <h3 className="mb-2 text-base font-semibold text-neutral-900">
                  {workflow.title}
                </h3>
                <ol className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                  {workflow.steps.map((step, index) => (
                    <li key={step.href} className="flex items-center gap-2">
                      {index > 0 && (
                        <span aria-hidden className="text-neutral-400">
                          →
                        </span>
                      )}
                      <Link
                        href={step.href}
                        className="font-medium text-primary-700 hover:underline"
                      >
                        {step.label}
                      </Link>
                    </li>
                  ))}
                </ol>
                <p className="text-muted text-sm">{workflow.note}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="privacy-heading" className="max-w-3xl">
        <h2 id="privacy-heading" className="mb-3 text-2xl font-semibold">
          Where your files go
        </h2>
        <p className="text-muted leading-relaxed">
          Nowhere. Each tool reads your file into the browser tab, processes it
          on your device with JavaScript (plus WebAssembly for some PDF
          decoding), and gives the result back as a download. There is no upload
          step and no server-side copy. You can confirm this yourself in your
          browser&rsquo;s developer tools (Network tab) while a tool runs — see{" "}
          <Link
            href="/blog/why-client-side-pdf-tools"
            className="text-primary-700 underline"
          >
            how client-side processing works
          </Link>
          .
        </p>
      </section>
    </Container>
  );
}
