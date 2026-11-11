#!/usr/bin/env node
// Regenerates the "From the blog" list on index.html and es/index.html from
// the Atom feed of molayab.com, keeping the three newest posts tagged `grove`.
// Run daily by .github/workflows/sync-blog-posts.yml, and safe to re-run by
// hand: it only rewrites what sits between the
// `<!-- blog-posts:start -->` / `<!-- blog-posts:end -->` markers, and the
// output is deterministic, so an unchanged feed leaves the pages untouched.
// Any fetch or parse failure exits non-zero before a single file is written.

import { readFileSync, writeFileSync } from 'node:fs';

const FEED_URL = 'https://molayab.com/feed.xml';
const POST_URL_PREFIX = 'https://molayab.com/';
const CATEGORY = 'grove';
const POST_COUNT = 3;
const SUMMARY_MAX = 160;
const START_MARKER = '<!-- blog-posts:start -->';
const END_MARKER = '<!-- blog-posts:end -->';

const PAGES = [
  { file: 'index.html', locale: 'en-US' },
  { file: 'es/index.html', locale: 'es-ES' },
];

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  hellip: '…', mdash: '—', ndash: '–', middot: '·',
};

function fail(message) {
  console.error(`sync-blog-posts: ${message}`);
  process.exit(1);
}

function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (match, name) => {
    if (name[0] === '#') {
      const code = name[1] === 'x' || name[1] === 'X'
        ? parseInt(name.slice(2), 16)
        : parseInt(name.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    return NAMED_ENTITIES[name.toLowerCase()] ?? match;
  });
}

function escapeHTML(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Turns an Atom text construct (type="html", either CDATA or entity-escaped)
// into plain text: unwrap/decode the XML layer, drop the HTML tags, then
// decode the HTML layer's own entities.
function textContent(raw) {
  const cdata = raw.trim().match(/^<!\[CDATA\[([\s\S]*)\]\]>$/);
  const html = cdata ? cdata[1] : decodeEntities(raw);
  return decodeEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function element(entry, name) {
  const match = entry.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
  return match ? match[1] : null;
}

function truncate(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max / 2 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:—–-]+$/, '')}…`;
}

function parseEntry(entry, index) {
  const title = element(entry, 'title');
  const published = element(entry, 'published');
  const link = [...entry.matchAll(/<link\b([^>]*)\/?>/g)]
    .map((m) => m[1])
    .find((attrs) => !/\brel="/.test(attrs) || /\brel="alternate"/.test(attrs));
  const href = link?.match(/\bhref="([^"]*)"/)?.[1];
  const categories = [...entry.matchAll(/<category\b[^>]*\bterm="([^"]*)"/g)].map((m) => decodeEntities(m[1]));
  const summary = element(entry, 'summary') ?? element(entry, 'content') ?? '';

  if (!title || !published || !href) fail(`entry ${index + 1} is missing a title, published date, or link`);
  const date = new Date(published.trim());
  if (Number.isNaN(date.getTime())) fail(`entry ${index + 1} has an unparseable date: ${published}`);
  const url = decodeEntities(href);
  if (!url.startsWith(POST_URL_PREFIX)) fail(`entry ${index + 1} links outside ${POST_URL_PREFIX}: ${url}`);

  return {
    title: textContent(title),
    url,
    date,
    categories,
    summary: truncate(textContent(summary), SUMMARY_MAX),
  };
}

function renderList(posts, locale, indent) {
  const format = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  const lines = ['<div class="blog-grid">'];
  for (const post of posts) {
    lines.push(
      '  <article class="blog-card">',
      `    <time class="blog-date" datetime="${post.date.toISOString().slice(0, 10)}">${escapeHTML(format.format(post.date))}</time>`,
      `    <h3><a href="${escapeHTML(post.url)}">${escapeHTML(post.title)}</a></h3>`,
    );
    if (post.summary) lines.push(`    <p>${escapeHTML(post.summary)}</p>`);
    lines.push('  </article>');
  }
  lines.push('</div>');
  return lines.map((line) => `${indent}${line}`).join('\n');
}

function replaceBetweenMarkers(html, file, list) {
  const start = html.indexOf(START_MARKER);
  const end = html.indexOf(END_MARKER);
  if (start === -1 || end === -1 || end < start) fail(`${file} is missing the ${START_MARKER} / ${END_MARKER} markers`);
  if (html.indexOf(START_MARKER, start + 1) !== -1) fail(`${file} has more than one ${START_MARKER} marker`);
  const lineStart = html.lastIndexOf('\n', start) + 1;
  const indent = html.slice(lineStart, start);
  if (/\S/.test(indent)) fail(`${file}: ${START_MARKER} must be on its own line`);
  return `${html.slice(0, start + START_MARKER.length)}\n${list(indent)}\n${indent}${html.slice(end)}`;
}

let xml;
try {
  const res = await fetch(FEED_URL, { signal: AbortSignal.timeout(30_000) });
  if (!res.ok) fail(`${FEED_URL} returned ${res.status}`);
  xml = await res.text();
} catch (error) {
  fail(`could not fetch ${FEED_URL}: ${error.message}`);
}

if (!/<feed\b[^>]*xmlns="http:\/\/www\.w3\.org\/2005\/Atom"/.test(xml)) fail(`${FEED_URL} is not an Atom feed`);

const entries = [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
if (entries.length === 0) fail(`${FEED_URL} has no entries`);

const posts = entries
  .map(parseEntry)
  .filter((post) => post.categories.includes(CATEGORY))
  .sort((a, b) => b.date - a.date)
  .slice(0, POST_COUNT);
if (posts.length === 0) fail(`${FEED_URL} has no entries in category "${CATEGORY}"`);

const updates = PAGES.map(({ file, locale }) => {
  const html = readFileSync(file, 'utf8');
  return { file, html, next: replaceBetweenMarkers(html, file, (indent) => renderList(posts, locale, indent)) };
});

for (const { file, html, next } of updates) {
  if (next === html) {
    console.log(`${file} already up to date`);
  } else {
    writeFileSync(file, next);
    console.log(`Updated ${file} with ${posts.length} post(s)`);
  }
}
