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
  /** A looping muted video (plays only while visible); `poster` is shown until it loads. */
  video?: boolean;
  poster?: string;
  /** Cropped to fill the frame instead of letterboxed. */
  cover?: boolean;
  /** How long the carousel stays on this slide, in ms (default set in carousel.js). */
  duration?: number;
}

export const heroSlides: HeroSlide[] = [
  // Window-only screen recording: sharp at any DPR, no backdrop to clash with the theme.
  { src: '/screenshots/grove-cover.mp4', poster: '/screenshots/grove-cover-poster.jpg', video: true, width: 1920, height: 1264, cover: true, duration: 16700 },
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
