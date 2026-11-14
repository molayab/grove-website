// Language-independent data for the marketing page. Translatable text is in
// src/content/home/{en,es}.ts, matched to these lists by position.
import type { FeatureIcon } from './icons';

export const DOWNLOAD_URL = 'https://github.com/molayab/grove-website/releases/latest/download/Grove.dmg';
export const RELEASES_URL = 'https://github.com/molayab/grove-website/releases';
export const BLOG_URL = 'https://molayab.com/blog/#tag=grove';

export interface Media {
  src: string;
  width: number;
  height: number;
}

export interface HeroSlide extends Media {
  /** Full-bleed cover art (the animated GIF): cropped to fill the frame instead of letterboxed. */
  cover?: boolean;
  /** How long the carousel stays on this slide, in ms (default set in carousel.js). */
  duration?: number;
}

export const heroSlides: HeroSlide[] = [
  { src: '/screenshots/grove-cover-16x9.gif', width: 1280, height: 720, cover: true, duration: 17000 },
  { src: '/screenshots/palette.png', width: 1800, height: 1125 },
  { src: '/screenshots/agent.png', width: 1800, height: 1125 },
  { src: '/screenshots/changes-review.png', width: 1800, height: 1125 },
  { src: '/screenshots/files-markdown.png', width: 1800, height: 1125 },
  { src: '/screenshots/shell.png', width: 1800, height: 1125 },
  { src: '/screenshots/browser.png', width: 1800, height: 1125 },
];

export const demoVideos: (Media & { className: string; attrs: Record<string, boolean | string> })[] = [
  {
    src: '/screenshots/grove-promo-youtube.mp4', width: 1920, height: 1080, className: 'demo-video-promo',
    attrs: { controls: true, playsinline: true, preload: 'none', poster: '/screenshots/agent.png' },
  },
];

/** Icon per feature card, in display order; the last card is the highlighted one. */
export const featureOrder: FeatureIcon[] = [
  'agents', 'worktree', 'review', 'prompts', 'git', 'files', 'shell', 'browser',
  'safety', 'split', 'organize', 'notes', 'background',
];

export const screenshots: Media[] = [
  { src: '/screenshots/agent.png', width: 1800, height: 1125 },
  { src: '/screenshots/changes-review.png', width: 1800, height: 1125 },
  { src: '/screenshots/palette.png', width: 1800, height: 1125 },
  { src: '/screenshots/files-markdown.png', width: 1800, height: 1125 },
  { src: '/screenshots/shell.png', width: 1800, height: 1125 },
  { src: '/screenshots/browser.png', width: 1800, height: 1125 },
  { src: '/screenshots/settings.png', width: 1040, height: 900 },
];

export const agents = ['Claude Code', 'opencode', 'Codex CLI', 'Gemini CLI', 'Aider'];

export const pricingTiers = [
  { price: '9.99', href: 'https://molayab.gumroad.com/l/grove', featured: false },
  { price: '24.99', href: 'https://molayab.gumroad.com/l/grove-3', featured: true },
  { price: '39.99', href: 'https://molayab.gumroad.com/l/grove-5', featured: false },
];
