(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.StampfelCounters = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const KEY = "stampfel_counters_v1";
  const validCount = value => Number.isSafeInteger(value) && value >= 0 && value <= 100000000;
  function create(options) {
    const { storage, fetch, randomId, randomDevice, onChange = () => {}, locks } = options;
    let state, syncing = null;
    function read(key) { try { return storage.getItem(key); } catch (_) { return null; } }
    function write(key, value) { try { storage.setItem(key, value); } catch (_) {} }
    function load() {
      try {
        const value = JSON.parse(read(KEY));
        if (value && /^[a-f0-9]{64}$/.test(value.device) && validCount(value.legacy) && validCount(value.personal) &&
          (value.community === null || validCount(value.community)) && Array.isArray(value.pending) && Array.isArray(value.seen)) {
          state = value;
        }
      } catch (_) {}
    }
    load();
    if (!state) {
      const legacy = Number(read("ndf_count")) || 0;
      state = { device: randomDevice(), legacy: validCount(legacy) ? legacy : 0, personal: validCount(legacy) ? legacy : 0, community: null, pending: [], seen: [] };
      write(KEY, JSON.stringify(state));
    }
    function snapshot() {
      return { personal: state.personal + state.pending.length, community: state.community, pending: state.pending.length };
    }
    function persist() {
      write(KEY, JSON.stringify(state));
      write("ndf_count", String(snapshot().personal));
      onChange(snapshot());
    }
    async function locked(name, operation) {
      return locks ? locks.request("stampfel-counters-" + name, operation) : operation();
    }
    function change(operation) {
      return locked("storage", () => { load(); operation(); persist(); });
    }
    async function send(events) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(options.url + "/sync", {
          method: "POST", cache: "no-store", signal: controller.signal,
          headers: { "Content-Type": "application/json", "X-Stampfel-Device": state.device },
          body: JSON.stringify({ legacyCount: state.legacy, events })
        });
        if (!response.ok) throw new Error("Counters unavailable");
        const result = await response.json();
        if (!validCount(result.personal) || !validCount(result.community) || !Array.isArray(result.accepted) ||
          events.some(id => !result.accepted.includes(id))) throw new Error("Invalid counter response");
        return result;
      } finally { clearTimeout(timeout); }
    }
    function sync() {
      if (syncing) return syncing;
      syncing = locked("network", async () => {
        do {
          load();
          const events = state.pending.slice(0, 100);
          const result = await send(events);
          await change(() => {
            state.pending = state.pending.filter(id => !events.includes(id));
            state.personal = Math.max(state.personal, result.personal);
            state.community = Math.max(state.community || 0, result.community);
          });
        } while (state.pending.length);
        return true;
      }).catch(() => false).finally(() => { syncing = null; });
      return syncing;
    }
    async function record(event = randomId()) {
      let added = false;
      await change(() => {
        if (state.seen.includes(event)) return;
        state.seen.push(event);
        state.seen = state.seen.slice(-2000);
        state.pending.push(event);
        added = true;
      });
      void sync();
      return added;
    }
    function refresh() { load(); onChange(snapshot()); }
    return { snapshot, record, sync, refresh };
  }
  return { create, KEY };
});
