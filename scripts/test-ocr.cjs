const { createWorker } = require("tesseract.js");
const { extractDates } = require("../receipt.js");
const fs = require("node:fs/promises");
const path = require("node:path");
(async () => {
  const root = path.join(__dirname, "..");
  const fixtures = JSON.parse(await fs.readFile(path.join(root, "tests/fixtures/expected.json")));
  await fs.mkdir(path.join(root, ".test-output"), { recursive: true });
  const worker = await createWorker("fra", 1, { langPath: path.join(root, "vendor/ocr"), cachePath: path.join(root, ".test-output") });
  const results = [];
  try {
    for (const fixture of fixtures) {
      const { data } = await worker.recognize(path.join(root, "tests/fixtures", fixture.name + ".png"), { rotateAuto: true });
      const result = extractDates(data.text);
      const passed = result.status === fixture.status && JSON.stringify(result.candidates.map(c => c.iso).sort()) === JSON.stringify(fixture.dates.sort());
      results.push({ ...fixture, passed, confidence: data.confidence, result });
      console.log((passed ? "PASS " : "FAIL ") + fixture.name + " : " + result.status);
    }
  } finally { await worker.terminate(); }
  await fs.writeFile(path.join(root, ".test-output/ocr-results.json"), JSON.stringify(results, null, 2));
  if (results.some(result => !result.passed)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
