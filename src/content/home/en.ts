import type { HomeContent } from './types';

// Copy fields hold HTML snippets (entities, <br>, <code>) and are rendered with set:html.
export const home: HomeContent = {
  "meta": {
    "title": "Grove for Mac — the native app for AI coding agents & git worktrees",
    "description": "The native Mac app for Claude Code, Codex and other AI coding agents. Switch git worktree and your agent, shell and diff follow. $9.99, pay once.",
    "ogImageAlt": "Grove for Mac: AI coding agents and git worktrees in one native macOS window",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Grove for Mac",
      "alternateName": "Grove",
      "url": "https://grove.molayab.com/",
      "description": "The native Mac app for Claude Code, Codex and other AI coding agents. Switch git worktree and your agent, shell and diff follow. $9.99, pay once.",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "macOS 26 or later",
      "inLanguage": "en",
      "image": "https://grove.molayab.com/og-image.png",
      "screenshot": "https://grove.molayab.com/screenshots/agent.png",
      "downloadUrl": "https://github.com/molayab/grove-website/releases/latest/download/Grove.dmg",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "USD",
        "lowPrice": "9.99",
        "highPrice": "39.99",
        "offerCount": "3"
      },
      "author": {
        "@type": "Person",
        "name": "Mateo Olaya Bernal",
        "url": "https://molayab.com"
      }
    }
  },
  "hero": {
    "badge": "No Electron &nbsp;·&nbsp; No Subscription &nbsp;·&nbsp; Native macOS",
    "title": "Your dev workspace,<br>one window.",
    "sub": "The native Mac app for AI coding agents. Switch worktree, and your agent, shell, and diff follow — Claude Code, Codex, Gemini CLI and more.",
    "ctaPrimary": "Start free trial",
    "ctaSecondary": "See what's inside",
    "trial": "Free trial &nbsp;·&nbsp; Developer ID signed &amp; notarized by Apple"
  },
  "carousel": {
    "label": "Grove screenshots",
    "controlsLabel": "Choose a screenshot",
    "pause": "Pause slideshow",
    "play": "Play slideshow",
    "slides": [
      {"alt": "Animated tour of Grove: switching worktrees while the agent, shell, files and diff follow", "caption": "Grove in action — your whole workspace, one window"},
      {
        "alt": "Grove's window with the ⌘K palette open over a Claude Code session, listing saved prompts and shell commands for the workspace",
        "caption": "Saved prompts & commands, one ⌘K away"
      },
      {
        "alt": "Grove's Agent tab running Claude Code in a project workspace, with the workspace list, worktrees, and git panel in the sidebar",
        "caption": "Your AI agent, already in the right folder"
      },
      {
        "alt": "Grove's Changes tab showing a unified diff with an inline comment box and a Send to Agent button",
        "caption": "Review the diff and send notes to the agent"
      },
      {
        "alt": "Grove's Files tab with a project file tree and a rendered Markdown README, including a Mermaid diagram",
        "caption": "File tree with live Markdown previews"
      },
      {
        "alt": "Grove's Shell tab with two shell tabs open, showing git log and worktree output",
        "caption": "As many shell tabs as you need"
      },
      {
        "alt": "Grove's Browser tab with pinned Vite and React documentation sites open as tabs",
        "caption": "Your project's pages, pinned beside the code"
      }
    ]
  },
  "download": {
    "eyebrow": "Download",
    "title": "Try Grove, free.",
    "sub": "A fully-featured trial build, served straight from the latest GitHub release — no account, no email required.",
    "button": "Download for macOS",
    "fetching": "Fetching the latest release&hellip;",
    "note": "Signed &amp; notarized by Apple — just open it, no security warnings.",
    "allReleases": "All releases on GitHub →"
  },
  "demo": {
    "eyebrow": "Demo",
    "title": "See it in motion.",
    "sub": "The 25-second tour of Grove: agents, worktrees, diff review and saved prompts in one window.",
    "items": [
      {
        "label": "Grove promo video: AI coding agents, git worktrees, diff review and saved prompts in one native Mac window",
        "caption": "Grove in 25 seconds."
      }
    ]
  },
  "features": {
    "eyebrow": "Features",
    "title": "Everything a modern developer needs.",
    "sub": "No Electron. No subscriptions. Just a fast, focused native app.",
    "items": [
      {
        "title": "AI Agents, natively",
        "body": "Bring your own AI coding agent — Claude Code, opencode, Codex, Gemini CLI, Aider, or any other CLI you add yourself — and it just works, already pointed at the right folder. Run several agent tabs side by side, no PATH to configure."
      },
      {
        "title": "Worktree-first",
        "body": "Work on three branches at once, without losing your place. Start a new worktree from any branch in a click — each one gets its own agent, shell, files, and changes, and everything follows when you switch."
      },
      {
        "title": "Review, then hand it back",
        "body": "The Changes tab updates live as your agent edits files. Read the diff, comment on any line, and send that note straight to the agent — no copy-pasting file paths and line numbers."
      },
      {
        "title": "Prompts &amp; commands, ⌘K away",
        "body": "Save the prompts and commands you reach for every day, per project or in a shared library. Press ⌘K, pick one, and it lands in your agent or a shell tab — ready to run."
      },
      {
        "title": "Git, in plain English",
        "body": "One Sync button instead of fetch, pull, and push. Save your changes, see your recent saves — jump to any of them as a new worktree — and if a pull is blocked by local edits, Grove offers to stash and pull for you."
      },
      {
        "title": "Files, with real previews",
        "body": "Browse the checkout in a file tree and preview what you click. Markdown renders GitHub-style — tables, code, even Mermaid diagrams — and exports to PDF in one step."
      },
      {
        "title": "Shell tabs",
        "body": "Need a real terminal? Open as many as you like, all rooted in the same folder as your agent — run the tests in one, tail a log in another, no context switch."
      },
      {
        "title": "Your project's web pages, pinned",
        "body": "Pin the issue tracker, docs, or dashboard that goes with each project. They open in the Browser tab, right next to your code, and stay with that workspace."
      },
      {
        "title": "No destructive defaults",
        "body": "Grove won't let a stray click wipe your work. There's no force push, discarding a file or dropping an unpushed commit always asks first, and anything that reaches beyond your machine asks too."
      },
      {
        "title": "Split layouts",
        "body": "Put two or three spaces side by side — Agent beside Changes, Shell beside Files. Pick a layout from the toolbar or ⌃⌘1–6, and move between panes from the keyboard."
      },
      {
        "title": "Worktrees, organized",
        "body": "Star the worktrees you live in, collect the rest into named groups, reorder them and add a one-line description. Lock one so it stays put, or archive it when the branch is done."
      },
      {
        "title": "Notes that follow the checkout",
        "body": "Each worktree gets its own “Working on” line, an ordered TODO list and a scratch note — and open TODOs show right on its row in the sidebar, so you know where you left off."
      },
      {
        "title": "Keeps working while you don't",
        "body": "Switch to another project and this one keeps going — its agent and shell run on in the background even when you're not looking. Check in on one thing without pausing another, and come back to exactly the tab you left."
      }
    ]
  },
  "screenshots": {
    "eyebrow": "Screenshots",
    "title": "See it in the window.",
    "sub": "The same checkout, every way you work on it.",
    "items": [
      {
        "alt": "Grove's Agent tab running Claude Code in a project workspace, with the workspace list, worktrees, and git panel in the sidebar",
        "caption": "Your agent of choice, already in the right folder — with every project and worktree one click away."
      },
      {
        "alt": "Grove's Changes tab showing a unified diff of a React component, with an inline comment box and a Send to Agent button",
        "caption": "Review the diff, comment on a line, and send it straight to your agent."
      },
      {
        "alt": "Grove's ⌘K palette listing saved prompts and shell commands for the workspace",
        "caption": "Press ⌘K to run a saved prompt or command against the current checkout."
      },
      {
        "alt": "Grove's Files tab with a project file tree and a rendered Markdown README, including a Mermaid architecture diagram and a table",
        "caption": "A file tree with live previews — Markdown renders with tables and Mermaid diagrams."
      },
      {
        "alt": "Grove's Shell tab with two shell tabs open, showing git log and worktree output for the workspace",
        "caption": "As many login shells as you need, rooted at the same checkout as your agent."
      },
      {
        "alt": "Grove's Browser tab with pinned Vite and React documentation sites open as tabs beside the workspace",
        "caption": "Pin the docs, tracker, or dashboard for each project — right beside your code."
      },
      {
        "alt": "Grove's Settings window on the General tab, showing Markdown preview options and accent color choices",
        "caption": "Sensible defaults out of the box — and an accent color that's yours."
      }
    ]
  },
  "why": {
    "eyebrow": "Why native?",
    "title": "Built for macOS.<br>Not ported to it.",
    "items": [
      "Built to never freeze on you — no spinning beachballs, even with several agents running at once.",
      "Feels like part of macOS, not a webpage in a window — matches your Dark Mode, your font size, your system, right out of the box.",
      "Install with confidence — Apple has verified Grove is safe, so you won't hit a scary \"unidentified developer\" warning, even outside the App Store.",
      "Finds your tools wherever you installed them — Homebrew, <code>~/.local/bin</code>, <code>~/.bun/bin</code> — even when you launch Grove from the Dock, not a terminal."
    ],
    "badges": [
      "Swift 6.2",
      "SwiftUI",
      "macOS 26+",
      "Developer ID",
      "No Electron",
      "No subscriptions"
    ]
  },
  "agents": {
    "eyebrow": "Supported agents",
    "title": "Choose your AI coding partner.",
    "sub": "Grove finds the agent binary automatically — no PATH configuration required. Using something else? Add any CLI agent in Settings."
  },
  "pricing": {
    "eyebrow": "Pricing",
    "title": "Pay once, own it forever.",
    "sub": "One-time purchase. Every future update included. Pick the seat count that fits how many Macs you use.",
    "tiers": [
      {
        "name": "1 License",
        "period": "one-time · 1 Mac"
      },
      {
        "name": "3 Licenses",
        "period": "one-time · up to 3 Macs",
        "badge": "Most popular"
      },
      {
        "name": "5 Licenses",
        "period": "one-time · up to 5 Macs"
      }
    ],
    "includesTitle": "Every license includes",
    "features": [
      "All current features",
      "All future updates",
      "Unlimited workspaces &amp; worktrees",
      "All AI agents — Claude Code, opencode, Codex, Gemini CLI, Aider, or your own",
      "macOS 26+ · Developer ID signed &amp; notarized"
    ],
    "buy": "Buy License",
    "note": "Secure checkout via Gumroad &nbsp;·&nbsp; Free to download and try — buy a license when your trial ends"
  },
  "blog": {
    "eyebrow": "From the blog",
    "title": "What's new, and how it's built.",
    "sub": "Release notes and engineering write-ups about Grove, from molayab.com.",
    "allPosts": "All Grove posts &rarr;"
  }
};
