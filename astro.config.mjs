import { defineConfig } from 'astro/config';

// `format: 'preserve'` keeps the legacy URLs (`/page.html`, `/es/`) so existing
// links and search results survive the move from hand-written HTML to Astro.
export default defineConfig({
  site: 'https://grove.molayab.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'preserve' },
});
