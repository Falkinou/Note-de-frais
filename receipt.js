(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Receipt = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const months = ["janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "decembre"];
  const aliases = ["janv?", "fevr?", "mars", "avr", "mai", "juin", "juil", "aout", "sept?", "oct", "nov", "dec"];
  const normalize = text => String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  function isoDate(day, month, year) {
    const y = Number(String(year).length === 2 ? "20" + year : year), m = Number(month), d = Number(day);
    const value = new Date(Date.UTC(y, m - 1, d));
    if (y < 2000 || y > 2100 || value.getUTCFullYear() !== y || value.getUTCMonth() !== m - 1 || value.getUTCDate() !== d) return "";
    return [y, String(m).padStart(2, "0"), String(d).padStart(2, "0")].join("-");
  }
  function validDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
    return !!match && isoDate(match[3], match[2], match[1]) === value;
  }
  function displayDate(value) {
    return validDate(value) ? value.slice(8) + "/" + value.slice(5, 7) + "/" + value.slice(0, 4) : "";
  }
  function filename(value, extension = "png") {
    return "NDF_" + (validDate(value) ? value.slice(8) + value.slice(5, 7) + value.slice(0, 4) : "sans-date") + "." + extension;
  }
  function extractDates(text) {
    const results = new Map();
    const monthPattern = months.map((m, i) => m + "|" + aliases[i] + "\\.?").join("|");
    for (const raw of String(text || "").split(/\r?\n/)) {
      // Compact only numeric date-shaped runs, ISO first to avoid reading the
      // end of a spaced year as a separate day/month/year date.
      const compact = value => value.replace(/(\d)[ \t]+(?=\d)/g, "$1");
      const line = normalize(raw)
        .replace(/(?:^|[^\d/.-])(\d(?:[ \t]*\d){3})\s*[-/.]\s*(\d(?:[ \t]*\d)?)\s*[-/.]\s*(\d(?:[ \t]*\d)?)(?!\d|[/.\-]\s*\d)/g, compact)
        .replace(/(?:^|[^\d/.-])(\d(?:[ \t]*\d)?)\s*[-/.]\s*(\d(?:[ \t]*\d)?)\s*[-/.]\s*(\d(?:[ \t]*\d){3}|\d[ \t]*\d)(?!\d|[/.\-]\s*\d)/g, compact);
      // These dates describe validity, a card, or a deadline, not the purchase.
      if (/expir|valable|validite|peremption|echeance|naissance/.test(line)) continue;
      function collect(regex, parts) {
        for (const match of line.matchAll(regex)) {
          const values = parts(match), iso = isoDate(...values);
          if (!iso) continue;
          const evidence = raw.trim().slice(0, 180);
          if (!results.has(iso)) results.set(iso, { iso, evidence });
        }
      }
      collect(/(?:^|[^\d/.-])(\d{4})\s*[-/.]\s*(\d{1,2})\s*[-/.]\s*(\d{1,2})(?!\d|[/.\-]\s*\d)/g, m => [m[3], m[2], m[1]]);
      collect(/(?:^|[^\d/.-])(\d{1,2})\s*[-/.]\s*(\d{1,2})\s*[-/.]\s*(\d{4}|\d{2})(?!\d|[/.\-]\s*\d)/g, m => [m[1], m[2], m[3]]);
      collect(new RegExp("(?:^|[^\\d])(\\d{1,2})(?:er)?\\s+(" + monthPattern + ")\\s+(\\d{4}|\\d{2})(?!\\d)", "g"), m => {
        const token = m[2].replace(/\.$/, "");
        const index = months.findIndex((name, i) => name === token || new RegExp("^" + aliases[i] + "$").test(token));
        return [m[1], index + 1, m[3]];
      });
    }
    const candidates = Array.from(results.values());
    return { status: candidates.length === 1 ? "found" : candidates.length ? "ambiguous" : "missing", candidates };
  }
  // One instance per ticket; a late OCR result can never overwrite manual input.
  class Session {
    constructor(id, source) {
      this.id = id;
      this.source = source;
      this.original = source;
      this.image = source;
      this.enhanced = false;
      this.date = "";
      this.dateSource = "";
      this.ocrStatus = "reading";
      this.candidates = [];
      this.cancelled = false;
      this.revision = 0;
    }
    setDate(value, source = "manual") {
      this.date = validDate(value) ? value : "";
      this.dateSource = source;
    }
    applyOCR(result) {
      if (this.cancelled) return;
      this.ocrStatus = result.status;
      this.candidates = result.candidates || [];
      if (this.dateSource === "manual") return;
      this.date = result.status === "found" && this.candidates.length === 1 ? this.candidates[0].iso : "";
      this.dateSource = this.date ? "ocr" : "";
    }
    replaceImage(image) {
      this.image = image;
      this.original = image;
      this.enhanced = false;
      this.revision++;
    }
    cancel() { this.cancelled = true; }
  }
  return { isoDate, validDate, displayDate, filename, extractDates, Session };
});
