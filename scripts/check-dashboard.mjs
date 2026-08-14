import { readFile } from "node:fs/promises";
import vm from "node:vm";

const html = await readFile(new URL("../dashboard.html", import.meta.url), "utf8");
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .filter((match) => !/\bsrc\s*=|\btype\s*=\s*["']module["']/i.test(match[0]));

if (scripts.length !== 1) {
  throw new Error(`Expected one inline dashboard script, found ${scripts.length}.`);
}

new vm.Script(scripts[0][1], { filename: "dashboard.html:inline-script" });

const requiredOperationalSignals = [
  'id="statEmailFailures"',
  'id="statOverdue"',
  "notification_email_status",
  "confirmation_email_status",
  "Submission reference",
];
for (const signal of requiredOperationalSignals) {
  if (!html.includes(signal)) throw new Error(`Dashboard is missing operational signal: ${signal}`);
}

console.log("Dashboard JavaScript syntax is valid.");
