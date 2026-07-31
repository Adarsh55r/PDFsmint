import {
  Allura,
  Dancing_Script,
  Great_Vibes,
  Pacifico,
  Sacramento,
} from "next/font/google";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const sacramento = Sacramento({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const allura = Allura({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export type SignatureFontOption = {
  id: string;
  label: string;
  className: string;
  /** CSS font-family value for canvas rendering. */
  family: string;
};

/** Cursive fonts loaded only on the Sign PDF route (via next/font). */
export const SIGNATURE_FONTS: SignatureFontOption[] = [
  {
    id: "dancing",
    label: "Dancing Script",
    className: dancingScript.className,
    family: dancingScript.style.fontFamily,
  },
  {
    id: "pacifico",
    label: "Pacifico",
    className: pacifico.className,
    family: pacifico.style.fontFamily,
  },
  {
    id: "sacramento",
    label: "Sacramento",
    className: sacramento.className,
    family: sacramento.style.fontFamily,
  },
  {
    id: "great-vibes",
    label: "Great Vibes",
    className: greatVibes.className,
    family: greatVibes.style.fontFamily,
  },
  {
    id: "allura",
    label: "Allura",
    className: allura.className,
    family: allura.style.fontFamily,
  },
];

/** Apply all signature font classNames so glyphs are available for canvas. */
export function signatureFontsClassName(): string {
  return SIGNATURE_FONTS.map((f) => f.className).join(" ");
}
