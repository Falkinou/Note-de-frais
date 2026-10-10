const { test } = require("node:test");
const assert = require("node:assert/strict");
const { randomUUID, randomBytes } = require("node:crypto");
const { create, KEY } = require("../counters.js");

function fixture(count = 119) {
  const data = new Map([["ndf_count", String(count)]]), devices = new Map();
  let fail = false, loseResponse = false, legacy = 326;
  const options = {
    storage: { getItem: key => data.get(key) || null, setItem: (key, value) => data.set(key, value) },
    url: "/api/counters", randomId: randomUUID, randomDevice: () => randomBytes(32).toString("hex"),
    fetch: async (url, request) => {
      if (fail) throw new Error("offline");
      const body = JSON.parse(request.body), id = request.headers["X-Stampfel-Device"];
      if (!devices.has(id)) devices.set(id, { initial: body.legacyCount, events: new Set() });
      const device = devices.get(id);
      for (const event of body.events) device.events.add(event);
      if (loseResponse && body.events.length) { loseResponse = false; throw new Error("response lost after commit"); }
      return { ok: true, json: async () => ({ personal: device.initial + device.events.size, community: legacy + [...devices.values()].reduce((sum, d) => sum + d.events.size, 0), accepted: body.events }) };
    }
  };
  return { options, data, devices, offline: value => { fail = value; }, loseResponse: () => { loseResponse = true; }, legacy: value => { legacy = value; } };
}
test("importe 119 personnels sans les rajouter aux 326 communautaires", async () => {
  const f = fixture(), client = create(f.options);
  assert.equal(await client.sync(), true);
  assert.deepEqual(client.snapshot(), { personal: 119, community: 326, pending: 0 });
  await create(f.options).sync();
  assert.equal(f.devices.size, 1);
});
test("deux exports du même ticket, un seul ajout après rechargement", async () => {
  const f = fixture(), client = create(f.options), event = randomUUID();
  await client.record(event); await client.sync();
  const reloaded = create(f.options);
  assert.equal(await reloaded.record(event), false); await reloaded.sync();
  assert.deepEqual(reloaded.snapshot(), { personal: 120, community: 327, pending: 0 });
  assert.equal(f.data.get("ndf_count"), "120");
});
test("export hors ligne conservé puis synchronisé sans gonfler la valeur migrée", async () => {
  const f = fixture(); f.offline(true);
  const client = create(f.options); await client.record(randomUUID()); await client.sync();
  assert.equal(client.snapshot().personal, 120);
  assert.equal(JSON.parse(f.data.get(KEY)).legacy, 119);
  f.offline(false);
  const reloaded = create(f.options); await reloaded.sync();
  assert.deepEqual(reloaded.snapshot(), { personal: 120, community: 327, pending: 0 });
});
test("réponse perdue après écriture serveur : la répétition ne double pas le ticket", async () => {
  const f = fixture(), client = create(f.options); f.loseResponse();
  await client.record(randomUUID()); await client.sync();
  await client.sync();
  assert.deepEqual(client.snapshot(), { personal: 120, community: 327, pending: 0 });
});
test("un compteur communautaire indisponible reste inconnu, jamais remplacé par zéro", async () => {
  const f = fixture(); f.offline(true);
  const client = create(f.options); await client.sync();
  assert.equal(client.snapshot().community, null);
  f.offline(false); await client.sync(); f.offline(true); await client.sync();
  assert.equal(client.snapshot().community, 326);
});
