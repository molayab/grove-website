import { defineConfig } from 'astro/config';

// `format: 'preserve'` keeps the legacy URLs (`/page.html`, `/es/`) so existing
// links and search results survive the move from hand-written HTML to Astro.
export default defineConfig({
  site: 'https://grove.molayab.com',
  output: 'static',
  trailingSlash: 'ignore',
  // The default HTML compressor drops the space between text and an inline
  // element split across lines ("click\n<strong>" -> "click<strong>").
  compressHTML: false,
  build: { format: 'preserve' },
});
