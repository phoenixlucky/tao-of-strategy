/* 🌟 韬略之道 · App Logic — 分页重构版 */

let allQuotes = [];
let faceFilter = 'all';
let personFilter = 'all';
let tagFilter = 'all';
let currentPage = 1;
const PAGE_SIZE = 10;

/* ---- 初始化 ---- */
async function init() {
  try {
    const res = await fetch('quotes/quotes.json');
    const data = await res.json();
    allQuotes = data.quotes;
    populatePersonOptions();
    populateTagOptions();
    showDailyQuote();
    applyFilters();
    document.getElementById('loading').style.display = 'none';
  } catch (err) {
    document.getElementById('loading').textContent = '⚠️ 加载失败，请确认网络';
  }
}

/* ---- 下拉菜单 ---- */
function populatePersonOptions() {
  const people = [...new Set(allQuotes.map(q => q.personId))].sort();
  const sel = document.getElementById('personSelect');
  sel.innerHTML = '<option value="all">🧑 全部人物</option>';
  people.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p; opt.textContent = personDisplayName(p);
    sel.appendChild(opt);
  });
}

function populateTagOptions() {
  const tags = [...new Set(allQuotes.flatMap(q => q.tags || []))].sort();
  const sel = document.getElementById('tagSelect');
  sel.innerHTML = '<option value="all">🏷 全部标签</option>';
  tags.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t; opt.textContent = `#${t}`;
    sel.appendChild(opt);
  });
}

function personDisplayName(id) {
  const m = {
    sunzi:'孙子', wuzi:'吴起', sunbin:'孙膑', weiliao:'尉缭',
    caocao:'曹操', lijing:'李靖', hanxin:'韩信', simarangju:'司马穰苴',
    jiangziya:'姜子牙', yuefei:'岳飞', 'qi-jiguang':'戚继光', baiqi:'白起',
    laozi:'老子', zhuangzi:'庄子', liezi:'列子', wenzi:'文子',
    heshanggong:'河上公', guanyinzi:'关尹子', gehong:'葛洪',
    taoyuanming:'陶渊明', jikang:'嵇康',
    fanli:'范蠡', zhangliang:'张良', zhugeliang:'诸葛亮',
    liubowen:'刘伯温', wangyangming:'王阳明',
    'zeng-guofan':'曾国藩', guoziyi:'郭子仪'
  }; return m[id] || id;
}

/* ---- 每日一面 ---- */
function getDailyQuote() {
  if (!allQuotes.length) return null;
  const d = new Date();
  const s = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
  return allQuotes[Math.abs(h) % allQuotes.length];
}

function showDailyQuote() {
  const q = getDailyQuote();
  if (!q) return;
  const el = document.getElementById('dailyQuote');
  if (el) el.innerHTML = buildCard(q, true);
}

/* ---- 筛选 ---- */
function getFiltered() {
  let r = [...allQuotes];
  if (faceFilter !== 'all') r = r.filter(q => q.face === faceFilter);
  if (personFilter !== 'all') r = r.filter(q => q.personId === personFilter);
  if (tagFilter !== 'all') r = r.filter(q => (q.tags || []).includes(tagFilter));
  return r;
}

/* ---- 分页 ---- */
function getPageItems(filtered) {
  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, total);
  return { items: filtered.slice(start, end), total, totalPages, start, end };
}

function renderPagination(total, totalPages) {
  const container = document.getElementById('pagination');
  if (total <= PAGE_SIZE) { container.innerHTML = ''; return; }
  let html = '';
  html += `<button class="page-btn" onclick="goPage(${currentPage-1})" ${currentPage<=1?'disabled':''}>‹</button>`;
  html += `<span class="page-info">${currentPage}/${totalPages}</span>`;
  html += `<button class="page-btn" onclick="goPage(${currentPage+1})" ${currentPage>=totalPages?'disabled':''}>›</button>`;
  container.innerHTML = html;
}

function goPage(page) {
  currentPage = page;
  applyFilters();
  window.scrollTo({ top: document.getElementById('quoteList').offsetTop - 80, behavior: 'smooth' });
}

/* ---- 卡片构建 ---- */
function buildCard(q, isDaily) {
  const fc = q.face === 'jin' ? 'jin' : q.face === 'bi' ? 'bi' : 'zhuan';
  const fl = { jin:'进取·兵家', bi:'避世·道家', zhuan:'转化·融合' }[fc] || '';
  const pn = personDisplayName(q.personId);
  const pl = `people/${fc==='jin'?'bingjia':fc==='bi'?'daojia':'crossover'}/${q.personId}.html`;
  const interp = q.interp || '';
  const trans = q.translation || '';
  return `<div class="quote-card ${isDaily?'daily-card':''}">
    <div class="card-top"><span class="face-badge badge-${fc}">${fl}</span>${isDaily?'<span class="daily-badge">📅 今日</span>':''}</div>
    <div class="quote-text">${q.text}</div>
    ${trans ? `<div class="quote-trans">📝 ${trans}</div>` : ''}
    <div class="quote-meta"><span>👤 <a href="${pl}">${pn}</a></span><span>📖 ${q.source}</span></div>
    ${interp ? `<div class="quote-interp">💡 ${interp}</div>` : ''}
    <div class="quote-tags">${(q.tags||[]).map(t => `<span>#${t}</span>`).join('')}</div>
  </div>`;
}

/* ---- 渲染 ---- */
function renderQuotes(quotes) {
  const list = document.getElementById('quoteList');
  if (!list) return;
  if (!quotes.length) {
    list.innerHTML = '<div class="quote-card" style="text-align:center;color:var(--text-muted);padding:40px;">📭 没有匹配的格言</div>';
    return;
  }
  list.innerHTML = quotes.map(q => buildCard(q, false)).join('');
}

function applyFilters() {
  const filtered = getFiltered();
  const { items, total, totalPages } = getPageItems(filtered);
  renderQuotes(items);
  renderPagination(total, totalPages);
  const el = document.getElementById('countInfo');
  if (el) el.textContent = `📚 共 ${total} 条格言（第 ${currentPage}/${totalPages} 页）`;
}

/* ---- 随机 ---- */
function showRandom() {
  const filtered = getFiltered();
  if (!filtered.length) return;
  const q = filtered[Math.floor(Math.random() * filtered.length)];
  const list = document.getElementById('quoteList');
  const pagination = document.getElementById('pagination');
  if (pagination) pagination.innerHTML = '';
  if (list) list.innerHTML = buildCard(q, false) + '<div style="text-align:center;font-size:0.82rem;color:var(--text-muted);margin-top:8px;">🎲 随机一句（从当前筛选中抽取）</div>';
}

/* ---- 重置 ---- */
function resetFilters() {
  faceFilter = 'all'; personFilter = 'all'; tagFilter = 'all'; currentPage = 1;
  document.querySelectorAll('.face-btn').forEach(b => { b.className = 'face-btn'; if (b.dataset.face === 'all') b.classList.add('active-all'); });
  document.getElementById('personSelect').value = 'all';
  document.getElementById('tagSelect').value = 'all';
  applyFilters();
}

/* ---- 事件绑定 ---- */
document.addEventListener('DOMContentLoaded', () => {
  init();
  document.querySelectorAll('.face-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.face-btn').forEach(b => b.className = 'face-btn');
      faceFilter = this.dataset.face;
      this.classList.add(`active-${faceFilter}`);
      currentPage = 1; applyFilters();
    });
  });
  const ps = document.getElementById('personSelect');
  if (ps) ps.addEventListener('change', function() { personFilter = this.value; currentPage = 1; applyFilters(); });
  const ts = document.getElementById('tagSelect');
  if (ts) ts.addEventListener('change', function() { tagFilter = this.value; currentPage = 1; applyFilters(); });
  const rb = document.getElementById('randomBtn');
  if (rb) rb.addEventListener('click', showRandom);
  const db = document.getElementById('dailyBtn');
  if (db) db.addEventListener('click', () => { showDailyQuote(); document.getElementById('dailySection')?.scrollIntoView({ behavior: 'smooth' }); });
  const rset = document.getElementById('resetBtn');
  if (rset) rset.addEventListener('click', resetFilters);
});
