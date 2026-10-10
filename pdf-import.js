(function () {
  "use strict";
  const base = new URL("./vendor/pdfjs/", document.currentScript.src);
  let library;
  async function open(file) {
    if (file.size > 25 * 1024 * 1024) throw new Error("Ce PDF dépasse 25 Mo. Importez un document plus léger.");
    if (!library) library = import(new URL("pdf.min.mjs", base).href).catch(error => { library = null; throw error; });
    const pdfjs = await library;
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdf.worker.min.mjs", base).href;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const task = pdfjs.getDocument({
      data: bytes.slice(),
      cMapUrl: new URL("cmaps/", base).href, cMapPacked: true,
      standardFontDataUrl: new URL("standard_fonts/", base).href,
      wasmUrl: new URL("wasm/", base).href,
      isEvalSupported: false, enableXfa: false
    });
    let protectedFile = false;
    task.onPassword = function () { protectedFile = true; void task.destroy(); };
    let document;
    try { document = await task.promise; }
    catch (error) {
      await task.destroy().catch(function () {});
      throw new Error(protectedFile ? "Ce PDF est protégé. Importez une copie sans mot de passe." : "Impossible de lire ce PDF. Vérifiez le document.");
    }
    let destroyed = false;
    async function renderPage(number, maxPixels = 2400) {
      if (destroyed) throw new Error("Import annulé");
      const page = await document.getPage(number);
      const natural = page.getViewport({ scale: 1 });
      const scale = Math.min(3, maxPixels / Math.max(natural.width, natural.height));
      const viewport = page.getViewport({ scale });
      const canvas = window.document.createElement("canvas");
      canvas.width = Math.max(1, Math.ceil(viewport.width)); canvas.height = Math.max(1, Math.ceil(viewport.height));
      const context = canvas.getContext("2d");
      try {
        await page.render({ canvasContext: context, viewport, background: "rgb(255,255,255)" }).promise;
        let text = "", textLines = [];
        try {
          const content = await page.getTextContent();
          text = content.items.map(item => typeof item.str === "string" ? item.str + (item.hasEOL ? "\n" : " ") : "").join("").slice(0, 500000);
          textLines = ReceiptReading.pdfLines(content.items, viewport, content.styles);
        } catch (_) { /* Image-only or unusual PDFs fall back to the local OCR. */ }
        if (destroyed) throw new Error("Import annulé");
        return { image: canvas.toDataURL("image/png"), text, textLines, page: number,
          pdf: { bytes, page: number, pages: document.numPages, width: canvas.width, height: canvas.height,
            viewport: { width: viewport.width, height: viewport.height, transform: Array.from(viewport.transform) } } };
      } finally { canvas.width = canvas.height = 0; page.cleanup(); }
    }
    return { pages: document.numPages, renderPage, destroy: function () { destroyed = true; return task.destroy(); } };
  }
  window.ReceiptPDF = { open };
})();
