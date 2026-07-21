#!/usr/bin/env node
// Regenerates download.json from this repo's GitHub release so the
// Download / What's New sections on the site stay in sync automatically.
// Run by .github/workflows/sync-release-info.yml on every `release` webhook
// (published/edited), and safe to re-run by hand — with no `release` event
// in the environment it just falls back to whatever is currently the latest
// published release.

import { readFileSync, writeFileSync } from 'node:fs';

const OWNER = 'molayab';
const REPO = 'grove-website';

async function loadRelease() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (process.env.GITHUB_EVENT_NAME === 'release' && eventPath) {
    const payload = JSON.parse(readFileSync(eventPath, 'utf8'));
    if (payload.release) return payload.release;
  }

  const headers = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`, { headers });
  if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
  return res.json();
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// A tiny, dependency-free renderer for the handful of markdown constructs
// GitHub release notes actually use — headings, lists, bold, code, links.
function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let listType = null;

  const closeList = () => {
    if (listType) { html.push(`</${listType}>`); listType = null; }
  };
  const inline = (text) =>
    escapeHtml(text)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { closeList(); continue; }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = Math.min(heading[1].length + 1, 6);
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.*)$/);
    const unordered = line.match(/^[-*]\s+(.*)$/);
    if (ordered || unordered) {
      const type = ordered ? 'ol' : 'ul';
      if (listType !== type) { closeList(); html.push(`<${type}>`); listType = type; }
      html.push(`<li>${inline((ordered || unordered)[1])}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  return html.join('\n');
}

const release = await loadRelease();
const assets = release.assets || [];
const primaryAsset = assets.find((a) => a.name === 'Grove.dmg') ?? assets.find((a) => a.name.endsWith('.dmg')) ?? assets[0];

// The release title repeats the version as its own heading; the page
// renders that heading itself, so drop the duplicate from the body.
const notesBody = release.body.replace(/^#{1,6}\s+Grove v\S+\s*\n+/, '').trim();

const data = {
  version: release.tag_name.replace(/^v/, ''),
  tag: release.tag_name,
  name: release.name,
  published_at: release.published_at,
  html_url: release.html_url,
  download_url: primaryAsset?.browser_download_url ?? null,
  size_bytes: primaryAsset?.size ?? null,
  notes_html: renderMarkdown(notesBody),
};

writeFileSync('download.json', `${JSON.stringify(data, null, 2)}\n`);
console.log(`Wrote download.json for ${data.tag}`);
