#!/usr/bin/env node
// Regenerates public/download.json from this repo's latest GitHub release so the
// Download section shows the current version, size and date. Run by
// .github/workflows/deploy.yml before every build; safe to run by hand.
//
// Releases are published here by the Grove app's release workflow, which creates the
// release first and uploads the DMGs right after. When a deploy is triggered by that
// release (see redeploy-on-release.yml) it passes RELEASE_TAG, and this script waits
// until the latest release *is* that tag and its Grove.dmg has finished uploading.

import { writeFileSync } from 'node:fs';

const OWNER = 'molayab';
const REPO = 'grove-website';
const EXPECTED_TAG = process.env.RELEASE_TAG || '';
const ATTEMPTS = EXPECTED_TAG ? 12 : 1;
const WAIT_MS = 15_000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function latestRelease() {
  const headers = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`, { headers });
  if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
  return res.json();
}

const dmgOf = (release) => {
  const assets = (release.assets || []).filter((a) => a.state === 'uploaded');
  return assets.find((a) => a.name === 'Grove.dmg') ?? assets.find((a) => a.name.endsWith('.dmg')) ?? null;
};

let release;
for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
  release = await latestRelease();
  const ready = (!EXPECTED_TAG || release.tag_name === EXPECTED_TAG) && dmgOf(release);
  if (ready || attempt === ATTEMPTS) break;
  console.log(`Waiting for ${EXPECTED_TAG} with an uploaded DMG (latest: ${release.tag_name}, attempt ${attempt}/${ATTEMPTS})`);
  await sleep(WAIT_MS);
}
if (EXPECTED_TAG && release.tag_name !== EXPECTED_TAG) {
  console.warn(`::warning::Latest release is ${release.tag_name}, expected ${EXPECTED_TAG}; using it anyway.`);
}

const asset = dmgOf(release);
const data = {
  version: release.tag_name.replace(/^v/, ''),
  tag: release.tag_name,
  name: release.name,
  published_at: release.published_at,
  html_url: release.html_url,
  download_url: asset?.browser_download_url ?? null,
  size_bytes: asset?.size ?? null,
};

writeFileSync('public/download.json', `${JSON.stringify(data, null, 2)}\n`);
console.log(`Wrote public/download.json for ${data.tag}`);
