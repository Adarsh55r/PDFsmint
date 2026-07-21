import { Container } from "@/components/layout/Container";
import { JsonLd, softwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";

type ToolPageShellProps = {
  title: string;
  description: string;
  path: string;
  category: string;
  categoryHref?: string;
  children: React.ReactNode;
};

export function ToolPageShell({
  title,
  description,
  path,
  category,
  categoryHref = "/",
  children,
}: ToolPageShellProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: category, href: categoryHref },
    { label: title },
  ];

  return (
    <>
      <JsonLd
        data={softwareApplicationJsonLd({ name: title, description, path })}
      />
      <Container size="narrow" className="py-16 lg:py-20">
        <Breadcrumbs items={breadcrumbs} />
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-lg text-muted">{description}</p>
        </header>
        {children}
      </Container>
    </>
  );
}
