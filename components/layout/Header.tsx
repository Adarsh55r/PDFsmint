import { Container } from "@/components/layout/Container";
import { DesktopNav, HeaderLogo } from "@/components/layout/DesktopNav";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <HeaderLogo />
          <DesktopNav />
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
