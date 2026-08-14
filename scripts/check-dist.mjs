import { access, readdir } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);
const required = ["index.html", "style.css", "form.css", "submit.js", "_headers", "favicon.ico", "site.webmanifest"];
for (const file of required) await access(new URL(file, dist));
await access(new URL("fonts/inter-latin-variable.woff2", dist));
await access(new URL("fonts/sora-latin-variable.woff2", dist));
await access(new URL("images/favicon.png", dist));
await access(new URL("images/preview-v3.jpg", dist));
await access(new URL("images/hero-luxembourg-premium-v1.webp", dist));
await access(new URL("vendor/intl-tel-input/css/intlTelInput.min.css", dist));
await access(new URL("vendor/intl-tel-input/intlTelInput.min.js", dist));
await access(new URL("vendor/intl-tel-input/utils.js", dist));
await access(new URL("vendor/intl-tel-input/img/flags.webp", dist));
await access(new URL("vendor/intl-tel-input/img/flags@2x.webp", dist));

const forbidden = new Set(["dashboard.html", ".env", "wrangler.jsonc"]);
const entries = await readdir(dist);
for (const file of entries) {
  if (forbidden.has(file)) throw new Error(`Private file leaked into dist: ${file}`);
}

console.log("Distribution contains required assets and no private entries.");
