import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const headers = await readFile(new URL("../_headers", import.meta.url), "utf8");

const executableInlineScripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(([, attributes, body]) => {
    if (/\bsrc\s*=/i.test(attributes)) return false;
    if (/\btype\s*=\s*["']application\/ld\+json["']/i.test(attributes)) return false;
    return body.trim().length > 0;
  });

if (executableInlineScripts.length) {
  throw new Error(`Found ${executableInlineScripts.length} executable inline script(s).`);
}
if (/googletagmanager|google-analytics/i.test(html + headers)) {
  throw new Error("Analytics must not load before a consent-management implementation exists.");
}
if (/fonts\.(?:googleapis|gstatic)\.com/i.test(html + headers)) {
  throw new Error("Production must use the self-hosted font assets.");
}

const csp = headers.match(/^\s*Content-Security-Policy:\s*(.+)$/mi)?.[1] || "";
const scriptDirective = csp.match(/(?:^|;)\s*script-src\s+([^;]+)/)?.[1] || "";
if (!scriptDirective || scriptDirective.includes("'unsafe-inline'")) {
  throw new Error("script-src must exist and must not allow unsafe inline JavaScript.");
}

console.log("Frontend supply-chain and CSP checks passed.");
