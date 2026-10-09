(function () {
  "use strict";
  const base = new URL("./vendor/ocr/", document.currentScript.src);
  let scriptPromise, workerPromise, generation = 0;
  function loadScript() {
    if (window.Tesseract) return Promise.resolve();
    if (!scriptPromise) scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = new URL("tesseract.min.js", base).href;
      script.onload = resolve;
      script.onerror = () => { script.remove(); scriptPromise = null; reject(new Error("Moteur de lecture indisponible")); };
      document.head.appendChild(script);
    });
    return scriptPromise;
  }
  async function getWorker() {
    if (!workerPromise) {
      const requestedGeneration = generation;
      const pending = (async () => {
      await loadScript();
      if (requestedGeneration !== generation) throw new Error("Lecture remplacée");
      const created = await Tesseract.createWorker("fra", 1, {
        workerPath: new URL("worker.min.js", base).href,
        corePath: base.href,
        langPath: base.href,
        workerBlobURL: false,
        gzip: true,
        errorHandler: function () {}
      });
      return created;
      })().catch(error => { if (workerPromise === pending) workerPromise = null; throw error; });
      workerPromise = pending;
    }
    return workerPromise;
  }
  function cancel() {
    generation++;
    const pending = workerPromise;
    workerPromise = null;
    if (pending) pending.then(w => w.terminate()).catch(() => {});
  }
  async function recognize(source) {
    const job = generation;
    let timeout;
    try {
      return await Promise.race([
        (async () => {
          const active = await getWorker();
          if (job !== generation) throw new Error("Lecture remplacée");
          const { data } = await active.recognize(source, { rotateAuto: true }, { text: true });
          if (job !== generation) throw new Error("Lecture remplacée");
          const result = Receipt.extractDates(data.text);
          if (result.status === "found" && data.confidence < 70) result.status = "uncertain";
          return result;
        })(),
        new Promise((_, reject) => {
          timeout = setTimeout(() => {
            if (job === generation) cancel();
            reject(new Error("La lecture a pris trop de temps"));
          }, 45000);
        })
      ]);
    } finally { clearTimeout(timeout); }
  }
  window.ReceiptOCR = { recognize, cancel };
})();
