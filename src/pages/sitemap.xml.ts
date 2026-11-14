import { pages, SITE } from '../data/pages';

export function GET() {
  const url = (p: (typeof pages)[number], loc: string) => {
    const alternates = p.es
      ? `
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${p.en}" />
    <xhtml:link rel="alternate" hreflang="es" href="${SITE}${p.es}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${p.en}" />`
      : '';
    return `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${p.lastmod}</lastmod>${alternates}
  </url>`;
  };
  const body = pages.flatMap((p) => [url(p, p.en), ...(p.es ? [url(p, p.es)] : [])]).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
