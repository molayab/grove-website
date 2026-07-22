#!/usr/bin/env node
// Regenerates download.json from this repo's GitHub release so the Download
// section on the site stays in sync automatically. Run by
// .github/workflows/sync-release-info.yml on every `release` webhook
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

const release = await loadRelease();
const assets = release.assets || [];
const primaryAsset = assets.find((a) => a.name === 'Grove.dmg') ?? assets.find((a) => a.name.endsWith('.dmg')) ?? assets[0];

const data = {
  version: release.tag_name.replace(/^v/, ''),
  tag: release.tag_name,
  name: release.name,
  published_at: release.published_at,
  html_url: release.html_url,
  download_url: primaryAsset?.browser_download_url ?? null,
  size_bytes: primaryAsset?.size ?? null,
};

writeFileSync('download.json', `${JSON.stringify(data, null, 2)}\n`);
console.log(`Wrote download.json for ${data.tag}`);
