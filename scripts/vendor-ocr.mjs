import { mkdir, copyFile, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const destination = path.join(root, "vendor/ocr");
await mkdir(destination, { recursive: true });
const files = [
  ["tesseract.js/dist/tesseract.min.js", "tesseract.min.js"],
  ["tesseract.js/dist/worker.min.js", "worker.min.js"],
  ["tesseract.js/dist/tesseract.min.js.LICENSE.txt", "tesseract.min.js.LICENSE.txt"],
  ["tesseract.js/dist/worker.min.js.LICENSE.txt", "worker.min.js.LICENSE.txt"],
  ["tesseract.js/LICENSE.md", "TESSERACT-JS-LICENSE"],
  ["tesseract.js-core/LICENSE", "TESSERACT-CORE-LICENSE"],
  ["@tesseract.js-data/fra/4.0.0_best_int/fra.traineddata.gz", "fra.traineddata.gz"]
];
for (const core of ["lstm", "simd-lstm", "relaxedsimd-lstm"]) {
  const file = "tesseract-core-" + core + ".wasm.js";
  files.push(["tesseract.js-core/" + file, file]);
}
const checksums = {};
for (const [source, target] of files) {
  await copyFile(path.join(root, "node_modules", source), path.join(destination, target));
  checksums[target] = createHash("sha256").update(await readFile(path.join(destination, target))).digest("hex");
}
await writeFile(path.join(destination, "versions.json"), JSON.stringify({
  tesseract: "7.0.0", core: JSON.parse(await readFile(path.join(root, "node_modules/tesseract.js-core/package.json"))).version,
  frenchModel: "@tesseract.js-data/fra@1.0.0/4.0.0_best_int",
  modelSource: "https://github.com/naptha/tessdata", modelLicense: "Apache-2.0", sha256: checksums
}, null, 2) + "\n");
console.log("OCR copié sur la même origine : " + files.length + " fichiers.");
