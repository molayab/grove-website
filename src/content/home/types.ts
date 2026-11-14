// Translatable copy for the marketing page. One object per language
// (en.ts / es.ts); structure and order must match. Language-independent data
// (image paths, prices, icons, links) lives in src/data/home.ts.
// Fields that may contain markup (&amp;, &nbsp;, <br>, <code>) are rendered
// with set:html; `alt`, `label` and the carousel `caption` are plain text.

export interface SectionCopy {
  eyebrow: string;
  title: string;
  sub: string;
}

export interface HomeContent {
  meta: {
    title: string;
    description: string;
    ogImageAlt: string;
    jsonLd: Record<string, unknown>;
  };
  hero: {
    badge: string;
    title: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trial: string;
  };
  carousel: {
    label: string;
    controlsLabel: string;
    pause: string;
    play: string;
    /** One entry per slide in `heroSlides`, same order. Plain text: `caption` is also the dot's aria-label. */
    slides: { alt: string; caption: string }[];
  };
  download: SectionCopy & { button: string; fetching: string; note: string; allReleases: string };
  demo: SectionCopy & { items: { label: string; caption: string }[] };
  /** `items` follow `featureIcons` order in src/data/home.ts; the last one is the highlighted card. */
  features: SectionCopy & { items: { title: string; body: string }[] };
  screenshots: SectionCopy & { items: { alt: string; caption: string }[] };
  why: { eyebrow: string; title: string; items: string[]; badges: string[] };
  agents: SectionCopy;
  pricing: SectionCopy & {
    tiers: { name: string; period: string; badge?: string }[];
    /** Heading for the list of what every license includes. */
    includesTitle: string;
    features: string[];
    buy: string;
    note: string;
  };
  blog: SectionCopy & { allPosts: string };
}
