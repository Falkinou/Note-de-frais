(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ExportFile = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  async function deliver(blob, name, method, environment) {
    const { navigator, File, download } = environment;
    if (method === "share" && navigator.share && navigator.canShare) {
      try {
        const file = new File([blob], name, { type: blob.type });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file] });
          return "shared";
        }
      } catch (error) {
        if (error.name === "AbortError") return "cancelled";
      }
    }
    await download(blob, name);
    return "downloaded";
  }
  return { deliver };
});
