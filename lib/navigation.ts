export type NavLink = {
  href: string;
  label: string;
  description?: string;
};

export type ToolCategory = {
  label: string;
  /** Category hub page listing these tools with formats and limits. */
  href: string;
  links: NavLink[];
};

export const toolCategories: ToolCategory[] = [
  {
    label: "PDF Tools",
    href: "/pdf-tools",
    links: [
      {
        href: "/tools/compress-pdf",
        label: "Compress PDF",
        description: "Reduce file size in your browser",
      },
      {
        href: "/tools/merge-pdf",
        label: "Merge PDF",
        description: "Combine multiple PDFs into one",
      },
      {
        href: "/tools/split-pdf",
        label: "Split PDF",
        description: "Extract pages into separate files",
      },
      {
        href: "/tools/jpg-to-pdf",
        label: "JPG to PDF",
        description: "Convert images to a PDF",
      },
      {
        href: "/tools/pdf-to-jpg",
        label: "PDF to JPG",
        description: "Extract pages as images",
      },
      {
        href: "/tools/pdf-to-word",
        label: "PDF to Word",
        description: "Convert to editable documents",
      },
      {
        href: "/tools/word-to-pdf",
        label: "Word to PDF",
        description: "Convert DOCX files to PDF",
      },
      {
        href: "/tools/edit-pdf",
        label: "Edit PDF",
        description: "Reorder, rotate, and remove pages",
      },
      {
        href: "/tools/n-up-pdf",
        label: "N-Up PDF",
        description: "Put multiple pages on one sheet",
      },
      {
        href: "/tools/watermark-pdf",
        label: "Watermark PDF",
        description: "Stamp text or image over pages",
      },
      {
        href: "/tools/sign-pdf",
        label: "Sign PDF",
        description: "Draw, type, or upload a signature",
      },
    ],
  },
  {
    label: "Image Tools",
    href: "/image-tools",
    links: [
      {
        href: "/tools/resize-image",
        label: "Resize Image",
        description: "Set custom width and height",
      },
      {
        href: "/tools/compress-image",
        label: "Compress Image",
        description: "Reduce image file size",
      },
      {
        href: "/tools/convert-to-jpg",
        label: "Convert to JPG",
        description: "Convert any image format to JPG",
      },
      {
        href: "/tools/jpg-to-pdf",
        label: "JPG to PDF",
        description: "Turn images into PDFs",
      },
      {
        href: "/tools/pdf-to-jpg",
        label: "PDF to JPG",
        description: "Export PDF pages as JPG",
      },
    ],
  },
];

export const mainNavLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
] as const;

/** All unique tools for sitemap, footer, and discovery — deduped by href. */
export const popularTools: NavLink[] = Array.from(
  new Map(
    toolCategories.flatMap((category) => category.links).map((link) => [link.href, link]),
  ).values(),
);

export const companyLinks: NavLink[] = [
  { href: "/pdf-tools", label: "All PDF Tools" },
  { href: "/image-tools", label: "All Image Tools" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

export const socialLinks = [
  { href: "#", label: "Twitter", icon: "twitter" as const },
  { href: "#", label: "GitHub", icon: "github" as const },
  { href: "#", label: "LinkedIn", icon: "linkedin" as const },
] as const;

export function getToolCategoryLabel(href: string): string {
  for (const category of toolCategories) {
    if (category.links.some((link) => link.href === href)) {
      return category.label;
    }
  }
  return "Tools";
}
