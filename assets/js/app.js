/* ========================================
   韬略之道 · Tao of Strategy — App Logic
   ======================================== */

let allQuotes = [];
let faceFilter = 'all';
let personFilter = 'all';
let tagFilter = 'all';
let currentView = 'all'; // 'all' | 'random' | 'daily'

/* ---- Fetch & Init ---- */
async function init() {
  try {
    const res = await fetch('quotes/quotes.json');
    const data = await res.json();
    allQuotes = data.quotes;
    populatePersonOptions();
    populateTagOptions();
    renderDailyQuote();
    renderQuotes(allQuotes);
    updateCount(allQuotes.length);
    document.getElementById('loading').style.display = 'none';
  } catch (err) {
    document.getElementById('loading').textContent = '⚠️ 格言数据加载失败，请确认 quotes.json 已部署';
    console.error(err);
  }
}

/* ---- Populate Dropdowns ---- */
function populatePersonOptions() {
  const people = [...new Set(allQuotes.map(q => q.personId))].sort();
  const sel = document.getElementById('personSelect');
  sel.innerHTML = '<option value="all">全部人物</option>';
  people.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = personDisplayName(p);
    sel.appendChild(opt);
  });
}

function populateTagOptions() {
  const tagSet = new Set();
  allQuotes.forEach(q => (q.tags || []).forEach(t => tagSet.add(t)));
  const tags = [...tagSet].sort();
  const sel = document.getElementById('tagSelect');
  sel.innerHTML = '<option value="all">全部标签</option>';
  tags.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = `#${t}`;
    sel.appendChild(opt);
  });
}

function personDisplayName(id) {
  const map = {
    'sunzi': '孙子', 'wuzi': '吴起', 'sunbin': '孙膑', 'weiliao': '尉缭',
    'caocao': '曹操', 'lijing': '李靖', 'hanxin': '韩信', 'simarangju': '司马穰苴',
    'laozi': '老子', 'zhuangzi': '庄子', 'liezi': '列子', 'wenzi': '文子',
    'heshanggong': '河上公',
    'fanli': '范蠡', 'zhangliang': '张良', 'zhugeliang': '诸葛亮',
    'liubowen': '刘伯温', 'wangyangming': '王阳明'
  };
  return map[id] || id;
}

function faceDisplayName(id) {
  const map = { 'jin': '进取', 'bi': '避世', 'zhuan': '转化' };
  return map[id] || id;
}

/* ---- Filter ---- */
function getFilteredQuotes() {
  let result = [...allQuotes];

  if (faceFilter !== 'all') {
    result = result.filter(q => q.face === faceFilter);
  }
  if (personFilter !== 'all') {
    result = result.filter(q => q.personId === personFilter);
  }
  if (tagFilter !== 'all') {
    result = result.filter(q => (q.tags || []).includes(tagFilter));
  }

  return result;
}

/* ---- Random Quote ---- */
function getRandomQuote() {
  const filtered = getFilteredQuotes();
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

/* ---- Daily Quote (deterministic) ---- */
function getDailyQuote() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
  // Simple hash from date string
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % allQuotes.length;
  return allQuotes[idx];
}

/* ---- Render ---- */
function renderQuotes(quotes) {
  const list = document.getElementById('quoteList');
  if (quotes.length === 0) {
    list.innerHTML = '<div class="quote-card" style="text-align:center;color:var(--text-muted);">没有匹配的格言</div>';
    return;
  }
  list.innerHTML = quotes.map(q => renderCard(q)).join('');
  updateCount(quotes.length);
}

function renderCard(q) {
  const faceZh = faceDisplayName(q.face);
  const faceClass = `face-jin`; // We'll set proper class below
  let faceClassActual = 'face-jin';
  if (q.face === 'bi') faceClassActual = 'face-bi';
  else if (q.face === 'zhuan') faceClassActual = 'face-zhuan';

  const personLink = `people/${q.face === 'jin' ? 'bingjia' : q.face === 'bi' ? 'daojia' : 'crossover'}/${q.personId}.html`;

  return `
    <div class="quote-card">
      <div class="quote-text">${q.text}</div>
      <div class="quote-meta">
        <span><span class="face-badge ${faceClassActual}">${faceZh}</span></span>
        <span>📖 ${q.source}</span>
        <span>👤 <a href="${personLink}">${personDisplayName(q.personId)}</a></span>
        ${q.titleEn ? `<span>🏷 ${q.titleEn}</span>` : ''}
      </div>
      ${q.interp ? `<div class="quote-interp">${q.interp}</div>` : ''}
      <div class="quote-tags">
        ${(q.tags || []).map(t => `<span>#${t}</span>`).join('')}
      </div>
    </div>
  `;
}

function renderDailyQuote() {
  const q = getDailyQuote();
  if (!q) return;
  const container = document.getElementById('dailyQuote');
  container.innerHTML = renderCard(q);
}

function renderRandomQuote() {
  const q = getRandomQuote();
  if (!q) {
    document.getElementById('quoteList').innerHTML =
      '<div class="quote-card" style="text-align:center;color:var(--text-muted);">当前筛选条件下没有格言</div>';
    return;
  }
  document.getElementById('quoteList').innerHTML = renderCard(q);
}

function updateCount(n) {
  document.getElementById('countInfo').textContent = `共 ${n} 条格言`;
}

/* ---- UI Event Handlers ---- */

// Face buttons
document.querySelectorAll('.face-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.face-btn').forEach(b => {
      b.className = 'face-btn';
    });
    faceFilter = this.dataset.face;
    this.classList.add(`active-${faceFilter}`);
    applyFilters();
  });
});

// Person select
document.getElementById('personSelect').addEventListener('change', function() {
  personFilter = this.value;
  applyFilters();
});

// Tag select
document.getElementById('tagSelect').addEventListener('change', function() {
  tagFilter = this.value;
  applyFilters();
});

// Random button
document.getElementById('randomBtn').addEventListener('click', function() {
  if (allQuotes.length === 0) return;
  renderRandomQuote();
});

// Daily quote toggle
document.getElementById('dailyBtn').addEventListener('click', function() {
  renderDailyQuote();
  document.getElementById('quoteList').innerHTML = '';
  document.getElementById('dailySection').scrollIntoView({ behavior: 'smooth' });
});

// Reset filters
document.getElementById('resetBtn').addEventListener('click', function() {
  faceFilter = 'all';
  personFilter = 'all';
  tagFilter = 'all';
  document.querySelectorAll('.face-btn').forEach(b => {
    b.className = 'face-btn';
    if (b.dataset.face === 'all') b.classList.add('active-all');
  });
  document.getElementById('personSelect').value = 'all';
  document.getElementById('tagSelect').value = 'all';
  applyFilters();
});

function applyFilters() {
  const filtered = getFilteredQuotes();
  renderQuotes(filtered);
}

/* ---- Init on Load ---- */
document.addEventListener('DOMContentLoaded', init);
