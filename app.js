/* Rendering: scoreboard, win-probability widget, charts, tables, forecast log. Data comes from data.js. */
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const el = (n, a, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
  const f1 = (v, d = 1) => v.toFixed(d);
  const short = t => t.split(" ").slice(0, -1).join(" ").replace("Portland Trail", "Portland");
  function tip(box) { const t = document.createElement("div"); t.className = "tip"; t.hidden = true; box.appendChild(t); return t; }
  function hover(mark, t, svg, x, y, html) {
    const show = () => { const s = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
      t.innerHTML = html; t.hidden = false; t.style.left = x * s + "px"; t.style.top = y * s + "px"; };
    mark.addEventListener("mouseenter", show); mark.addEventListener("focus", show);
    mark.addEventListener("mouseleave", () => t.hidden = true); mark.addEventListener("blur", () => t.hidden = true);
    mark.setAttribute("tabindex", "0");
  }
  const C = { a: "var(--accent)", b: "var(--ball)", line: "var(--line)", muted: "var(--muted)", surf: "var(--surface)" };
  const cur = SNAPSHOTS[SNAPSHOTS.length - 1];

  // ---- scoreboard ----
  document.getElementById("hero-eyebrow").textContent = `2026-27 season · forecast as of ${cur.label}`;
  document.getElementById("board-title").textContent = `Title probability · ${cur.played} of 1,230 games played`;
  document.getElementById("board").innerHTML = cur.teams.slice(0, 4).map(t =>
    `<div><div class="board-team">${short(t[0])}</div><div class="board-p">${Math.round(t[2])}%</div><div class="board-sub">Finals ${Math.round(t[5])}%</div></div>`).join("");
  const next = PLANNED.find(p => !p.done);
  document.getElementById("board-foot").textContent = next ? `Next update: ${next.label}.` : "Last update of the season.";
  document.getElementById("fc-intro").textContent =
    `Forecast as of ${cur.label}, after ${cur.played} of 1,230 games. The twelve most likely champions:`;

  // ---- widget: win probability ----
  const erf = x => { const s = Math.sign(x), z = Math.abs(x), t = 1 / (1 + 0.3275911 * z);
    return s * (1 - t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429)))) * Math.exp(-z * z)); };
  const Phi = x => 0.5 * (1 + erf(x / Math.SQRT2));
  const series = p => { let s = 0; const C7 = [1, 7, 21, 35, 35, 21, 7, 1]; for (let k = 4; k <= 7; k++) s += C7[k] * p ** k * (1 - p) ** (7 - k); return s; };
  const gap = document.getElementById("gap");
  const upd = () => { const g = +gap.value, p = Phi(g / 14);
    document.getElementById("gap-v").textContent = "+" + f1(g);
    document.getElementById("p1").textContent = Math.round(100 * p) + "%";
    document.getElementById("p2").textContent = Math.round(100 * Phi((g + 1.9) / 14)) + "%";
    document.getElementById("p7").textContent = Math.round(100 * series(p)) + "%"; };
  gap.addEventListener("input", upd); upd();

  // ---- sigma by season ----
  {
    const d = SIGMA, box = document.getElementById("sig"), W = 540, H = 210, L = 40, R = 24, T = 18, B = 30;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Game-to-game noise by season, from 11.4 to 14 points" }, box);
    const t = tip(box);
    const x = s => L + (s - 2012) / 15 * (W - L - R), y = v => T + (14.5 - v) / 3.5 * (H - T - B);
    for (const v of [11, 12, 13, 14]) {
      el("line", { x1: L, x2: W - R, y1: y(v), y2: y(v), stroke: C.line }, svg);
      el("text", { x: L - 8, y: y(v) + 4, "text-anchor": "end" }, svg).textContent = v;
    }
    for (const s of [2012, 2015, 2018, 2021, 2024, 2027]) el("text", { x: x(s), y: H - 8, "text-anchor": "middle" }, svg).textContent = s;
    el("polyline", { points: d.map(([s, v]) => `${x(s)},${y(v)}`).join(" "), fill: "none", stroke: C.a, "stroke-width": 2 }, svg);
    const last = d[d.length - 1][0];
    for (const [s, v] of d) {
      el("circle", { cx: x(s), cy: y(v), r: s === last ? 5 : 3, fill: C.a, stroke: C.surf, "stroke-width": s === last ? 2 : 0 }, svg);
      hover(el("circle", { cx: x(s), cy: y(v), r: 12, fill: "transparent" }, svg), t, svg, x(s), y(v), `${s - 1}-${String(s).slice(2)}: σ = ${f1(v)} pts`);
    }
    el("text", { x: x(last) - 8, y: y(d[d.length - 1][1]) - 10, class: "lab", "text-anchor": "end" }, svg).textContent = f1(d[d.length - 1][1]) + " pts";
  }

  // ---- eleven champions ----
  {
    const box = document.getElementById("champs"), W = 540, H = 250, L = 40, R = 16, T = 14, B = 36;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Probability given to the eventual champion on February 1, 2016 to 2026" }, box);
    const t = tip(box);
    const n = CHAMPS.length, x = i => L + (i + 0.5) / n * (W - L - R), y = v => T + (70 - v) / 70 * (H - T - B);
    for (const v of [0, 20, 40, 60]) {
      el("line", { x1: L, x2: W - R, y1: y(v), y2: y(v), stroke: C.line }, svg);
      el("text", { x: L - 8, y: y(v) + 4, "text-anchor": "end" }, svg).textContent = v + "%";
    }
    el("line", { x1: L, x2: W - R, y1: y(3.3), y2: y(3.3), stroke: C.b, "stroke-dasharray": "4 4" }, svg);
    el("text", { x: W - R, y: y(3.3) - 6, "text-anchor": "end", style: "fill:var(--ball)" }, svg).textContent = "random pick 3.3%";
    CHAMPS.forEach(([s, c, p, rk, fav, pf], i) => {
      el("text", { x: x(i), y: H - 16, "text-anchor": "middle" }, svg).textContent = "'" + s.slice(-2);
      if (rk > 1) {
        el("line", { x1: x(i), x2: x(i), y1: y(pf), y2: y(p), stroke: C.line, "stroke-width": 2 }, svg);
        el("circle", { cx: x(i), cy: y(pf), r: 4.5, fill: C.muted }, svg);
      }
      el("circle", { cx: x(i), cy: y(p), r: 6, fill: C.a, stroke: C.surf, "stroke-width": 2 }, svg);
      const hit = el("rect", { x: x(i) - (W - L - R) / n / 2, y: T, width: (W - L - R) / n, height: H - T - B, fill: "transparent" }, svg);
      hover(hit, t, svg, x(i), y(Math.max(p, rk > 1 ? pf : 0)) - 4,
        `${s} · champion: ${c}<br>${f1(p)}% (rank ${rk})` + (rk > 1 ? `<br>favorite: ${fav} ${pf}%` : "<br>it was the favorite"));
    });
    document.querySelector("#champ-table tbody").innerHTML = CHAMPS.map(([s, c, p, rk, fav, pf]) =>
      `<tr${rk === 1 ? ' class="hl"' : ""}><td>${s}</td><td class="l">${c}</td><td class="n">${f1(p)}%</td>` +
      `<td><span class="rk ${rk === 1 ? "rk1" : rk <= 3 ? "rk3" : "rkx"}">${rk}</span></td>` +
      `<td class="l">${rk === 1 ? "—" : `${fav} (${pf}%)`}</td></tr>`).join("");
  }

  // ---- forecast ----
  {
    const d = cur.teams, box = document.getElementById("title"), W = 540, rowH = 30, T = 8, B = 30, L = 150, R = 24, H = T + B + rowH * d.length;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Title probability by team" }, box);
    const t = tip(box);
    const mx = Math.max(55, 5 * Math.ceil(Math.max(...d.map(r => r[4])) / 5));
    const x = v => L + v / mx * (W - L - R);
    for (let v = 0; v <= mx; v += 10) {
      el("line", { x1: x(v), x2: x(v), y1: T, y2: H - B, stroke: C.line }, svg);
      el("text", { x: x(v), y: H - 10, "text-anchor": "middle" }, svg).textContent = v + "%";
    }
    d.forEach(([team, conf, p, lo, hi, fin, f], i) => {
      const cy = T + rowH * i + rowH / 2;
      el("text", { x: L - 12, y: cy + 4, "text-anchor": "end", class: "lab" }, svg).textContent = `${short(team)} (${conf === "E" ? "East" : "West"})`;
      el("line", { x1: x(lo), x2: x(hi), y1: cy, y2: cy, stroke: C.a, "stroke-width": 2, "stroke-linecap": "round", opacity: .45 }, svg);
      el("circle", { cx: x(p), cy, r: 6, fill: C.a, stroke: C.surf, "stroke-width": 2 }, svg);
      const hit = el("rect", { x: 0, y: cy - rowH / 2, width: W - R, height: rowH, fill: "transparent" }, svg);
      hover(hit, t, svg, x(p), cy - 6, `${team}<br>title ${f1(p)}% (10-90%: ${f1(lo)}-${f1(hi)})<br>Finals ${f1(fin)}% · strength ${f}`);
    });
  }

  // ---- forecast log ----
  document.getElementById("log").innerHTML = PLANNED.map(p =>
    `<li><span class="dot${p.done ? " done" : ""}"></span><div><div class="when">${p.label}${p.done ? "" : " · upcoming"}</div><div class="what">${p.what}</div></div></li>`).join("");

  // ---- evolution chart (from the 2nd update on) ----
  if (SNAPSHOTS.length >= 2) {
    document.getElementById("evo-fig").hidden = false;
    const box = document.getElementById("evo"), W = 540, H = 260, L = 40, R = 130, T = 14, B = 30;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Title probability over successive updates" }, box);
    const top = cur.teams.slice(0, 5).map(r => r[0]);
    const val = (s, team) => (s.teams.find(r => r[0] === team) || [0, 0, 0])[2];
    const mx = Math.max(10, ...SNAPSHOTS.flatMap(s => top.map(tm => val(s, tm))));
    const x = i => L + i / (SNAPSHOTS.length - 1) * (W - L - R), y = v => T + (1 - v / mx) * (H - T - B);
    for (const v of [0, mx / 2, mx]) {
      el("line", { x1: L, x2: W - R, y1: y(v), y2: y(v), stroke: C.line }, svg);
      el("text", { x: L - 8, y: y(v) + 4, "text-anchor": "end" }, svg).textContent = Math.round(v) + "%";
    }
    SNAPSHOTS.forEach((s, i) => el("text", { x: x(i), y: H - 8, "text-anchor": "middle" }, svg).textContent = s.date.slice(5).replace("-", "/"));
    const cols = [C.a, C.b, "var(--good)", "var(--fg)", C.muted];
    top.forEach((tm, k) => {
      el("polyline", { points: SNAPSHOTS.map((s, i) => `${x(i)},${y(val(s, tm))}`).join(" "), fill: "none", stroke: cols[k], "stroke-width": 2 }, svg);
      SNAPSHOTS.forEach((s, i) => el("circle", { cx: x(i), cy: y(val(s, tm)), r: 3.5, fill: cols[k] }, svg));
      el("text", { x: x(SNAPSHOTS.length - 1) + 10, y: y(val(cur, tm)) + 4, class: "lab" }, svg).textContent = short(tm);
    });
  }
})();
