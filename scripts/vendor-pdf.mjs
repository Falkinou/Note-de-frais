import { mkdir, copyFile, readFile, writeFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const source = path.join(root, "node_modules/pdfjs-dist");
const destination = path.join(root, "vendor/pdfjs");
const files = [["legacy/build/pdf.min.mjs", "pdf.min.mjs"], ["legacy/build/pdf.worker.min.mjs", "pdf.worker.min.mjs"], ["LICENSE", "LICENSE"]];
for (const directory of ["cmaps", "standard_fonts", "wasm"]) {
  for (const file of await readdir(path.join(source, directory))) files.push([directory + "/" + file, directory + "/" + file]);
}
const checksums = {};
for (const [from, to] of files) {
  await mkdir(path.dirname(path.join(destination, to)), { recursive: true });
  await copyFile(path.join(source, from), path.join(destination, to));
  checksums[to] = createHash("sha256").update(await readFile(path.join(destination, to))).digest("hex");
}
const version = JSON.parse(await readFile(path.join(source, "package.json"))).version;
await writeFile(path.join(destination, "versions.json"), JSON.stringify({ version, source: "https://github.com/mozilla/pdf.js", license: "Apache-2.0", sha256: checksums }, null, 2) + "\n");
console.log("PDF.js " + version + " : " + files.length + " ressources locales.");
