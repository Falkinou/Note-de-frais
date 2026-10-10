(function () {
  'use strict';
  const base = new URL('./vendor/ocr/', document.currentScript.src);
  let scriptPromise, workerPromise, generation = 0, busy = false, rejectJob;
  function loadScript() {
    if (window.Tesseract) return Promise.resolve();
    if (!scriptPromise) scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script'); script.src = new URL('tesseract.min.js', base).href;
      script.onload = resolve;
      script.onerror = () => { script.remove(); scriptPromise = null; reject(new Error('Moteur de lecture indisponible')); };
      document.head.appendChild(script);
    });
    return scriptPromise;
  }
  function getWorker() {
    if (!workerPromise) {
      const pending = loadScript().then(() => Tesseract.createWorker('fra', 1, {
        workerPath: new URL('worker.min.js', base).href, corePath: base.href, langPath: base.href,
        workerBlobURL: false, gzip: true, errorHandler: function () {}
      })).catch(error => { if (workerPromise === pending) workerPromise = null; throw error; });
      workerPromise = pending;
    }
    return workerPromise;
  }
  function cancel() {
    generation++;
    if (rejectJob) { rejectJob(new Error('Lecture remplacée')); rejectJob = null; }
    // Keep an idle engine warm for the next ticket; terminate only an active job.
    if (busy) { const pending = workerPromise; workerPromise = null; if (pending) pending.then(worker => worker.terminate()).catch(() => {}); }
    busy = false;
  }
  async function proof(result, source) {
    const candidates = [...result.candidates, ...(result.timeCandidates || result.times)];
    if (!candidates.some(candidate => candidate.box)) return result;
    const image = await new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = source; });
    candidates.forEach(candidate => {
      if (!candidate.box) return;
      const box = candidate.box, padding = Math.max(10, (box.y1 - box.y0) * .5);
      const x = Math.max(0, Math.floor(box.x0 - padding)), y = Math.max(0, Math.floor(box.y0 - padding));
      const width = Math.min(image.width - x, Math.ceil(box.x1 + padding) - x), height = Math.min(image.height - y, Math.ceil(box.y1 + padding) - y);
      if (width <= 0 || height <= 0) return;
      const canvas = document.createElement('canvas'), scale = Math.min(3, 1000 / width);
      canvas.width = Math.ceil(width * scale); canvas.height = Math.ceil(height * scale);
      canvas.getContext('2d').drawImage(image, x, y, width, height, 0, 0, canvas.width, canvas.height);
      candidate.preview = canvas.toDataURL('image/png');
    });
    return result;
  }
  async function recognize(source, options = {}) {
    if (busy) cancel();
    const job = generation, started = performance.now(); let timeout;
    busy = true;
    const cancelled = new Promise((_, reject) => { rejectJob = reject; });
    const check = () => { if (job !== generation) throw new Error('Lecture remplacée'); };
    try {
      return await Promise.race([
        (async () => {
          const worker = await getWorker(); check();
          async function pass(input, mode) {
            try {
              const { data } = await worker.recognize(input, { rotateAuto: true, tessedit_pageseg_mode: mode, user_defined_dpi: '300' }, { text: true, blocks: true, imageColor: true });
              check(); return proof(ReceiptReading.fromOCR(data), data.imageColor || input);
            } catch (error) {
              if (job === generation) { workerPromise = null; await worker.terminate().catch(() => {}); }
              throw error;
            }
          }
          // Normalize paper lighting before recognition, without changing the exported photo.
          let normalized = source;
          try { normalized = await ReceiptImage.enhance(source, 'readable'); } catch (_) {}
          check(); let result = await pass(normalized, '6'); check();
          if (options.onProgress) options.onProgress(result);
          // At most one alternative pass, only when a date or hour is still missing.
          if (ReceiptReading.needsRefinement(result) && performance.now() - started < 20000) {
            check();
            try { result = ReceiptReading.merge(result, await pass(source, '11')); }
            catch (_) { check(); /* A failed refinement must not erase the first pass. */ }
            check();
          }
          result.durationMs = Math.round(performance.now() - started); return result;
        })(), cancelled,
        new Promise((_, reject) => { timeout = setTimeout(() => { if (job === generation) cancel(); reject(new Error('La lecture a pris trop de temps')); }, 45000); })
      ]);
    } finally { clearTimeout(timeout); if (job === generation) { busy = false; rejectJob = null; } }
  }
  window.ReceiptOCR = { recognize, cancel, proof };
})();
