// Feature-card icons (36x36 viewBox, stroked with currentColor). Keyed by feature id.
export const featureIcons = {
  agents: `<rect x="4" y="8" width="28" height="20" rx="3"/>
<path d="M12 16l4 4-4 4M19 24h5"/>`,
  worktree: `<circle cx="18" cy="10" r="3.5"/><circle cx="9" cy="26" r="3.5"/><circle cx="27" cy="26" r="3.5"/>
<path d="M18 13.5V20M18 20l-6.5 3M18 20l6.5 3"/>`,
  review: `<path d="M9 10h18M9 16h18M9 22h10"/>
<path d="M25 21l2.5 2.5L25 26"/>
<path d="M19 23.5h8.5"/>`,
  prompts: `<rect x="6" y="7" width="24" height="22" rx="3"/>
<path d="M11 14h14M11 19h9"/>
<path d="M22 24h4"/>`,
  git: `<path d="M8 12h20M8 18h14M8 24h10"/>
<circle cx="27" cy="24" r="4.5"/>
<path d="M25 24l1.5 1.5L29 22"/>`,
  files: `<path d="M8 6h14l6 6v18H8z"/><path d="M22 6v6h6"/>
<path d="M12 20h7M12 24h5"/>`,
  shell: `<rect x="4" y="8" width="28" height="20" rx="3"/>
<path d="M10 18l3 3-3 3M16 21h10"/>`,
  browser: `<circle cx="18" cy="18" r="13"/>
<path d="M5 18h26M18 5c3.5 3.6 5 8 5 13s-1.5 9.4-5 13c-3.5-3.6-5-8-5-13s1.5-9.4 5-13z"/>`,
  safety: `<path d="M18 4l14 8v12l-14 8L4 24V12z"/>
<path d="M18 4v28M4 12l14 8 14-8"/>`,
  split: `<rect x="4" y="7" width="28" height="22" rx="3"/>
<path d="M18 7v22M18 18h14"/>`,
  organize: `<path d="M18 5l3.9 7.9 8.6 1.3-6.2 6 1.5 8.6L18 24.8l-7.8 4 1.5-8.6-6.2-6 8.6-1.3z"/>`,
  notes: `<rect x="7" y="5" width="22" height="26" rx="3"/>
<path d="M12 13l2 2 3.5-3.5M20 14h5M12 22l2 2 3.5-3.5M20 23h5"/>`,
  background: `<circle cx="18" cy="18" r="14"/>
<path d="M18 10v8l6 4"/>`,
} as const;

export type FeatureIcon = keyof typeof featureIcons;
