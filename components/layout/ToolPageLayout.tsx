import { Container } from "@/components/layout/Container";

export function ToolPageLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Container size="narrow" className="py-16 lg:py-20">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mb-8 text-muted">{description}</p>
      {children}
    </Container>
  );
}