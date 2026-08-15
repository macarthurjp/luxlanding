import { cp, mkdir, rm } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);
const outputDirectory = new URL("../dist-admin/", import.meta.url);

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(new URL("images/", outputDirectory), { recursive: true });

await cp(new URL("dashboard.html", projectRoot), new URL("index.html", outputDirectory));
await cp(new URL("fonts/", projectRoot), new URL("fonts/", outputDirectory), { recursive: true });
await cp(
  new URL("images/luxlanding-logo-transparent.png", projectRoot),
  new URL("images/luxlanding-logo-transparent.png", outputDirectory),
);
await cp(
  new URL("images/favicon.png", projectRoot),
  new URL("images/favicon.png", outputDirectory),
);
await cp(new URL("_headers.admin", projectRoot), new URL("_headers", outputDirectory));

console.log("Built isolated admin dashboard in dist-admin/.");
