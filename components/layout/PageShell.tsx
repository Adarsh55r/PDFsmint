import { Container } from "@/components/layout/Container";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";

type PageShellProps = {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  children: React.ReactNode;
  size?: "default" | "narrow" | "wide";
};

export function PageShell({
  title,
  description,
  breadcrumbs,
  children,
  size = "narrow",
}: PageShellProps) {
  return (
    <Container size={size} className="py-16 lg:py-20">
      <Breadcrumbs items={breadcrumbs} />
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-3 text-lg text-muted">{description}</p>}
      </header>
      {children}
    </Container>
  );
}
