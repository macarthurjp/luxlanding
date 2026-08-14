import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");
const sitemap = await readFile(new URL("sitemap.xml", root), "utf8");
const robots = await readFile(new URL("robots.txt", root), "utf8");
const manifestSource = await readFile(new URL("site.webmanifest", root), "utf8");

const requiredHeadSignals = [
  /<link rel="canonical" href="https:\/\/luxlanding\.eu\/">/,
  /<link rel="alternate" hreflang="x-default"/,
  /<meta property="og:image:alt"/,
  /<meta name="twitter:image:alt"/,
  /<link rel="manifest" href="\/site\.webmanifest">/,
];

for (const signal of requiredHeadSignals) {
  if (!signal.test(html)) throw new Error(`Missing SEO signal: ${signal}`);
}

const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
if (!jsonLdBlocks.length) throw new Error("No JSON-LD structured data found.");
for (const [, source] of jsonLdBlocks) JSON.parse(source);

const locales = ["en", "fr", "es", "pt"];
for (const locale of locales) {
  if (!sitemap.includes(`hreflang="${locale}"`)) throw new Error(`Sitemap is missing ${locale} hreflang.`);
}
if ((sitemap.match(/<url>/g) || []).length !== locales.length) {
  throw new Error("Sitemap must contain one URL entry per supported language.");
}
if (!robots.includes("https://luxlanding.eu/sitemap.xml")) {
  throw new Error("robots.txt does not advertise the production sitemap.");
}

const manifest = JSON.parse(manifestSource);
if (manifest.name !== "LuxLanding" || !Array.isArray(manifest.icons) || manifest.icons.length < 2) {
  throw new Error("Web manifest is incomplete.");
}

console.log("SEO metadata, structured data, sitemap and manifest checks passed.");
