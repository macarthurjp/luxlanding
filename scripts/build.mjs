import { cp, mkdir, rm, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDirectory = join(projectRoot, "dist");
const publicEntries = [
  "index.html",
  "style.css",
  "form.css",
  "script.js",
  "languages.js",
  "logic.js",
  "submit.js",
  "robots.txt",
  "sitemap.xml",
  "site.webmanifest",
  "_headers",
];

const publicImages = [
  "hero-luxembourg-premium-v1.webp",
  "preview-v3.jpg",
  "favicon-64.png",
  "favicon.png",
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const entry of publicEntries) {
  const source = join(projectRoot, entry);
  const destination = join(outputDirectory, entry);
  const sourceStats = await stat(source);

  await cp(source, destination, {
    recursive: sourceStats.isDirectory(),
    force: true,
  });
}

await mkdir(join(outputDirectory, "images"), { recursive: true });
for (const image of publicImages) {
  await cp(join(projectRoot, "images", image), join(outputDirectory, "images", image), { force: true });
}

// Some browsers still request /favicon.ico even when a PNG icon is declared.
await cp(join(projectRoot, "images/favicon-64.png"), join(outputDirectory, "favicon.ico"), { force: true });

await cp(join(projectRoot, "fonts"), join(outputDirectory, "fonts"), { recursive: true, force: true });

const phoneInputSource = join(projectRoot, "node_modules", "intl-tel-input", "dist");
const phoneInputDestination = join(outputDirectory, "vendor", "intl-tel-input");
await mkdir(phoneInputDestination, { recursive: true });
await mkdir(join(phoneInputDestination, "css"), { recursive: true });
await cp(join(phoneInputSource, "css", "intlTelInput.min.css"), join(phoneInputDestination, "css", "intlTelInput.min.css"), { force: true });
await cp(join(phoneInputSource, "js", "intlTelInput.min.js"), join(phoneInputDestination, "intlTelInput.min.js"), { force: true });
await cp(join(phoneInputSource, "js", "utils.js"), join(phoneInputDestination, "utils.js"), { force: true });
await mkdir(join(phoneInputDestination, "img"), { recursive: true });
await cp(join(phoneInputSource, "img", "flags.webp"), join(phoneInputDestination, "img", "flags.webp"), { force: true });
await cp(join(phoneInputSource, "img", "flags@2x.webp"), join(phoneInputDestination, "img", "flags@2x.webp"), { force: true });

console.log(`Built ${publicEntries.length + publicImages.length + 3} public entries in dist/.`);
