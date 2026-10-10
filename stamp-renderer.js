(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.StampRenderer = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  function random(seed) {
    let value = seed >>> 0;
    return () => { value = (Math.imul(value, 1664525) + 1013904223) >>> 0; return value / 4294967296; };
  }
  function layout(settings, width, height) {
    const count = Math.max(1, settings.address.split("\n").filter(Boolean).length + (settings.date ? 1 : 0));
    const w = 800, lineHeight = 65, pad = 52;
    const h = settings.shape === "circle" ? w : count * lineHeight + pad * 2;
    const angle = (Number(settings.rotation) || 0) * Math.PI / 180;
    const cos = Math.abs(Math.cos(angle)), sin = Math.abs(Math.sin(angle));
    let factor = width * .4 * settings.scale / w;
    factor = Math.min(factor, width * .96 / (w * cos + h * sin), height * .96 / (w * sin + h * cos));
    return { width: w, height: h, lineHeight, pad, factor, angle,
      boundWidth: (w * cos + h * sin) * factor, boundHeight: (w * sin + h * cos) * factor };
  }
  function clampPosition(position, geometry, width, height) {
    const x = geometry.boundWidth / width * 50, y = geometry.boundHeight / height * 50;
    return { x: Math.max(x, Math.min(100 - x, position.x)), y: Math.max(y, Math.min(100 - y, position.y)) };
  }
  function create(settings, font, color, seed, makeCanvas = () => document.createElement("canvas")) {
    const lines = settings.address.split("\n").filter(Boolean);
    if (settings.date) lines.push(settings.date);
    const g = layout(settings, 2000, 3000), canvas = makeCanvas();
    canvas.width = g.width; canvas.height = g.height;
    const ctx = canvas.getContext("2d"), rnd = random(seed);
    ctx.strokeStyle = color.bd; ctx.fillStyle = color.bg; ctx.lineWidth = 9;
    if (!settings.noBg || settings.shape === "circle") {
      ctx.beginPath();
      if (settings.shape === "circle") ctx.ellipse(g.width / 2, g.height / 2, g.width / 2 - 7, g.height / 2 - 7, 0, 0, Math.PI * 2);
      else ctx.roundRect(7, 7, g.width - 14, g.height - 14, 25);
      // A transparent interior must not remove the selected circular shape.
      if (!settings.noBg) ctx.fill();
      else ctx.strokeStyle = settings.textColor || color.tx;
      ctx.stroke();
    }
    ctx.fillStyle = settings.textColor || color.tx;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const available = settings.shape === "circle" ? g.width * .70 : g.width - g.pad * 2;
    const fontSize = 51;
    function setFont(index, size) {
      const isDate = settings.date && index === lines.length - 1;
      const weight = isDate || !settings.bold ? 400 : index === 0 ? font.w : font.w2;
      ctx.font = weight + " " + size + "px " + font.f;
    }
    if (settings.shape === "circle" && settings.arcText && lines.length) {
      const text = Array.from(lines[0]), radius = g.width * .37;
      setFont(0, fontSize);
      const total = text.reduce((sum, char) => sum + ctx.measureText(char).width, 0);
      const size = fontSize * Math.min(1, radius * Math.PI * .85 / Math.max(total, 1));
      setFont(0, size);
      const widths = text.map(char => ctx.measureText(char).width);
      let angle = -widths.reduce((a, b) => a + b, 0) / radius / 2;
      text.forEach((char, i) => {
        const delta = widths[i] / radius;
        ctx.save(); ctx.translate(g.width / 2, g.height / 2); ctx.rotate(angle + delta / 2);
        ctx.fillText(char, 0, -radius); ctx.restore(); angle += delta;
      });
    }
    const first = settings.shape === "circle" && settings.arcText ? 1 : 0;
    const bodyCount = Math.max(1, lines.length - first);
    const circleLineHeight = Math.min(g.lineHeight, g.height * (first ? .38 : .68) / bodyCount);
    const centerY = g.height / 2 + (first ? 30 : 0);
    for (let i = first; i < lines.length; i++) {
      const isDate = settings.date && i === lines.length - 1;
      const y = settings.shape === "circle"
        ? centerY + (i - first - (bodyCount - 1) / 2) * circleLineHeight
        : g.pad + (i + .5) * g.lineHeight;
      const bodySize = settings.shape === "circle" ? Math.min(fontSize, circleLineHeight * .78) : fontSize;
      const initial = isDate ? bodySize * .8 : bodySize;
      // Fit long addresses inside the circle, rather than stretching it into an oval.
      const radius = g.width * (first ? .29 : .43);
      const distance = Math.abs(y - centerY) + initial / 2;
      const lineWidth = settings.shape === "circle"
        ? Math.min(available, 2 * Math.sqrt(Math.max(1, radius * radius - distance * distance))) : available;
      setFont(i, initial);
      const size = initial * Math.min(1, lineWidth / Math.max(1, ctx.measureText(lines[i]).width));
      setFont(i, size);
      ctx.globalAlpha = settings.vintage ? .82 + rnd() * .15 : 1;
      ctx.fillText(lines[i], g.width / 2, y);
    }
    ctx.globalAlpha = 1;
    if (settings.vintage) {
      // Wear is deterministic and affects only the stamp, never the receipt underneath.
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 3; i < pixels.data.length; i += 4) {
        if (pixels.data[i]) pixels.data[i] *= rnd() < .055 ? .18 : .78 + rnd() * .22;
      }
      ctx.putImageData(pixels, 0, 0);
    }
    return canvas;
  }
  function composite(ctx, layer, geometry, position, width, height) {
    ctx.save();
    ctx.translate(width * position.x / 100, height * position.y / 100);
    ctx.rotate(geometry.angle);
    ctx.drawImage(layer, -geometry.width * geometry.factor / 2, -geometry.height * geometry.factor / 2,
      geometry.width * geometry.factor, geometry.height * geometry.factor);
    ctx.restore();
  }
  return { layout, clampPosition, create, composite };
});
