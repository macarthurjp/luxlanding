import "./build.mjs";
import { copyFile } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);
const outputDirectory = new URL("../dist/", import.meta.url);

await copyFile(
  new URL("dashboard.html", projectRoot),
  new URL("dashboard.html", outputDirectory),
);
await copyFile(
  new URL("images/luxlanding-logo-clean.png", projectRoot),
  new URL("images/luxlanding-logo-clean.png", outputDirectory),
);
await copyFile(
  new URL("_headers.staging", projectRoot),
  new URL("_headers", outputDirectory),
);

console.log("Added the authenticated dashboard to the staging-only build.");
