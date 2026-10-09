/* 🔍 古籍全文检索 — 零依赖，按分组懒加载 */

const GROUPS = [];          // [{group, books, paras}]
let current = null;         // 当前分组名
const cache = {};           // group -> {books:[...]}
let timer = null;

const $ = (id) => document.getElementById(id);

function esc(s) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function snippet(text, q, pad = 18) {
  const i = text.indexOf(q);
  const start = Math.max(0, i - pad);
  const end = Math.min(text.length, i + q.length + pad * 2);
  const pre = start > 0 ? "…" : "";
  const post = end < text.length ? "…" : "";
  const seg = text.slice(start, end);
  const hi = esc(seg.slice(0, i - start)) + "<mark>" + esc(seg.slice(i - start, i - start + q.length)) + "</mark>" + esc(seg.slice(i - start + q.length));
  return pre + hi + post;
}

async function loadGroup(name) {
  if (cache[name]) return cache[name];
  const res = await fetch(`search/${encodeURIComponent(name)}.json`);
  cache[name] = await res.json();
  return cache[name];
}

function renderGroups() {
  $("searchGroups").innerHTML = GROUPS.map((g) =>
    `<button class="face-btn ${g.group === current ? "active-all" : ""}" data-g="${esc(g.group)}">${esc(g.group)} <small>${g.books}本/${g.paras}段</small></button>`
  ).join("");
  $("searchGroups").querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => selectGroup(b.dataset.g));
  });
}

async function selectGroup(name) {
  current = name;
  renderGroups();
  $("searchMeta").textContent = "加载中……";
  await loadGroup(name);
  $("searchMeta").textContent = "";
  doSearch();
}

async function doSearch() {
  const q = $("searchInput").value.trim();
  const box = $("searchResults");
  if (!current) return;
  await loadGroup(current);
  if (!q) { box.innerHTML = ""; $("searchMeta").textContent = ""; return; }

  const MAX = 200;
  const hits = [];
  let scanned = 0;
  for (const book of cache[current].books) {
    for (const p of book.paras) {
      scanned++;
      if (p.includes(q)) {
        hits.push({ title: book.title, file: book.file, text: p });
        if (hits.length >= MAX) break;
      }
    }
    if (hits.length >= MAX) break;
  }
  $("searchMeta").textContent = `「${q}」在 ${current}：命中 ${hits.length}${hits.length >= MAX ? "+" : ""} 段（扫描 ${scanned} 段）`;
  if (!hits.length) { box.innerHTML = `<div class="quote-card" style="text-align:center;color:var(--text-muted);padding:32px;">📭 未找到「${esc(q)}」</div>`; return; }
  box.innerHTML = hits.map((h) =>
    `<div class="quote-card search-hit">
       <div class="quote-meta"><span>📖 ${esc(h.title)}</span><span class="src">${esc(h.file)}</span></div>
       <div class="quote-text">${snippet(h.text, q)}</div>
     </div>`
  ).join("");
}

async function init() {
  try {
    const res = await fetch("search/index.json");
    const data = await res.json();
    GROUPS.push(...data.groups);
    current = GROUPS[0].group;
    renderGroups();
    await selectGroup(current);
  } catch (e) {
    $("searchMeta").textContent = "⚠️ 索引加载失败，请先生成 search/ 索引";
  }
  const inp = $("searchInput");
  inp.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(doSearch, 200); });
  inp.addEventListener("keydown", (e) => { if (e.key === "Enter") doSearch(); });
  $("searchBtn").addEventListener("click", doSearch);
}

document.addEventListener("DOMContentLoaded", init);
