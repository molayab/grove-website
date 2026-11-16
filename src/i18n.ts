import type { Lang } from './data/pages';

export const ui = {
  en: {
    nav: { features: 'Features', screenshots: 'Screenshots', pricing: 'Pricing', blog: 'Blog', download: 'Download', support: 'Support', langName: 'EN', menu: 'Menu' },
    footer: {
      support: 'Support',
      blog: 'Blog',
      privacy: 'Privacy',
      refund: 'Refund Policy',
      worktrees: 'Git worktrees on Mac',
      claudeCode: 'Claude Code on Mac',
      agents: 'AI coding agents on Mac',
      cookies: 'Cookie Settings',
      theme: { label: 'Theme', system: 'System', light: 'Light', dark: 'Dark' },
    },
  },
  es: {
    nav: { features: 'Funciones', screenshots: 'Capturas', pricing: 'Precios', blog: 'Blog (EN)', download: 'Descargar', support: 'Soporte', langName: 'ES', menu: 'Menú' },
    footer: {
      support: 'Soporte',
      blog: 'Blog (EN)',
      privacy: 'Privacidad (EN)',
      refund: 'Política de reembolsos (EN)',
      worktrees: 'Git worktrees en Mac',
      claudeCode: 'Claude Code en Mac',
      agents: 'Agentes de IA en Mac',
      cookies: 'Preferencias de cookies',
      theme: { label: 'Tema', system: 'Sistema', light: 'Claro', dark: 'Oscuro' },
    },
  },
} satisfies Record<Lang, unknown>;

/** Home page path for a language. */
export const home = (lang: Lang) => (lang === 'es' ? '/es/' : '/');
