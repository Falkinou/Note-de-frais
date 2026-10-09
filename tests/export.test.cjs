const { test } = require("node:test");
const assert = require("node:assert/strict");
const { deliver } = require("../export-file.js");
for (const type of ["image/png", "application/pdf"]) {
  test(type + " : annuler le partage ne télécharge pas et ne réussit pas", async () => {
    let downloaded = false;
    const result = await deliver(new Blob(["x"], { type }), "ticket", "share", {
      File, navigator: { canShare: () => true, share: async () => { throw Object.assign(new Error(), { name: "AbortError" }); } },
      download: () => { downloaded = true; }
    });
    assert.equal(result, "cancelled");
    assert.equal(downloaded, false);
  });
}
test("partage réussi et téléchargement direct ont un résultat explicite", async () => {
  const blob = new Blob(["x"], { type: "image/png" });
  let downloads = 0, shares = 0;
  const env = { File, navigator: { canShare: () => true, share: async () => { shares++; } }, download: () => { downloads++; } };
  assert.equal(await deliver(blob, "ticket.png", "share", env), "shared");
  assert.equal(await deliver(blob, "ticket.png", "download", env), "downloaded");
  assert.equal(downloads, 1); assert.equal(shares, 1);
});
test("échec du téléchargement propagé, jamais compté comme réussi", async () => {
  await assert.rejects(deliver(new Blob(["x"]), "ticket", "download", { File, navigator: {}, download: () => { throw new Error("blocked"); } }));
});
