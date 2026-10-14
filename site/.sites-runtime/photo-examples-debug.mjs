// .sites-runtime/photo-debug.ts
function cleanPhoto(data, contrast = 14) {
  const { width: w, height: h } = data, gray = new Float32Array(w * h), sum = new Float64Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x, p = i * 4;
    gray[i] = data.data[p] * 0.299 + data.data[p + 1] * 0.587 + data.data[p + 2] * 0.114;
    sum[(y + 1) * (w + 1) + x + 1] = gray[i] + sum[y * (w + 1) + x + 1] + sum[(y + 1) * (w + 1) + x] - sum[y * (w + 1) + x];
  }
  const out = new Uint8ClampedArray(w * h * 4), radius = Math.max(8, Math.round(h / 12));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const l = Math.max(0, x - radius), r = Math.min(w, x + radius + 1), t = Math.max(0, y - radius), b = Math.min(h, y + radius + 1);
    const mean = (sum[b * (w + 1) + r] - sum[t * (w + 1) + r] - sum[b * (w + 1) + l] + sum[t * (w + 1) + l]) / ((r - l) * (b - t));
    const value = gray[y * w + x] < mean - contrast ? 0 : 255, i = (y * w + x) * 4;
    out[i] = out[i + 1] = out[i + 2] = value;
    out[i + 3] = 255;
  }
  return out;
}
function clusters(values) {
  const groups = [];
  for (const v of values) {
    const g = groups.at(-1);
    if (g && v - g.at(-1) <= 3) g.push(v);
    else groups.push([v]);
  }
  return groups.map((g) => g[Math.floor(g.length / 2)]);
}
function findPhotoGrid(image, columns, rows, header = true, numbers = true) {
  const { width: w, height: h } = image, pixels = cleanPhoto(image, 8), dark = (x, y) => pixels[(y * w + x) * 4] === 0;
  for (let i = 0; i < pixels.length; i += 4) if (image.data[i] > image.data[i + 1] + 60 && image.data[i] > image.data[i + 2] + 60) pixels[i] = pixels[i + 1] = pixels[i + 2] = 255;
  const candidates = [];
  function lineScore(y, slope) {
    let hits = 0;
    for (let x = 0; x < w; x++) {
      const yy = Math.round(y + slope * (x - w / 2));
      if (yy > 0 && yy < h - 1 && (dark(x, yy) || dark(x, yy - 1) || dark(x, yy + 1))) hits++;
    }
    return hits;
  }
  for (const slope of [0, ...Array.from({ length: 32 }, (_, i) => (i + 1) * 25e-4).flatMap((s) => [s, -s])]) {
    const horizontal = [];
    for (let y = 1; y < h - 1; y++) {
      let run = 0, best = 0, hits = 0;
      for (let x = 0; x < w; x++) {
        const yy = Math.round(y + slope * (x - w / 2)), hit = yy >= 3 && yy < h - 3 && (dark(x, yy) || dark(x, yy - 1) || dark(x, yy + 1) || dark(x, yy - 2) || dark(x, yy + 2) || dark(x, yy - 3) || dark(x, yy + 3));
        run = hit ? run + 1 : 0;
        if (hit) hits++;
        best = Math.max(best, run);
      }
      if (best > w * 0.55 || hits > w * 0.7) horizontal.push(y);
    }
    for (const y of clusters(horizontal)) {
      let best = y, score = 0;
      for (let yy = Math.max(1, y - 4); yy <= Math.min(h - 2, y + 4); yy++) {
        const value = lineScore(yy, slope);
        if (value > score) {
          score = value;
          best = yy;
        }
      }
      candidates.push({ y: best, slope, score });
    }
  }
  const rules = [];
  for (const candidate of candidates.sort((a, b) => b.score - a.score)) if (!rules.some((rule) => Math.abs(rule.y - candidate.y) <= 10)) rules.push(candidate);
  rules.sort((a, b) => a.y - b.y);
  const gaps = rules.slice(1).map((r, i) => r.y - rules[i].y).sort((a, b) => a - b), separation = Math.min(18, (gaps[Math.floor(gaps.length / 2)] || 16) * 0.6);
  const spaced = [];
  for (const rule of [...rules].sort((a, b) => b.score - a.score)) if (!spaced.some((r) => Math.abs(r.y - rule.y) < separation)) spaced.push(rule);
  rules.splice(0, rules.length, ...spaced.sort((a, b) => a.y - b.y));
  console.log("RULES", rules.map((r) => r.y));
  const lines = rules.map((rule) => rule.y), required = rows + 1 + (header ? 1 : 0);
  let bestGrid = null, bestScore = 0;
  for (let start = 0; start + required <= lines.length; start++) {
    const selected = lines.slice(start, start + required), heights = selected.slice(1).map((v, i) => v - selected[i]);
    if (Math.min(...heights) < 4 || Math.max(...heights) > Math.min(...heights) * 2.5) continue;
    const lessonHeights = header ? heights.slice(1) : heights, median = [...lessonHeights].sort((a, b) => a - b)[Math.floor(lessonHeights.length / 2)];
    if (lessonHeights.some((height) => height < median * 0.8 || height > median * 1.25)) continue;
    const top = selected[0], bottom = selected.at(-1), middle = (top + bottom) / 2, vertical = [];
    for (let x = 1; x < w - 1; x++) {
      let best = { x, slope: 0, score: 0 };
      for (let tilt = -0.12; tilt <= 0.1201; tilt += 5e-3) {
        let hits = 0, count = 0;
        for (let y = Math.ceil(top - 50); y < bottom + 50; y += 2) {
          const xx = Math.round(x + tilt * (y - middle));
          if (y < top + rules[start].slope * (xx - w / 2) + 8 || y > bottom + rules[start + required - 1].slope * (xx - w / 2) - 8 || y < 1 || y >= h - 1) continue;
          count++;
          if (xx > 1 && xx < w - 2 && (dark(xx, y) || dark(xx - 1, y) || dark(xx + 1, y))) hits++;
        }
        const score2 = hits / count;
        if (score2 > best.score) best = { x, slope: tilt, score: score2 };
      }
      if (best.score > 0.8) vertical.push(best);
    }
    const strongest = rules.slice(start, start + required).reduce((a, b) => a.score > b.score ? a : b), runs = [];
    for (let x = 0; x < w; x++) {
      const y = Math.round(strongest.y + strongest.slope * (x - w / 2));
      if (y < 1 || y >= h - 1 || !(dark(x, y) || dark(x, y - 1) || dark(x, y + 1))) continue;
      const run = runs.at(-1);
      if (run && x - run.at(-1) <= 10) run.push(x);
      else runs.push([x]);
    }
    const span = runs.sort((a, b) => b.length - a.length)[0];
    if (!span) continue;
    const edges = [];
    for (const v of vertical.sort((a, b) => b.score - a.score)) if (!edges.some((e) => Math.abs(e.x - v.x) < 10)) edges.push(v);
    edges.sort((a, b) => a.x - b.x);
    const kept = edges.filter((e) => e.x >= span[0] - w * 0.08 && e.x <= span.at(-1) + w * 0.08), xs = kept.map((e) => e.x), needed = columns + 1 + (numbers ? 1 : 0);
    console.log("EDGES", top, bottom, xs, edges);
    if (xs.length !== needed) continue;
    const lessonWidths = xs.slice(numbers ? 2 : 1).map((x, i) => x - xs[i + (numbers ? 1 : 0)]);
    if (Math.min(...lessonWidths) < 20 || Math.max(...lessonWidths) > Math.min(...lessonWidths) * 2) continue;
    const selectedRules = rules.slice(start, start + required), score = selectedRules.reduce((sum, rule) => sum + rule.score, 0), lessonRules = header ? selectedRules.slice(1) : selectedRules;
    if (score > bestScore) {
      bestScore = score;
      bestGrid = { xs: (numbers ? xs.slice(1) : xs).map((x) => x / w * 100), ys: lessonRules.map((rule) => rule.y / h * 100), slope: lessonRules.reduce((sum, rule) => sum + rule.slope, 0) / lessonRules.length, rowSlopes: lessonRules.map((rule) => rule.slope), columnSlopes: (numbers ? kept.slice(1) : kept).map((e) => e.slope), columnCenter: middle / h * 100 };
    }
  }
  return bestGrid;
}
function weightedEdges(start, end, weights) {
  const total = weights.reduce((a, b) => a + b, 0), edges = [start];
  for (const weight of weights) edges.push(edges.at(-1) + (end - start) * weight / total);
  return edges;
}
function extractPhotoCell(image, grid, column, row) {
  const { width: w, height: h } = image;
  function corner(c, r) {
    const a = grid.rowSlopes[r] || 0, b = grid.columnSlopes[c] || 0, x0 = grid.xs[c] * w / 100, y0 = grid.ys[r] * h / 100, yc = grid.columnCenter * h / 100;
    const y = (y0 + a * (x0 - b * yc - w / 2)) / (1 - a * b);
    return { x: x0 + b * (y - yc), y };
  }
  const tl = corner(column, row), tr = corner(column + 1, row), bl = corner(column, row + 1), br = corner(column + 1, row + 1);
  const cellW = (tr.x - tl.x + br.x - bl.x) / 2, cellH = (bl.y - tl.y + br.y - tr.y) / 2;
  if (cellW < 10 || cellH < 8) throw new Error("\u041A\u043E\u043C\u0456\u0440\u043A\u0438 \u043D\u0430\u0434\u0442\u043E \u043C\u0430\u043B\u0456. \u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043C\u0435\u0436\u0456 \u0442\u0430\u0431\u043B\u0438\u0446\u0456.");
  const scale = Math.min(5, Math.max(2, 48 / cellH)), padding = 12, width = Math.round(cellW * scale) + padding * 2, height = Math.round(cellH * scale) + padding * 2, data = new Uint8ClampedArray(width * height * 4).fill(255);
  const inset = 2;
  for (let y = padding; y < height - padding; y++) for (let x = padding; x < width - padding; x++) {
    const u = (x - padding) / (width - padding * 2 - 1), v = (y - padding) / (height - padding * 2 - 1), uu = (inset + u * (cellW - 2 * inset)) / cellW, vv = (inset + v * (cellH - 2 * inset)) / cellH;
    const sx = (1 - vv) * (tl.x + (tr.x - tl.x) * uu) + vv * (bl.x + (br.x - bl.x) * uu), sy = (1 - vv) * (tl.y + (tr.y - tl.y) * uu) + vv * (bl.y + (br.y - bl.y) * uu), ix = Math.round(sx), iy = Math.round(sy);
    if (ix < 0 || iy < 0 || ix >= w || iy >= h) continue;
    const src = (iy * w + ix) * 4, dst = (y * width + x) * 4;
    for (let k = 0; k < 3; k++) data[dst + k] = image.data[src + k];
  }
  return { width, height, data };
}
function removeCellLines(image) {
  const { width: w, height: h, data } = image, rows = [], cols = [];
  for (let y = 0; y < h; y++) {
    let hits = 0;
    for (let x = 0; x < w; x++) if (data[(y * w + x) * 4] === 0) hits++;
    if (hits > w * 0.55) rows.push(y);
  }
  for (let x = 0; x < w; x++) {
    let hits = 0;
    for (let y = 0; y < h; y++) if (data[(y * w + x) * 4] === 0) hits++;
    if (hits > h * 0.65) cols.push(x);
  }
  for (const y of rows) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    data[i] = data[i + 1] = data[i + 2] = 255;
  }
  for (const x of cols) for (let y = 0; y < h; y++) {
    const i = (y * w + x) * 4;
    data[i] = data[i + 1] = data[i + 2] = 255;
  }
}
function preparePhotoCell(image) {
  const { width: w, height: h } = image, pixels = cleanPhoto(image), seen = new Uint8Array(w * h), boxes = [];
  removeCellLines({ width: w, height: h, data: pixels });
  const stack = [];
  for (let p = 0; p < w * h; p++) {
    if (seen[p] || pixels[p * 4] !== 0) continue;
    seen[p] = 1;
    stack.push(p);
    let left = w, right = 0, top = h, bottom = 0, area = 0;
    while (stack.length) {
      const i = stack.pop(), x = i % w, y = Math.floor(i / w);
      area++;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy, n = yy * w + xx;
        if (xx >= 0 && xx < w && yy >= 0 && yy < h && !seen[n] && pixels[n * 4] === 0) {
          seen[n] = 1;
          stack.push(n);
        }
      }
    }
    const bh = bottom - top + 1, bw = right - left + 1;
    if (area >= 8 && bh >= h * 0.18 && bh < h * 0.85 && bw < Math.max(h * 2, w * 0.7) && bw >= bh * 0.05 && left > 1 && right < w - 2) boxes.push({ left, right, top, bottom });
  }
  const bins = /* @__PURE__ */ new Map();
  for (const box of boxes) {
    const key = Math.round((box.top + box.bottom) / 2 / (h * 0.15));
    bins.set(key, [...bins.get(key) || [], box]);
  }
  let textBoxes = [];
  for (const [key] of bins) {
    const nearby = boxes.filter((b2) => Math.abs((b2.top + b2.bottom) / 2 - key * h * 0.15) < h * 0.2);
    if (nearby.length > textBoxes.length) textBoxes = nearby;
  }
  if (textBoxes.length < 2) {
    pixels.fill(255);
    return { pixels, blank: true };
  }
  const l = Math.max(0, Math.min(...textBoxes.map((b2) => b2.left)) - 5), r = Math.min(w - 1, Math.max(...textBoxes.map((b2) => b2.right)) + 5), t = Math.max(0, Math.min(...textBoxes.map((b2) => b2.top)) - 6), b = Math.min(h - 1, Math.max(...textBoxes.map((b2) => b2.bottom)) + 6);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (x < l || x > r || y < t || y > b) {
    const i = (y * w + x) * 4;
    pixels[i] = pixels[i + 1] = pixels[i + 2] = 255;
  }
  return { pixels, blank: false };
}

// lib/photo-recognition.ts
var aliases = [
  [/^навч.*грам/, "\u041D\u0430\u0432\u0447\u0430\u043D\u043D\u044F \u0433\u0440\u0430\u043C\u043E\u0442\u0438"],
  [/^[яаa]дос/, "\u042F \u0434\u043E\u0441\u043B\u0456\u0434\u0436\u0443\u044E \u0441\u0432\u0456\u0442"],
  [/^(лі[тгд].*чит|чит)/, "\u041B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u043D\u0435 \u0447\u0438\u0442\u0430\u043D\u043D\u044F"],
  [/^диз/, "\u0414\u0438\u0437\u0430\u0439\u043D \u0456 \u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0456\u0457"],
  [/^хоре/, "\u0425\u043E\u0440\u0435\u043E\u0433\u0440\u0430\u0444\u0456\u044F"],
  [/^психол/, "\u041F\u0441\u0438\u0445\u043E\u043B\u043E\u0433\u0456\u0447\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430"],
  [/^бюл/, "\u0411\u0456\u043E\u043B\u043E\u0433\u0456\u044F"],
  [/^інформ/, "\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430"],
  [/^укр.*мов/, "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430"],
  [/^укр.*літ/, "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430"],
  [/^зар/, "\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430"],
  [/^піз/, "\u041F\u0456\u0437\u043D\u0430\u0454\u043C\u043E \u043F\u0440\u0438\u0440\u043E\u0434\u0443"],
  [/^анг/, "\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430"],
  [/^(фіз.*кул|фізк)/, "\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430"],
  [/^фіз/, "\u0424\u0456\u0437\u0438\u043A\u0430"],
  [/^мат/, "\u041C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0430"],
  [/^алг/, "\u0410\u043B\u0433\u0435\u0431\u0440\u0430"],
  [/^геометр/, "\u0413\u0435\u043E\u043C\u0435\u0442\u0440\u0456\u044F"],
  [/^географ/, "\u0413\u0435\u043E\u0433\u0440\u0430\u0444\u0456\u044F"],
  [/^хім/, "\u0425\u0456\u043C\u0456\u044F"],
  [/^біол/, "\u0411\u0456\u043E\u043B\u043E\u0433\u0456\u044F"],
  [/^мист/, "\u041C\u0438\u0441\u0442\u0435\u0446\u0442\u0432\u043E"],
  [/^всес/, "\u0412\u0441\u0435\u0441\u0432\u0456\u0442\u043D\u044F \u0456\u0441\u0442\u043E\u0440\u0456\u044F"],
  [/^іст.*укр/, "\u0406\u0441\u0442\u043E\u0440\u0456\u044F \u0423\u043A\u0440\u0430\u0457\u043D\u0438"],
  [/^іст/, "\u0406\u0441\u0442\u043E\u0440\u0456\u044F"],
  [/^зд[оа]р/, "\u0417\u0434\u043E\u0440\u043E\u0432\u2019\u044F, \u0431\u0435\u0437\u043F\u0435\u043A\u0430 \u0442\u0430 \u0434\u043E\u0431\u0440\u043E\u0431\u0443\u0442"],
  [/^під/, "\u041F\u0456\u0434\u043F\u0440\u0438\u0454\u043C\u043D\u0438\u0446\u0442\u0432\u043E \u0456 \u0444\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u0430 \u0433\u0440\u0430\u043C\u043E\u0442\u043D\u0456\u0441\u0442\u044C"],
  [/^вих/, "\u0412\u0438\u0445\u043E\u0432\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430"],
  [/^(stem|стем|sтем)/i, "STEM"],
  [/^техн/, "\u0422\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0456\u0457"],
  [/^робот/, "\u0420\u043E\u0431\u043E\u0442\u043E\u0442\u0435\u0445\u043D\u0456\u043A\u0430"],
  [/^гром/, "\u0413\u0440\u043E\u043C\u0430\u0434\u044F\u043D\u0441\u044C\u043A\u0430 \u043E\u0441\u0432\u0456\u0442\u0430"],
  [/^етик/, "\u0415\u0442\u0438\u043A\u0430"],
  [/^проф/, "\u041F\u0440\u043E\u0444\u0435\u0441\u0456\u0457"],
  [/^прав/, "\u041F\u0440\u0430\u0432\u043E\u0437\u043D\u0430\u0432\u0441\u0442\u0432\u043E"]
];
function parsePhotoCell(raw) {
  let text = raw.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim().replace(/^[|\[\]{}(«!™"“”]+|[|\[\]{}]+$/g, "").trim();
  if (!text || /^[-_—\s.]+$/.test(text)) return { lesson: null, known: false };
  const note = /\(\s*заміна\s*\)/i.test(text) ? "\u0417\u0430\u043C\u0456\u043D\u0430" : "";
  text = text.replace(/\(\s*заміна\s*\)/ig, "").trim();
  const g = text.match(/\(\s*((?:[IІіil1їЇTТ][IІіil1їЇTТ!]?|2))\s*\)/);
  let group = "";
  if (g) {
    group = g[1].length === 2 || g[1] === "2" ? "II" : "I";
    text = text.replace(g[0], "").trim();
  } else if (/(?:^|\s)(?:[вb][сc][іiї]|усі)(?:\s|$)/i.test(text)) {
    group = "\u0423\u0441\u0456";
    text = text.replace(/(?:[вb][сc][іiї]|усі)/ig, "").trim();
  }
  text = text.replace(/^(STEM)([МM])$/i, "STEM $2");
  const match = text.match(/(?:^|\s)([ТT][ПP]\s*\/\s*[БB]|[ІIЇ][СCT][ТT]|[ІIЇ][НH]|[КK][БB]|[УY][МM]|[АA][МM]|[СC][З3]|[ТT][ПPІI]|[ОO][ПP]|[АA][З3]|[БB]|[ГrR]|[МM])\s*[.,:;|_—\-]*$/i);
  const room = (match?.[1] || "").toUpperCase().replace(/\s/g, "").replace(/[IЇ]/g, "\u0406").replace(/C/g, "\u0421").replace(/T/g, "\u0422").replace(/H/g, "\u041D").replace(/K/g, "\u041A").replace(/B/g, "\u0411").replace(/Y/g, "\u0423").replace(/M/g, "\u041C").replace(/A/g, "\u0410").replace(/P/g, "\u041F").replace(/O/g, "\u041E").replace(/3/g, "\u0417").replace(/R/g, "\u0413").replace(/^ТІ$/, "\u0422\u041F");
  if (match) text = text.slice(0, match.index).trim();
  const key = text.toLocaleLowerCase("uk").replace(/[^а-яєіїґa-z0-9]/gi, "").replace(/[iї]/g, "\u0456").replace(/^bux/, "\u0432\u0438\u0445").replace(/^ффіз/, "\u0444\u0456\u0437");
  const subject = aliases.find(([re]) => re.test(key))?.[1] || closestSubject(key);
  return { lesson: { subject: subject || text, room, ...group ? { group } : {}, ...note ? { note } : {} }, known: !!subject };
}
function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const old = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = old;
    }
  }
  return row[b.length];
}
function closestSubject(key) {
  if (key.length < 5) return;
  const variants = [...new Set(aliases.map(([, subject]) => subject))].map((subject) => ({ subject, key: subject.toLocaleLowerCase("uk").replace(/[^а-яєіїґa-z0-9]/gi, "").replace(/ї/g, "\u0456") }));
  const ranked = variants.map((v) => ({ ...v, score: 1 - distance(key, v.key) / Math.max(key.length, v.key.length) })).sort((a, b) => b.score - a.score);
  if (ranked[0].score >= 0.8 && ranked[0].score - ranked[1].score >= 0.12) return ranked[0].subject;
}
export {
  cleanPhoto,
  extractPhotoCell,
  findPhotoGrid,
  parsePhotoCell,
  preparePhotoCell,
  removeCellLines,
  weightedEdges
};
