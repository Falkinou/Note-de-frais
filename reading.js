(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./receipt.js'));
  else root.ReceiptReading = factory(root.Receipt);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Receipt) {
  'use strict';
  const threshold = 75;
  function linesFromOCR(data) {
    return (data.blocks || []).flatMap(block => (block.paragraphs || []).flatMap(paragraph => paragraph.lines || []));
  }
  function union(boxes) {
    const valid = boxes.filter(box => box && [box.x0, box.y0, box.x1, box.y1].every(Number.isFinite) && box.x1 > box.x0 && box.y1 > box.y0);
    return valid.length ? { x0: Math.min(...valid.map(b => b.x0)), y0: Math.min(...valid.map(b => b.y0)), x1: Math.max(...valid.map(b => b.x1)), y1: Math.max(...valid.map(b => b.y1)) } : null;
  }
  // Confidence belongs to the actual date/time tokens, not the shop logo or totals.
  function evidence(line, candidate, kind) {
    const words = line.words || [], matches = [];
    for (let start = 0; start < words.length; start++) {
      for (let count = 1; count <= 8 && start + count <= words.length; count++) {
        const selection = words.slice(start, start + count), text = selection.map(word => word.text).join(' ');
        const values = kind === 'date' ? Receipt.extractDates(text).candidates : Receipt.extractTimes(text);
        if (values.some(value => kind === 'date' ? value.iso === candidate.iso : value.time === candidate.time)) { matches.push(selection); break; }
      }
    }
    matches.sort((a, b) => a.length - b.length);
    const selection = matches[0];
    const confidence = selection ? Math.min(...selection.map(word => Number.isFinite(word.confidence) ? word.confidence : line.confidence || 0)) : Number(line.confidence) || 0;
    return { ...candidate, confidence, box: union(selection ? selection.map(word => word.bbox) : [line.bbox]) };
  }
  function analyze(lines, fallbackText = '', confidence = 0) {
    if (!lines.length) lines = String(fallbackText).split(/\r?\n/).map(text => ({ text, confidence }));
    const parsed = Receipt.extractDetails(lines.map(line => (line.text || '').trim()).join('\n'));
    function attach(candidate, kind) {
      const matching = lines.filter(line => (line.text || '').trim().slice(0, 180) === candidate.evidence);
      const proofs = matching.map(line => evidence(line, candidate, kind)).sort((a, b) => b.confidence - a.confidence);
      return proofs[0] || { ...candidate, confidence: 0, box: null };
    }
    const candidates = parsed.candidates.map(candidate => attach(candidate, 'date'));
    const timeCandidates = parsed.times.map(candidate => attach(candidate, 'time'));
    return { status: parsed.status === 'found' && candidates[0].confidence < threshold ? 'uncertain' : parsed.status,
      candidates, timeCandidates, times: timeCandidates.filter(time => time.confidence >= threshold) };
  }
  function fromOCR(data) { return analyze(linesFromOCR(data), data.text, data.confidence); }
  // Two passes can recover missing information, but disagreement must remain visible.
  function merge(first, second) {
    function combine(a, b, key) {
      const values = new Map();
      [...a, ...b].forEach(value => { const id = key(value), old = values.get(id); if (!old || value.confidence > old.confidence) values.set(id, value); });
      return [...values.values()];
    }
    const candidates = combine(first.candidates, second.candidates, value => value.iso);
    const timeCandidates = combine(first.timeCandidates || first.times, second.timeCandidates || second.times, value => (value.date || '') + '|' + value.time);
    return { status: candidates.length > 1 ? 'ambiguous' : candidates.length ? candidates[0].confidence >= threshold ? 'found' : 'uncertain' : 'missing',
      candidates, timeCandidates, times: timeCandidates.filter(time => time.confidence >= threshold) };
  }
  function needsRefinement(result) { return result.status !== 'ambiguous' && (result.status !== 'found' || !result.times.length); }
  function pdfLines(items, viewport, styles = {}) {
    const groups = []; let line = [];
    function flush() {
      if (line.length) { groups.push({ text: line.map(word => word.text).join(' '), confidence: 100, words: line, bbox: union(line.map(word => word.bbox)) }); line = []; }
    }
    items.forEach(item => {
      if (typeof item.str !== 'string') return;
      const t = item.transform, v = viewport.transform;
      const point = (x, y) => ({ x: v[0] * x + v[2] * y + v[4], y: v[1] * x + v[3] * y + v[5] });
      const width = Math.hypot(t[0], t[1]) || 1;
      const ascent = styles[item.fontName]?.ascent ?? .85, descent = styles[item.fontName]?.descent ?? -.2;
      const corners = [[0, descent], [0, ascent], [item.width, descent], [item.width, ascent]].map(([x, y]) => point(t[4] + t[0] / width * x + t[2] * y, t[5] + t[1] / width * x + t[3] * y));
      const bbox = { x0: Math.min(...corners.map(p => p.x)), y0: Math.min(...corners.map(p => p.y)), x1: Math.max(...corners.map(p => p.x)), y1: Math.max(...corners.map(p => p.y)) };
      if (item.str.trim()) line.push({ text: item.str, confidence: 100, bbox });
      if (item.hasEOL) flush();
    });
    flush(); return groups;
  }
  return { analyze, fromOCR, linesFromOCR, merge, needsRefinement, pdfLines, union };
});
