/* 🌟 韬略之道 · 人物谱系图逻辑 */

/* ---- 人物数据 ---- */
const PEOPLE = [
  // 兵家（12人）— 按时代排序
  { id:'jiangziya',   name:'姜子牙', era:'商周',   school:'bingjia', icon:'🎣', link:'people/bingjia/jiangziya.html' },
  { id:'simarangju',  name:'司马穰苴', era:'春秋', school:'bingjia', icon:'📜', link:'people/bingjia/simarangju.html' },
  { id:'sunzi',       name:'孙子',  era:'春秋', school:'bingjia', icon:'⚔', link:'people/bingjia/sunzi.html' },
  { id:'wuzi',        name:'吴起',  era:'战国', school:'bingjia', icon:'🔱', link:'people/bingjia/wuzi.html' },
  { id:'sunbin',      name:'孙膑',  era:'战国', school:'bingjia', icon:'🦵', link:'people/bingjia/sunbin.html' },
  { id:'weiliao',     name:'尉缭',  era:'战国', school:'bingjia', icon:'📐', link:'people/bingjia/weiliao.html' },
  { id:'baiqi',       name:'白起',  era:'战国', school:'bingjia', icon:'💀', link:'people/bingjia/baiqi.html' },
  { id:'hanxin',      name:'韩信',  era:'秦末汉初', school:'bingjia', icon:'🐍', link:'people/bingjia/hanxin.html' },
  { id:'caocao',      name:'曹操',  era:'东汉末', school:'bingjia', icon:'🏴', link:'people/bingjia/caocao.html' },
  { id:'lijing',      name:'李靖',  era:'唐',   school:'bingjia', icon:'🏔', link:'people/bingjia/lijing.html' },
  { id:'yuefei',      name:'岳飞',  era:'南宋', school:'bingjia', icon:'🛡', link:'people/bingjia/yuefei.html' },
  { id:'qi-jiguang',  name:'戚继光', era:'明',   school:'bingjia', icon:'⛵', link:'people/bingjia/qi-jiguang.html' },

  // 道家（9人）
  { id:'laozi',       name:'老子',  era:'春秋', school:'daoren', icon:'☯', link:'people/daojia/laozi.html' },
  { id:'guanyinzi',   name:'关尹子', era:'春秋', school:'daoren', icon:'🚪', link:'people/daojia/guanyinzi.html' },
  { id:'wenzi',       name:'文子',  era:'春秋', school:'daoren', icon:'📖', link:'people/daojia/wenzi.html' },
  { id:'liezi',       name:'列子',  era:'战国', school:'daoren', icon:'🪁', link:'people/daojia/liezi.html' },
  { id:'zhuangzi',    name:'庄子',  era:'战国', school:'daoren', icon:'🦋', link:'people/daojia/zhuangzi.html' },
  { id:'heshanggong', name:'河上公', era:'西汉', school:'daoren', icon:'🏞', link:'people/daojia/heshanggong.html' },
  { id:'jikang',      name:'嵇康',  era:'三国魏', school:'daoren', icon:'🎶', link:'people/daojia/jikang.html' },
  { id:'gehong',      name:'葛洪',  era:'东晋', school:'daoren', icon:'🧪', link:'people/daojia/gehong.html' },
  { id:'taoyuanming', name:'陶渊明', era:'东晋', school:'daoren', icon:'🌼', link:'people/daojia/taoyuanming.html' },

  // 跨界（9人）
  { id:'huangdi',     name:'轩辕黄帝', era:'上古', school:'crossover', icon:'🐉', link:'people/crossover/huangdi.html' },
  { id:'fanli',       name:'范蠡',  era:'春秋', school:'crossover', icon:'💰', link:'people/crossover/fanli.html' },
  { id:'xunzi',       name:'荀子',  era:'战国', school:'crossover', icon:'🎓', link:'people/crossover/xunzi.html' },
  { id:'zhangliang',  name:'张良',  era:'秦末汉初', school:'crossover', icon:'♟', link:'people/crossover/zhangliang.html' },
  { id:'zhugeliang',  name:'诸葛亮', era:'三国', school:'crossover', icon:'🪶', link:'people/crossover/zhugeliang.html' },
  { id:'guoziyi',     name:'郭子仪', era:'唐',   school:'crossover', icon:'🏅', link:'people/crossover/guoziyi.html' },
  { id:'liubowen',    name:'刘伯温', era:'元末明初', school:'crossover', icon:'🔮', link:'people/crossover/liubowen.html' },
  { id:'wangyangming',name:'王阳明', era:'明',   school:'crossover', icon:'🧠', link:'people/crossover/wangyangming.html' },
  { id:'zeng-guofan', name:'曾国藩', era:'清',   school:'crossover', icon:'📝', link:'people/crossover/zeng-guofan.html' },
];

/* ---- 关联关系 ---- */
// 每条关系：[fromId, toId, type]
// type: 'teach' 传承 / 'influence' 影响 / 'echo' 呼应
const RELATIONS = [
  ['huangdi',  'laozi',       'influence'],  // 黄老之学
  ['huangdi',  'sunzi',       'influence'],  // 黄帝兵法源流
  ['laozi',    'wenzi',       'teach'],      // 老子传文子
  ['laozi',    'guanyinzi',   'teach'],      // 老子过关授关尹
  ['wenzi',    'liezi',       'teach'],      // 文子传列子
  ['liezi',    'zhuangzi',    'influence'],  // 列子影响庄子
  ['laozi',    'zhuangzi',    'influence'],  // 老庄一脉
  ['jiangziya','sunzi',       'influence'],  // 太公兵法影响孙子
  ['sunzi',    'sunbin',      'teach'],      // 孙氏兵法传承
  ['sunzi',    'wuzi',        'influence'],  // 孙子对吴起的影响
  ['sunzi',    'lijing',      'teach'],      // 李靖承孙子
  ['sunzi',    'weiliao',     'influence'],  // 孙子影响尉缭
  ['jiangziya','weiliao',     'influence'],  // 太公兵法影响尉缭
  ['huangdi',  'weiliao',     'influence'],  // 黄帝兵法传统影响尉缭
  ['wuzi',     'weiliao',     'influence'],  // 吴起与尉缭同为战国兵家
  ['weiliao',  'zhangliang',  'influence'],  // 尉缭思想影响张良
  ['weiliao',  'hanxin',      'influence'],  // 尉缭影响韩信
  ['fanli',    'zhangliang',  'echo'],       // 功成身退传承
  ['fanli',    'zhugeliang',  'echo'],       // 智慧谋臣同脉
  ['zhangliang','zhugeliang', 'echo'],       // 运筹帷幄传承
  ['xunzi',    'zhugeliang',  'influence'],  // 荀子影响诸葛亮（法礼兼修）
  ['zhugeliang','wangyangming','influence'], // 淡泊明志影响心学
  ['wangyangming','zeng-guofan','teach'],    // 王阳明影响曾国藩
  ['guoziyi',  'zeng-guofan', 'echo'],       // 中兴名臣呼应
  ['simarangju','sunzi',      'influence'],  // 司马法影响孙子
  ['hanxin',   'lijing',      'influence'],  // 韩信兵法影响李靖
  ['caocao',   'zhugeliang',  'echo'],       // 三国双雄呼应
  ['yuefei',   'qi-jiguang',  'echo'],       // 兵家忠勇传承
  ['laozi',    'heshanggong', 'teach'],      // 河上公注老子
  ['zhuangzi', 'jikang',      'influence'],  // 庄子影响嵇康
  ['zhuangzi', 'taoyuanming', 'influence'],  // 庄子影响陶渊明
  ['gehong',   'taoyuanming', 'echo'],       // 东晋双璧
  ['baiqi',    'hanxin',      'echo'],       // 战国杀神→兵仙
  ['liubowen', 'wangyangming','echo'],       // 明朝文武呼应
  ['xunzi',    'liubowen',    'influence'],  // 荀学影响刘伯温
  ['laozi',    'xunzi',       'influence'],  // 道对荀子的影响
  ['wenzi',    'xunzi',       'influence'],  // 文子与荀子
  ['sunzi',    'caocao',      'teach'],      // 曹操注孙子
];

/* ---- 时代排序 ---- */
const ERA_ORDER = ['上古','商周','春秋','战国','秦末汉初','西汉','东汉末','三国','三国魏','唐','东晋','南宋','元末明初','明','清'];

/* ---- 渲染 ---- */
function renderLineage() {
  const laneBingjia = document.getElementById('laneBingjia');
  const laneCrossover = document.getElementById('laneCrossover');
  const laneDaoren = document.getElementById('laneDaoren');

  // 按时代分组
  const byEra = {};
  PEOPLE.forEach(p => {
    if (!byEra[p.era]) byEra[p.era] = { bingjia:[], daoren:[], crossover:[] };
    byEra[p.era][p.school].push(p);
  });

  // 生成时代筛选按钮
  const filterContainer = document.getElementById('eraFilters');

  // 给硬编码的"全部"按钮绑定事件
  const allBtn = filterContainer.querySelector('[data-era="all"]');
  if (allBtn) {
    allBtn.addEventListener('click', () => filterByEra('all'));
  }

  ERA_ORDER.forEach(era => {
    if (byEra[era]) {
      const btn = document.createElement('button');
      btn.className = 'era-filter-btn';
      btn.dataset.era = era;
      btn.textContent = era;
      btn.addEventListener('click', () => filterByEra(era));
      filterContainer.appendChild(btn);
    }
  });

  // 渲染每条车道
  function renderLane(container, school) {
    ERA_ORDER.forEach(era => {
      const people = byEra[era]?.[school];
      if (!people || !people.length) return;

      const row = document.createElement('div');
      row.className = 'era-row';
      row.dataset.era = era;

      people.forEach(p => {
        const node = document.createElement('a');
        node.href = p.link;
        node.className = `person-node ${p.school}`;
        node.dataset.id = p.id;
        node.dataset.era = era;
        node.dataset.school = p.school;
        node.innerHTML = `
          <span class="node-icon">${p.icon}</span>
          <span class="node-name">${p.name}</span>
          <span class="node-era">${p.era}</span>
        `;

        node.addEventListener('mouseenter', () => highlightRelations(p.id));
        node.addEventListener('mouseleave', clearHighlight);
        node.addEventListener('click', (e) => {
          // 允许普通点击导航，不阻止
        });

        row.appendChild(node);
      });

      container.appendChild(row);
    });
  }

  renderLane(laneBingjia, 'bingjia');
  renderLane(laneCrossover, 'crossover');
  renderLane(laneDaoren, 'daoren');

  // 绘制连线
  drawLines();
}

/* ---- SVG 连线 ---- */
function drawLines() {
  const svg = document.getElementById('lineageSvg');
  const chart = document.getElementById('lineageChart');
  const chartRect = chart.getBoundingClientRect();

  svg.setAttribute('width', chart.scrollWidth);
  svg.setAttribute('height', chart.scrollHeight);
  svg.style.width = chart.scrollWidth + 'px';
  svg.style.height = chart.scrollHeight + 'px';

  RELATIONS.forEach(([fromId, toId, type]) => {
    const fromEl = document.querySelector(`.person-node[data-id="${fromId}"]`);
    const toEl = document.querySelector(`.person-node[data-id="${toId}"]`);
    if (!fromEl || !toEl) return;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    const chartRect = chart.getBoundingClientRect();

    const x1 = fromRect.right - chartRect.left;
    const y1 = fromRect.top + fromRect.height/2 - chartRect.top;
    const x2 = toRect.left - chartRect.left;
    const y2 = toRect.top + toRect.height/2 - chartRect.top;

    const cx = (x1 + x2) / 2;
    const dx = Math.abs(x2 - x1) * 0.4;

    let pathClass = 'relation-line in-school';
    const fromSchool = fromEl.dataset.school;
    const toSchool = toEl.dataset.school;
    if (fromSchool !== toSchool) {
      pathClass = 'relation-line cross-school';
    }
    if (type === 'echo') {
      pathClass = 'relation-line bingjia-daoren';
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M${x1},${y1} C${x1+dx},${y1} ${x2-dx},${y2} ${x2},${y2}`);
    path.className.baseVal = pathClass;
    path.dataset.from = fromId;
    path.dataset.to = toId;
    svg.appendChild(path);
  });
}

/* ---- 高亮关联 ---- */
let activeHighlight = false;

function highlightRelations(personId) {
  if (activeHighlight) clearHighlight();

  // 找到关联的 personIds
  const related = new Set();
  related.add(personId);
  RELATIONS.forEach(([fromId, toId]) => {
    if (fromId === personId) related.add(toId);
    if (toId === personId) related.add(fromId);
  });

  // 高亮节点
  document.querySelectorAll('.person-node').forEach(el => {
    const id = el.dataset.id;
    if (related.has(id)) {
      el.classList.add('highlighted');
    } else {
      el.classList.add('dimmed');
    }
  });

  // 高亮连线
  document.querySelectorAll('.relation-line').forEach(line => {
    const from = line.dataset.from;
    const to = line.dataset.to;
    if ((from === personId && related.has(to)) || (to === personId && related.has(from))) {
      line.classList.add('active');
    }
  });

  activeHighlight = true;
}

function clearHighlight() {
  document.querySelectorAll('.person-node').forEach(el => {
    el.classList.remove('highlighted', 'dimmed');
  });
  document.querySelectorAll('.relation-line').forEach(line => {
    line.classList.remove('active');
  });
  activeHighlight = false;
}

/* ---- 时代筛选 ---- */
let currentEraFilter = 'all';

function filterByEra(era) {
  currentEraFilter = era;

  // 更新按钮状态
  document.querySelectorAll('.era-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.era === era);
  });

  // 全部
  if (era === 'all') {
    document.querySelectorAll('.era-row').forEach(row => row.style.display = '');
    document.querySelectorAll('.person-node').forEach(n => n.style.display = '');
    document.querySelectorAll('.relation-line').forEach(l => l.style.display = '');
    return;
  }

  // 显示/隐藏时代行
  document.querySelectorAll('.era-row').forEach(row => {
    row.style.display = row.dataset.era === era ? '' : 'none';
  });

  // 隐藏所有节点和连线（由时代行控制）
  document.querySelectorAll('.person-node').forEach(n => n.style.display = '');
  document.querySelectorAll('.relation-line').forEach(l => l.style.display = '');

  // 重新绘制连线的可见性——只显示筛选后时代内的连线
  document.querySelectorAll('.relation-line').forEach(l => {
    const fromEl = document.querySelector(`.person-node[data-id="${l.dataset.from}"]`);
    const toEl = document.querySelector(`.person-node[data-id="${l.dataset.to}"]`);
    if (!fromEl || !toEl) {
      l.style.display = 'none';
      return;
    }
    const fromEra = fromEl.dataset.era;
    const toEra = toEl.dataset.era;
    // 如果两个端点都是当前时代，显示连线
    l.style.display = (fromEra === era && toEra === era) ? '' : 'none';
  });
}

/* ---- 窗口调整重新绘制 ---- */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.getElementById('lineageSvg').innerHTML = '';
    drawLines();
    if (currentEraFilter !== 'all') filterByEra(currentEraFilter);
  }, 250);
});

/* ---- 启动（安全模式） ---- */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderLineage);
} else {
  renderLineage();
}
