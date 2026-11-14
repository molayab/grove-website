import type { Lang } from './data/pages';

export const ui = {
  en: {
    nav: { features: 'Features', screenshots: 'Screenshots', pricing: 'Pricing', download: 'Download', support: 'Support', langName: 'EN' },
    footer: {
      support: 'Support',
      privacy: 'Privacy',
      refund: 'Refund Policy',
      worktrees: 'Git worktrees on Mac',
      claudeCode: 'Claude Code on Mac',
      agents: 'AI coding agents on Mac',
      cookies: 'Cookie Settings',
    },
  },
  es: {
    nav: { features: 'Funciones', screenshots: 'Capturas', pricing: 'Precios', download: 'Descargar', support: 'Soporte', langName: 'ES' },
    footer: {
      support: 'Soporte',
      privacy: 'Privacidad (EN)',
      refund: 'Política de reembolsos (EN)',
      worktrees: 'Git worktrees en Mac',
      claudeCode: 'Claude Code en Mac',
      agents: 'Agentes de IA en Mac',
      cookies: 'Preferencias de cookies',
    },
  },
} satisfies Record<Lang, unknown>;

/** Home page path for a language. */
export const home = (lang: Lang) => (lang === 'es' ? '/es/' : '/');
