// Single source of truth for public pages: drives hreflang alternates, the
// language switcher and sitemap.xml. Add every new public page here.
export interface PageEntry {
  en: string;
  /** Absent for English-only pages (the legal pages). */
  es?: string;
  lastmod: string;
}

export const SITE = 'https://grove.molayab.com';

export const pages: PageEntry[] = [
  { en: '/', es: '/es/', lastmod: '2026-11-14' },
  { en: '/privacy-policy.html', lastmod: '2026-11-04' },
  { en: '/refund-policy.html', lastmod: '2026-11-04' },
  { en: '/git-worktree-app-mac.html', es: '/es/git-worktree-app-mac.html', lastmod: '2026-11-04' },
  { en: '/claude-code-mac-app.html', es: '/es/claude-code-mac-app.html', lastmod: '2026-11-04' },
  { en: '/ai-coding-agents-mac-app.html', es: '/es/ai-coding-agents-mac-app.html', lastmod: '2026-11-04' },
];

export type Lang = 'en' | 'es';

/** The page entry a path belongs to, whichever language it is in. */
export function findPage(path: string): PageEntry | undefined {
  return pages.find((p) => p.en === path || p.es === path);
}
