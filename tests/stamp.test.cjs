const { test } = require("node:test");
const assert = require("node:assert/strict");
const { layout, clampPosition, composite, create } = require("../stamp-renderer.js");
const base = { address: "Orange SA\nAdresse longue\nDijon", date: "08/10/2026", shape: "rect", scale: 1, rotation: 0 };
test("même géométrie en aperçu et en export, y compris rotation et cercle", () => {
  for (const shape of ["rect", "circle"]) for (const rotation of [0, 45, 90, -180]) {
    const settings = { ...base, shape, rotation };
    const exportG = layout(settings, 2400, 3600), previewG = layout(settings, 320, 480);
    assert.ok(Math.abs(exportG.boundWidth / 7.5 - previewG.boundWidth) < 1e-8);
    assert.ok(Math.abs(exportG.boundHeight / 7.5 - previewG.boundHeight) < 1e-8);
    const pos = clampPosition({ x: 99, y: 1 }, exportG, 2400, 3600);
    assert.ok(pos.x / 100 * 2400 + exportG.boundWidth / 2 <= 2400.00001);
    assert.ok(pos.y / 100 * 3600 - exportG.boundHeight / 2 >= -0.00001);
  }
});
test("un tampon très grand tient entièrement dans une image horizontale", () => {
  const g = layout({ ...base, scale: 2.5, rotation: 60, address: "a\n".repeat(16) }, 1200, 300);
  assert.ok(g.boundWidth <= 1200 && g.boundHeight <= 300);
});
test("composite ne fait subir la rotation qu’une seule fois", () => {
  const rotations = [], draws = [];
  const g = layout({ ...base, rotation: 45 }, 1000, 1500);
  composite({ save() {}, restore() {}, translate() {}, rotate: a => rotations.push(a), drawImage: (...args) => draws.push(args) }, {}, g, { x: 50, y: 60 }, 1000, 1500);
  assert.deepEqual(rotations, [Math.PI / 4]);
  assert.equal(draws.length, 1);
});
test("l’usure est déterministe et le rectangle transparent reste sans bordure", () => {
  const runs = [];
  function canvas() {
    const events = [], pixels = new Uint8ClampedArray(80).fill(200);
    const context = { beginPath() { events.push("path"); }, fill() { events.push("fill"); }, stroke() { events.push("stroke"); },
      measureText: value => ({ width: value.length * 20 }), fillText: (...args) => events.push(args),
      getImageData: () => ({ data: pixels }), putImageData: () => events.push(Array.from(pixels)) };
    runs.push(events);
    return { width: 0, height: 0, getContext: () => context };
  }
  const settings = { ...base, noBg: true, vintage: true, bold: true };
  const font = { f: "Arial", w: 700, w2: 600 }, color = { bg: "orange", bd: "black", tx: "black" };
  create(settings, font, color, 123, canvas);
  create(settings, font, color, 123, canvas);
  assert.deepEqual(runs[0], runs[1]);
  assert.ok(!runs[0].includes("stroke") && !runs[0].includes("fill"));
});

test('un tampon rond transparent a un contour visible, sans disque opaque', () => {
  const { createCanvas } = require('@napi-rs/canvas');
  const font = { f: 'Arial', w: 700, w2: 600 }, color = { bg: '#ff8800', bd: '#ff8800', tx: '#111111' };
  const settings = { ...base, address: '', date: '', shape: 'circle', noBg: true, textColor: '#123456' };
  const stamp = create(settings, font, color, 123, () => createCanvas(1, 1)), ctx = stamp.getContext('2d');
  assert.equal(stamp.width, stamp.height);
  for (const [x, y] of [[400, 7], [793, 400], [400, 793], [7, 400]]) {
    const pixel = Array.from(ctx.getImageData(x, y, 1, 1).data);
    assert.deepEqual(pixel, [18, 52, 86, 255], 'le contour suit la couleur du texte');
  }
  for (const [x, y] of [[400, 400], [0, 0], [799, 799]]) assert.equal(ctx.getImageData(x, y, 1, 1).data[3], 0, 'papier apparent');
  const filled = create({ ...settings, noBg: false }, font, color, 123, () => createCanvas(1, 1));
  assert.equal(filled.getContext('2d').getImageData(400, 400, 1, 1).data[3], 255);
});

test('une adresse longue et la date tiennent dans un vrai cercle, avec ou sans texte en arc', () => {
  const { createCanvas } = require('@napi-rs/canvas');
  for (const arcText of [false, true]) {
    const settings = { ...base, shape: 'circle', address: 'ENTREPRISE\n' + 'Adresse et mentions complémentaires\n'.repeat(14), arcText, noBg: true, bold: true, textColor: '#111111' };
    const stamp = create(settings, { f: 'Arial', w: 700, w2: 600 }, { bg: '#fff', bd: '#111', tx: '#111' }, 123, () => createCanvas(1, 1));
    const geometry = layout(settings, 1000, 1500);
    assert.equal(stamp.width, 800); assert.equal(stamp.height, 800); assert.equal(geometry.width, geometry.height);
    const pixels = stamp.getContext('2d').getImageData(0, 0, 800, 800).data;
    let textPixels = 0;
    for (let y = 0; y < 800; y++) for (let x = 0; x < 800; x++) {
      if (!pixels[(y * 800 + x) * 4 + 3]) continue;
      assert.ok(Math.hypot(x - 400, y - 400) <= 399, 'aucun texte ne sort du cercle');
      if (Math.hypot(x - 400, y - 400) < 350) textPixels++;
    }
    assert.ok(textPixels > 1000, 'le contenu reste présent');
  }
});
